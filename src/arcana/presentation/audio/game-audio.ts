import { soundAssets, type SoundAsset } from './assets';
import type { EffectSound } from './battle-audio-track';
import { AudioPreferencesStore } from './preferences';

export type AudioStatus = 'off' | 'loading' | 'ready' | 'blocked' | 'unavailable';
interface AudioDependencies {
  readonly createContext: () => AudioContext;
  readonly load: (url: string, signal: AbortSignal) => Promise<ArrayBuffer>;
}
const nativeDependencies: AudioDependencies = {
  createContext: () => new AudioContext({ latencyHint: 'interactive' }),
  load: async (url, signal) => {
    const response = await fetch(url, { signal, credentials: 'omit' });
    if (!response.ok) throw Error('Audio unavailable');
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > 2_000_000) throw Error('Audio exceeds budget');
    return bytes;
  },
};

/** Bounded presentation-only mixer. Nothing in this class writes a game or waits the replay. */
export class GameAudio {
  private context: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private effectsBus: GainNode | null = null;
  private master: GainNode | null = null;
  private music: AudioBufferSourceNode | null = null;
  private readonly voices = new Set<AudioBufferSourceNode>();
  private readonly buffers = new Map<SoundAsset, AudioBuffer>();
  private readonly pending = new Map<SoundAsset, Promise<void>>();
  private readonly requests = new Set<AbortController>();
  private readonly loadQueue: (() => void)[] = [];
  private activeLoads = 0;
  private readonly listeners = new Set<() => void>();
  private status: AudioStatus = 'off';
  private foreground = true;
  private unlocked = false;
  private battle = false;
  private generation = 0;
  constructor(
    private readonly preferences: AudioPreferencesStore,
    private readonly dependencies: AudioDependencies = nativeDependencies,
  ) {
    preferences.subscribe(() => {
      this.sync();
      // Preference changes may load only after consent in this document. They never unlock audio.
      if (this.unlocked && this.foreground) void this.prepare();
    });
  }
  getSnapshot = () => this.status;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private setStatus(status: AudioStatus) {
    if (status === this.status) return;
    this.status = status;
    this.listeners.forEach((listener) => listener());
  }
  /** Called synchronously by a deliberate gesture, before any fetch/await. */
  async activate(): Promise<boolean> {
    const p = this.preferences.getSnapshot();
    if ((!p.music && !p.effects) || !this.foreground) return false;
    const generation = this.generation;
    this.setStatus('loading');
    try {
      if (!this.context) {
        this.context = this.dependencies.createContext();
        this.musicBus = this.context.createGain();
        this.effectsBus = this.context.createGain();
        this.master = this.context.createGain();
        this.musicBus.gain.value = 0;
        this.effectsBus.gain.value = 0;
        this.master.gain.value = 0.7;
        this.musicBus.connect(this.master);
        this.effectsBus.connect(this.master);
        this.master.connect(this.context.destination);
      }
      const resume = this.context.resume();
      this.unlocked = true;
      await resume;
      if (generation !== this.generation) return false;
      if (this.context?.state !== 'running') {
        this.setStatus('blocked');
        return false;
      }
      return await this.prepare();
    } catch {
      if (generation !== this.generation) return false;
      this.setStatus(this.context ? 'blocked' : 'unavailable');
      return false;
    }
  }
  private wanted(name: SoundAsset) {
    const p = this.preferences.getSnapshot();
    return name === 'ambient' ? p.music : p.effects;
  }
  private async prepare(): Promise<boolean> {
    if (!this.unlocked || !this.context || !this.foreground) return false;
    const names = (Object.keys(soundAssets) as SoundAsset[])
      .filter((name) => this.wanted(name))
      .sort((a, b) => Number(b === 'ambient') - Number(a === 'ambient'));
    if (!names.length) {
      this.setStatus('off');
      return true;
    }
    const generation = this.generation;
    this.setStatus('loading');
    const results = await Promise.allSettled(names.map((name) => this.loadBuffer(name)));
    if (generation !== this.generation) return false;
    this.sync();
    const p = this.preferences.getSnapshot();
    if (!p.music && !p.effects) {
      this.setStatus('off');
      return true;
    }
    const ok = results.every((result) => result.status === 'fulfilled');
    this.setStatus(ok ? 'ready' : 'unavailable');
    return ok;
  }
  private loadBuffer(name: SoundAsset): Promise<void> {
    if (this.buffers.has(name)) return Promise.resolve();
    const pending = this.pending.get(name);
    if (pending) return pending;
    const context = this.context!;
    const generation = this.generation;
    let start!: () => void;
    const task = new Promise<void>((resolve, reject) => {
      start = () => {
        if (generation !== this.generation || !this.wanted(name)) {
          resolve();
          return;
        }
        this.activeLoads++;
        const request = new AbortController();
        this.requests.add(request);
        void (async () => {
          const bytes = await this.dependencies.load(soundAssets[name], request.signal);
          if (generation !== this.generation || !this.wanted(name)) return;
          const buffer = await context.decodeAudioData(bytes);
          if (generation !== this.generation || !this.wanted(name)) return;
          this.buffers.set(name, buffer);
          // A ready ambience never waits for optional effects. Effects still have no cue queue.
          if (name === 'ambient') this.sync();
        })()
          .finally(() => {
            this.requests.delete(request);
            this.activeLoads--;
            this.drainLoads();
          })
          .then(resolve, reject);
      };
    }).finally(() => {
      if (this.pending.get(name) === task) this.pending.delete(name);
    });
    this.pending.set(name, task);
    this.loadQueue.push(start);
    this.drainLoads();
    return task;
  }
  private drainLoads() {
    // The slot covers fetch AND decode, including work still finishing on an old context.
    while (this.activeLoads < 2 && this.loadQueue.length) this.loadQueue.shift()!();
  }
  private stop(source: AudioBufferSourceNode) {
    source.onended = null;
    try {
      source.stop();
    } catch {
      /* already ended or context lost */
    }
    source.disconnect();
  }
  private sync() {
    try {
      this.syncContext();
    } catch {
      this.setStatus('unavailable');
    }
  }
  private syncContext() {
    const p = this.preferences.getSnapshot();
    const context = this.context;
    if (!p.effects || !this.foreground) this.stopEffects();
    if (!p.music && this.music) {
      this.stop(this.music);
      this.music = null;
    }
    if (!p.music) this.buffers.delete('ambient');
    if (!p.effects)
      for (const name of [...this.buffers.keys()])
        if (name !== 'ambient') this.buffers.delete(name);
    if (!p.music && !p.effects) {
      this.setStatus('off');
      if (context) void context.suspend().catch(() => undefined);
    }
    if (!context) return;
    this.musicBus?.gain.setTargetAtTime(
      p.musicVolume * (this.battle ? 0.48 : 1),
      context.currentTime,
      0.08,
    );
    this.effectsBus?.gain.setTargetAtTime(p.effectsVolume * 0.75, context.currentTime, 0.015);
    if (p.music && this.foreground && this.unlocked && context.state === 'running' && !this.music) {
      const buffer = this.buffers.get('ambient');
      if (buffer) {
        try {
          const source = context.createBufferSource();
          source.buffer = buffer;
          source.loop = true;
          source.connect(this.musicBus!);
          this.music = source;
          source.start();
        } catch {
          this.music = null;
          this.setStatus('unavailable');
        }
      }
    }
  }
  play(name: EffectSound): void {
    const context = this.context,
      buffer = this.buffers.get(name);
    if (
      !context ||
      context.state !== 'running' ||
      !this.unlocked ||
      !this.foreground ||
      !this.preferences.getSnapshot().effects ||
      !buffer
    )
      return;
    // Never enqueue: a late download must not produce a displaced impact or a burst after pause.
    while (this.voices.size >= 4) {
      const oldest = this.voices.values().next().value!;
      this.voices.delete(oldest);
      this.stop(oldest);
    }
    try {
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.effectsBus!);
      source.onended = () => {
        this.voices.delete(source);
        source.disconnect();
      };
      this.voices.add(source);
      source.start();
    } catch {
      this.stopEffects();
      this.setStatus('unavailable');
    }
  }
  stopEffects() {
    for (const source of this.voices) this.stop(source);
    this.voices.clear();
  }
  setBattleActive(active: boolean) {
    if (this.battle === active) return;
    this.battle = active;
    this.sync();
  }
  setForeground(visible: boolean) {
    this.foreground = visible;
    this.sync();
    const context = this.context;
    if (!context) return;
    if (!visible) void context.suspend().catch(() => undefined);
    else if (
      this.unlocked &&
      (this.preferences.getSnapshot().music || this.preferences.getSnapshot().effects)
    )
      void context
        .resume()
        .then(() => this.sync())
        .catch(() => this.setStatus('blocked'));
  }
  diagnostics() {
    return {
      context: !!this.context,
      musicVoices: this.music ? 1 : 0,
      effectVoices: this.voices.size,
      buffers: this.buffers.size,
    };
  }
  dispose() {
    this.generation++;
    this.unlocked = false;
    this.stopEffects();
    if (this.music) this.stop(this.music);
    this.music = null;
    for (const request of this.requests) request.abort();
    this.requests.clear();
    // Settle queued promises without starting requests; their captured generation is invalid.
    for (const cancel of this.loadQueue.splice(0)) cancel();
    this.pending.clear();
    this.buffers.clear();
    this.musicBus?.disconnect();
    this.effectsBus?.disconnect();
    this.master?.disconnect();
    const context = this.context;
    this.context = null;
    this.musicBus = null;
    this.effectsBus = null;
    this.master = null;
    if (context) void context.close().catch(() => undefined);
    this.setStatus('off');
  }
}
