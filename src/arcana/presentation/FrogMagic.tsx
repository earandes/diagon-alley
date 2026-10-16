import { useEffect, useRef } from 'react';

const MAX_DURATION_MS = 3200;
const MAX_SPARK_COUNT = 24;
const SPRITE_SIZE = 28;

/** Prepaint the small glow once; every animation frame only composites these sprites. */
function sparkSprite(color: string): HTMLCanvasElement | null {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = SPRITE_SIZE;
  const ink = sprite.getContext('2d');
  if (!ink) return null;
  const center = SPRITE_SIZE / 2;
  const halo = ink.createRadialGradient(center, center, 0, center, center, center);
  halo.addColorStop(0, color);
  halo.addColorStop(0.18, `${color}a0`);
  halo.addColorStop(0.55, `${color}30`);
  halo.addColorStop(1, `${color}00`);
  ink.fillStyle = halo;
  ink.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  ink.strokeStyle = '#fff5d8';
  ink.lineWidth = 1.5;
  ink.beginPath();
  ink.moveTo(center - 3, center);
  ink.lineTo(center + 3, center);
  ink.moveTo(center, center - 3);
  ink.lineTo(center, center + 3);
  ink.stroke();
  return sprite;
}

/** A bounded cosmetic burst; it owns no random/economic input or game state. */
export function FrogMagic({
  active,
  paused = false,
  durationMs = MAX_DURATION_MS,
  count = MAX_SPARK_COUNT,
}: {
  active: boolean;
  paused?: boolean;
  durationMs?: number;
  count?: number;
}) {
  const pauseState = useRef(paused),
    control = useRef<(() => void) | null>(null);
  pauseState.current = paused;
  useEffect(() => {
    control.current?.();
  }, [paused]);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!active || !element) return;
    const duration = Number.isFinite(durationMs)
      ? Math.max(1, Math.min(MAX_DURATION_MS, durationMs))
      : MAX_DURATION_MS;
    const sparkCount = Number.isFinite(count)
      ? Math.max(0, Math.min(MAX_SPARK_COUNT, Math.floor(count)))
      : MAX_SPARK_COUNT;
    let disposed = false;
    let canvas: HTMLCanvasElement | undefined;
    let frame = 0;
    let observer: ResizeObserver | undefined;
    let visibility: (() => void) | undefined;
    const dispose = () => {
      disposed = true;
      control.current = null;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      if (visibility) document.removeEventListener('visibilitychange', visibility);
      canvas?.remove();
      delete element.dataset.renderer;
    };
    try {
      canvas = document.createElement('canvas');
      canvas.dataset.effect = 'frog-magic';
      const ink = canvas.getContext('2d', { alpha: true });
      const gold = sparkSprite('#f4d995'),
        teal = sparkSprite('#b7e5e0');
      if (!ink || !gold || !teal) {
        dispose();
        return;
      }
      const surface = canvas;
      const resolution = Math.min(devicePixelRatio || 1, 1.5);
      let width = 0,
        height = 0;
      const resize = () => {
        const nextWidth = element.clientWidth || 480;
        const nextHeight = element.clientHeight || 480;
        if (width === nextWidth && height === nextHeight) return;
        width = nextWidth;
        height = nextHeight;
        surface.width = Math.round(width * resolution);
        surface.height = Math.round(height * resolution);
      };
      resize();
      element.append(surface);
      observer = new ResizeObserver(resize);
      observer.observe(element);
      element.dataset.renderer = 'canvas2d';
      element.dataset.renderCount = '0';
      delete element.dataset.finished;
      let elapsed = 0,
        previous: number | undefined,
        renderCount = 0;
      const draw = (time: number) => {
        frame = 0;
        if (disposed || document.hidden || pauseState.current) {
          previous = undefined;
          return;
        }
        if (previous !== undefined) elapsed += time - previous;
        previous = time;
        const progress = Math.min(elapsed / duration, 1);
        ink.setTransform(resolution, 0, 0, resolution, 0, 0);
        ink.clearRect(0, 0, width, height);
        ink.globalCompositeOperation = 'lighter';
        ink.globalAlpha = Math.sin(progress * Math.PI) * 0.8;
        const scale = 0.7 + Math.sin(progress * Math.PI) * 0.8;
        for (let index = 0; index < sparkCount; index++) {
          const phase = index * 2.39996 + progress * 2.4;
          const distance = (35 + (index % 7) * 13) * (0.3 + progress * 1.9);
          ink.save();
          ink.translate(
            width / 2 + Math.cos(phase) * distance,
            height / 2 + Math.sin(phase) * distance * 0.76,
          );
          ink.rotate(phase);
          ink.scale(scale, scale);
          ink.drawImage(index % 3 ? gold : teal, -SPRITE_SIZE / 2, -SPRITE_SIZE / 2);
          ink.restore();
        }
        element.dataset.renderCount = String(++renderCount);
        if (progress < 1) frame = requestAnimationFrame(draw);
        else element.dataset.finished = 'true';
      };
      visibility = () => {
        cancelAnimationFrame(frame);
        // Hidden time must not become one giant simulation step on return.
        previous = undefined;
        if (!disposed && !document.hidden && !pauseState.current && elapsed < duration)
          frame = requestAnimationFrame(draw);
      };
      control.current = visibility;
      document.addEventListener('visibilitychange', visibility);
      visibility();
    } catch {
      dispose();
      // The DOM illustration and committed card are the complete fallback.
    }
    return dispose;
  }, [active, durationMs, count]);
  return <div className="frog-magic" ref={host} aria-hidden="true" />;
}
