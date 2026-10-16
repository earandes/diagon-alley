import { Application, Graphics, Sprite, Texture } from 'pixi.js';
import { visualAsset } from '../content-packs/art';
import { activePack } from '../content-packs/active';
const paletteColor = (key: keyof typeof activePack.palette) =>
  parseInt(activePack.palette[key].slice(1), 16);
import type { MapLayout } from './map-layout';
import type { ReplayFrame } from '../../application/client/battle-replay';
import type { BattleEvent } from '../../domain/combat/engine';
import type { ReplayClock } from '../motion/replay-clock';
export interface ArenaPosition {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly figureHeight?: number;
}
export type SceneData =
  | {
      readonly kind: 'map';
      readonly layout: MapLayout;
      readonly visited: readonly string[];
      readonly available: readonly string[];
    }
  | {
      readonly kind: 'arena';
      readonly positions?: readonly ArenaPosition[];
      readonly appearances?: Readonly<Record<string, string>>;
      readonly frame: ReplayFrame;
      readonly next: BattleEvent | null;
      readonly playing: boolean;
      readonly speed: 1 | 2;
      readonly clock?: Pick<ReplayClock, 'snapshot'>;
    };
export async function createPixiScene(host: HTMLElement, data: SceneData) {
  const app = new Application();
  try {
    await app.init({
      width: Math.max(1, host.clientWidth),
      height: host.clientHeight || 520,
      resolution: Math.min(devicePixelRatio || 1, 2),
      autoDensity: true,
      // Avoid multisample buffer cost for this procedural scene; DOM text stays native.
      antialias: false,
      backgroundAlpha: 0,
      autoStart: false,
      preference: ['webgl'],
    });
  } catch (error) {
    try {
      app.destroy({ removeView: true, releaseGlobalResources: false }, { children: true });
    } catch {
      /* Failed initialization may not have a renderer. */
    }
    throw error;
  }
  app.canvas.setAttribute('aria-hidden', 'true');
  host.dataset.renderer = 'webgl';
  app.ticker.remove(app.render, app);
  host.appendChild(app.canvas);
  const ink = new Graphics(),
    sparks = new Graphics();
  app.stage.addChild(ink);
  const textures = new Map<string, Texture>(),
    figures = new Map<string, Sprite>(),
    loading = new Set<string>();
  const poses = new Map<
    string,
    { x: number; y: number; alive: boolean; entered: number; sx: number; sy: number }
  >();
  let destroyed = false;
  app.stage.addChild(sparks);
  const positions = new Map<string, { x: number; y: number }>();
  // Keep stage geometry between log events; only projectile geometry changes each frame.
  let dirty = true;
  let current = data,
    elapsed = 0,
    stamp = -1,
    renders = 0;
  let viewWidth = host.clientWidth,
    viewHeight = host.clientHeight;
  const paint = () => {
    if (destroyed) return;
    const width = viewWidth,
      height = viewHeight;
    if (width < 1 || height < 1) return;
    if (app.screen.width !== width || app.screen.height !== height) {
      app.renderer.resize(width, height);
      dirty = true;
    }
    if (dirty) {
      ink.clear();
      if (current.kind === 'map') {
        const sx = width / current.layout.width;
        for (const edge of current.layout.edges) {
          const dx = (edge.to.x - edge.from.x) * sx,
            dy = edge.to.y - edge.from.y,
            length = Math.hypot(dx, dy),
            steps = Math.ceil(length / 10);
          for (let i = 0; i < steps; i++) {
            const f = i / steps;
            ink.circle(edge.from.x * sx + dx * f, edge.from.y + dy * f, 2.1).fill({
              color: paletteColor('gold'),
              alpha: current.visited.includes(edge.from.id)
                ? 0.95
                : current.available.includes(edge.from.id)
                  ? 0.8
                  : 0.42,
            });
          }
        }
      } else {
        ink
          .rect(width * 0.42, 0, width * 0.16, height)
          .fill({ color: paletteColor('surface'), alpha: 0.12 });
        positions.clear();
        for (const side of ['player', 'rival'] as const) {
          const units = current.frame[side];
          for (const [index, unit] of units.entries()) {
            const measured = current.positions?.find((point) => point.id === unit.id);
            const x = measured?.x ?? width * (side === 'player' ? 0.22 : 0.78),
              y = measured?.y ?? 115 + index * 180,
              figureHeight = measured?.figureHeight ?? 105,
              figureScale = figureHeight / 105,
              color =
                side === 'player' ? paletteColor('unusualAccent') : paletteColor('rivalAccent');
            positions.set(unit.id, { x, y });
            ink
              .ellipse(x, y + 25 * figureScale, 45 * figureScale, 15 * figureScale)
              .fill({ color, alpha: 0.2 })
              .stroke({ color, width: 2 });
            ink
              .ellipse(x, y + 25 * figureScale, 31 * figureScale, 9 * figureScale)
              .stroke({ color, width: 1 });
            const assetKey = current.appearances?.[unit.id] ?? `character.${unit.wizardId}.figure`;
            const asset = visualAsset(assetKey);
            if (asset && !textures.has(assetKey) && !loading.has(assetKey)) {
              loading.add(assetKey);
              const image = new Image();
              image.src = asset.url;
              void image
                .decode()
                .then(() => {
                  if (destroyed) return;
                  textures.set(assetKey, Texture.from(image));
                  host.dataset.textureCount = String(textures.size);
                  host.dataset.textureBytes = String(
                    [...textures.values()].reduce((n, t) => n + t.width * t.height * 4, 0),
                  );
                  dirty = true;
                  paint();
                })
                .catch(() => {
                  /* Equivalent DOM artwork/text remains available. */
                });
            }
            const texture = textures.get(assetKey);
            if (texture) {
              let figure = figures.get(unit.id);
              if (!figure) {
                figure = new Sprite(texture);
                figure.anchor.set(0.5, 0.5);
                app.stage.addChildAt(figure, Math.max(1, app.stage.children.length - 1));
                figures.set(unit.id, figure);
                poses.set(unit.id, {
                  x: 0,
                  y: 0,
                  alive: unit.hp > 0,
                  entered: performance.now(),
                  sx: 1,
                  sy: 1,
                });
              }
              const pivot = asset?.pivot ?? [0.5, 0.9];
              figure.anchor.set(pivot[0], pivot[1]);
              figure.position.set(
                x + ((pivot[0] - 0.5) * figureHeight * texture.width) / texture.height,
                y + (pivot[1] - 0.5) * figureHeight,
              );
              figure.height = figureHeight;
              figure.width = (figureHeight * texture.width) / texture.height;
              figure.alpha = unit.hp > 0 ? 1 : 0.35;
              figure.tint = unit.hp > 0 ? 0xffffff : 0x999999;
              figure.rotation = unit.hp > 0 ? 0 : 0.12;
              const pose = poses.get(unit.id)!;
              pose.x = figure.x;
              pose.y = figure.y;
              pose.alive = unit.hp > 0;
              pose.sx = figure.scale.x;
              pose.sy = figure.scale.y;
            }
          }
        }
      }
      dirty = false;
    }
    if (current.kind === 'arena') {
      host.dataset.artReady = String(
        [...current.frame.player, ...current.frame.rival].every((unit) => figures.has(unit.id)),
      );
      for (const [id, figure] of figures) {
        const pose = poses.get(id)!;
        const entry = current.clock
          ? current.clock.snapshot().cursor === 0
            ? current.clock.snapshot().progress
            : 1
          : current.playing
            ? Math.min(
                (performance.now() - pose.entered) /
                  Math.max(1, activePack.animations.arena.entryMs),
                1,
              )
            : 1;
        const hit =
          current.next?.kind === 'spell-cast' &&
          !current.next.missed &&
          current.next.targetId === id;
        const progress =
          current.clock?.snapshot().progress ??
          Math.min(elapsed / activePack.animations.arena.eventMs, 1);
        const actor = current.next?.kind === 'spell-cast' && current.next.actorId === id;
        const direction = pose.x < viewWidth / 2 ? 1 : -1;
        const anticipation = actor && progress < 0.18 ? Math.sin((progress / 0.18) * Math.PI) : 0;
        const contact =
          hit && progress >= 0.78 ? Math.sin(((progress - 0.78) / 0.22) * Math.PI) : 0;
        figure.position.set(
          pose.x - direction * anticipation * 3 - direction * contact * 6,
          pose.y + 8 * (1 - entry),
        );
        figure.scale.set(
          pose.sx * (1 - anticipation * 0.025),
          pose.sy * (1 + anticipation * 0.025),
        );
        figure.alpha = entry * (pose.alive ? 1 : 0.35);
        figure.rotation =
          (pose.alive ? 0 : 0.12) + -direction * (anticipation * 0.025 + contact * 0.035);
      }
    }
    sparks.clear();
    if (current.kind === 'arena') {
      const event = current.next;
      if (event?.kind === 'spell-cast') {
        const from = positions.get(event.actorId)!,
          to = positions.get(event.targetId)!,
          p =
            current.clock?.snapshot().progress ??
            Math.min(elapsed / activePack.animations.arena.eventMs, 1),
          flight = Math.max(0, Math.min((p - 0.18) / 0.6, 1)),
          attack = {
            x: from.x + (to.x - from.x) * flight,
            y:
              from.y +
              (to.y - from.y) * flight -
              Math.sin(flight * Math.PI) * 22 -
              (event.missed ? flight * 42 : 0),
          };
        if (p >= 0.18 && p < 0.78) {
          sparks
            .moveTo(from.x, from.y)
            .lineTo(attack.x, attack.y)
            .stroke({ color: paletteColor('legendaryAccent'), alpha: 0.35, width: 2 });
          sparks.circle(attack.x, attack.y, 6).fill(paletteColor('ink'));
          sparks
            .circle(attack.x, attack.y, 13)
            .fill({ color: paletteColor('legendaryAccent'), alpha: 0.18 });
        }
        if (!event.missed && p >= 0.78 && p < 1) {
          const impact = (p - 0.78) / 0.22;
          sparks
            .circle(to.x, to.y, 10 + impact * 22)
            .stroke({ color: paletteColor('legendaryAccent'), width: 2, alpha: 1 - impact });
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4,
              r = 8 + impact * 25;
            sparks
              .circle(to.x + Math.cos(angle) * r, to.y + Math.sin(angle) * r, 2 * (1 - impact))
              .fill({ color: paletteColor('gold'), alpha: 1 - impact });
          }
        }
      } else if (event?.kind === 'healed' || event?.kind === 'burn-tick') {
        const target = positions.get(event.actorId);
        const p =
          current.clock?.snapshot().progress ??
          Math.min(elapsed / activePack.animations.arena.eventMs, 1);
        if (target && p < 1)
          sparks
            .ellipse(target.x, target.y + 10 - p * 12, 12 + p * 20, 6 + p * 7)
            .stroke({
              color: paletteColor(event.kind === 'healed' ? 'unusualAccent' : 'rivalAccent'),
              width: 2,
              alpha: Math.sin(p * Math.PI) * 0.8,
            });
      }
    }
    app.render();
    host.dataset.renderCount = String(++renders);
  };
  app.ticker.add((ticker) => {
    if (current.kind === 'arena' && current.playing) {
      if (!current.clock) elapsed += ticker.deltaMS * current.speed;
      paint();
    }
  });
  const update = (next: SceneData) => {
    current = next;
    dirty = true;
    const nextStamp = next.kind === 'arena' ? next.frame.cursor : -1;
    if (nextStamp !== stamp) {
      stamp = nextStamp;
      elapsed = 0;
    }
    if (next.kind === 'arena' && next.playing && !document.hidden) app.start();
    else app.stop();
    host.dataset.activeTicking = String(next.kind === 'arena' && next.playing && !document.hidden);
    paint();
  };
  const observer = new ResizeObserver(([entry]) => {
    viewWidth = entry.contentRect.width;
    viewHeight = entry.contentRect.height;
    paint();
  });
  observer.observe(host);
  const visibility = () => {
    if (destroyed) return;
    if (document.hidden) {
      app.stop();
      host.dataset.activeTicking = 'false';
    } else {
      if (current.kind === 'arena' && current.playing) app.start();
      host.dataset.activeTicking = String(current.kind === 'arena' && current.playing);
      paint();
    }
  };
  document.addEventListener('visibilitychange', visibility);
  update(data);
  return {
    update,
    destroy: () => {
      destroyed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      app.stop();
      app.destroy({ removeView: true, releaseGlobalResources: false }, { children: true });
      for (const texture of textures.values()) texture.destroy(true);
      textures.clear();
      figures.clear();
      host.dataset.destroyed = 'true';
      host.dataset.activeTicking = 'false';
      host.dataset.textureCount = '0';
      host.dataset.textureBytes = '0';
    },
  };
}
