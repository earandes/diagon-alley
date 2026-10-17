import { SceneFigureAtlas } from './scene-figure';
import { sceneTexture } from './scene-texture';
import { sceneNeedsContinuousFrames } from './scene-motion';
import { sameSceneGeometry } from './scene-geometry';
import { FrameInvalidation } from './frame-invalidation';
import { sceneStart, sceneEnd } from './scene-diagnostics';
import { Application, Graphics, Sprite, Texture } from 'pixi.js';
import { visualAsset } from '../content-packs/art';
import { activePack } from '../content-packs/active';
const paletteColor = (key: keyof typeof activePack.palette) =>
  parseInt(activePack.palette[key].slice(1), 16);
import type { MapLayout } from './map-layout';
import type { ReplayFrame } from '../../application/client/battle-replay';
import type { BattleEvent } from '../../domain/combat/engine';
import type { ReplayClock } from '../motion/replay-clock';
import { bossArt } from '../boss-art';
import { bossActorPose, bossPropPose } from '../motion/boss-motion';
import { selectedContentPackId } from '../content-packs/active';
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
      readonly boss?: { readonly id: string; readonly wizardId: string };
      readonly reduced?: boolean;
    };
export async function createPixiScene(host: HTMLElement, data: SceneData) {
  // Decode only this scene's artwork, concurrently with renderer initialization.
  // The promises are scene-owned; no global cache or work in the previous view.
  const images = new Map<string, Promise<HTMLImageElement | null>>();
  const prepareImage = (key: string, url: string) => {
    let pending = images.get(key);
    if (!pending) {
      const image = new Image();
      image.src = url;
      const started = sceneStart();
      pending = image.decode().then(
        () => {
          sceneEnd('figure-decode', started);
          return image;
        },
        () => null,
      );
      images.set(key, pending);
    }
    return pending;
  };
  const propArt =
    data.kind === 'arena' && data.boss
      ? bossArt(selectedContentPackId(), data.boss.wizardId)
      : null;
  if (data.kind === 'arena') {
    for (const unit of [...data.frame.player, ...data.frame.rival]) {
      const key = data.appearances?.[unit.id] ?? `character.${unit.wizardId}.figure`;
      const asset = visualAsset(key);
      if (asset) void prepareImage(key, asset.url);
    }
    if (propArt?.actor) {
      for (const url of [propArt.actor.baseUrl, propArt.actor.armUrl])
        void prepareImage(`a71:${url}`, url);
    } else
      for (const layer of propArt?.layers ?? []) void prepareImage(`a70:${layer.url}`, layer.url);
  }
  const initStarted = sceneStart();
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
    images.clear();
    throw error;
  }
  sceneEnd('renderer-init', initStarted);
  app.canvas.setAttribute('aria-hidden', 'true');
  host.dataset.renderer = 'webgl';
  app.ticker.remove(app.render, app);
  host.appendChild(app.canvas);
  const ink = new Graphics(),
    sparks = new Graphics();
  app.stage.addChild(ink);
  const atlas = new SceneFigureAtlas();
  const textures = new Map<string, Texture>(),
    figures = new Map<string, Sprite>(),
    loading = new Set<string>();
  const poses = new Map<
    string,
    { x: number; y: number; alive: boolean; entered: number; sx: number; sy: number }
  >();
  // Only the current boss sample loads these cropped pieces. No extra ticker/context.
  const bossPieces = new Map<string, Sprite[]>();
  const bossArms = new Map<string, Sprite>();
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
    if (destroyed || document.hidden) return;
    // React commits the log frame after the clock advances. Never mix the new
    // event's phase with the previous event's actor, target or condition.
    if (
      current.kind === 'arena' &&
      current.clock &&
      current.clock.snapshot().cursor !== current.frame.cursor
    )
      return;
    const paintStarted = sceneStart();
    const width = viewWidth,
      height = viewHeight;
    if (width < 1 || height < 1) return;
    if (app.screen.width !== width || app.screen.height !== height) {
      app.renderer.resize(width, height);
      dirty = true;
    }
    if (dirty) {
      const geometryStarted = sceneStart();
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
              void prepareImage(assetKey, asset.url)
                .then((image) => {
                  if (destroyed || !image) return;
                  textures.set(assetKey, sceneTexture(image, asset.url));
                  host.dataset.textureCount = String(textures.size);
                  host.dataset.textureBytes = String(
                    [...textures.values()].reduce((n, t) => n + t.width * t.height * 4, 0),
                  );
                  dirty = true;
                  requestPaint();
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
              if (current.boss?.id !== unit.id)
                atlas.configure(figure, texture, figureHeight * app.renderer.resolution >= 96);
              const pivot = asset?.pivot ?? [0.5, 0.9];
              atlas.anchor(figure, pivot[0], pivot[1]);
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
              if (current.boss?.id === unit.id && propArt) {
                const actor = propArt.actor;
                if (actor) {
                  for (const url of [actor.baseUrl, actor.armUrl]) {
                    const key = `a71:${url}`;
                    if (textures.has(key) || loading.has(key)) continue;
                    loading.add(key);
                    void prepareImage(key, url)
                      .then((image) => {
                        if (destroyed || !image) return;
                        textures.set(key, sceneTexture(image, url));
                        host.dataset.textureCount = String(textures.size);
                        host.dataset.textureBytes = String(
                          [...textures.values()].reduce((n, t) => n + t.width * t.height * 4, 0),
                        );
                        dirty = true;
                        requestPaint();
                      })
                      .catch(() => {
                        /* Static full actor remains intact. */
                      });
                  }
                  const baseTexture = textures.get(`a71:${actor.baseUrl}`);
                  const armTexture = textures.get(`a71:${actor.armUrl}`);
                  if (baseTexture && armTexture) {
                    figure.texture = baseTexture;
                    if (!bossArms.has(unit.id)) {
                      const arm = new Sprite(armTexture);
                      arm.anchor.set(...actor.armPivot);
                      arm.position.set(
                        (actor.armPivot[0] - figure.anchor.x) * baseTexture.width,
                        (actor.armPivot[1] - figure.anchor.y) * baseTexture.height,
                      );
                      const waist = new Graphics()
                        .rect(
                          -figure.anchor.x * baseTexture.width,
                          -figure.anchor.y * baseTexture.height,
                          baseTexture.width,
                          actor.baseline * baseTexture.height,
                        )
                        .fill(0xffffff);
                      figure.addChild(arm, waist);
                      arm.mask = waist;
                      bossArms.set(unit.id, arm);
                    }
                  }
                } else {
                  for (const layer of propArt.layers) {
                    const key = `a70:${layer.url}`;
                    if (textures.has(key) || loading.has(key)) continue;
                    loading.add(key);
                    void prepareImage(key, layer.url)
                      .then((image) => {
                        if (destroyed || !image) return;
                        textures.set(key, sceneTexture(image, layer.url));
                        host.dataset.textureCount = String(textures.size);
                        host.dataset.textureBytes = String(
                          [...textures.values()].reduce((n, t) => n + t.width * t.height * 4, 0),
                        );
                        dirty = true;
                        requestPaint();
                      })
                      .catch(() => {
                        /* The original painted object remains intact. */
                      });
                  }
                  if (
                    !bossPieces.has(unit.id) &&
                    propArt.layers.every((layer) => textures.has(`a70:${layer.url}`))
                  ) {
                    const pieces = propArt.layers.map((layer) => {
                      const piece = new Sprite(textures.get(`a70:${layer.url}`)!);
                      piece.anchor.set(...layer.pivot);
                      piece.position.set(
                        (layer.rect[0] + layer.rect[2] * layer.pivot[0] - figure.anchor.x) *
                          texture.width,
                        (layer.rect[1] + layer.rect[3] * layer.pivot[1] - figure.anchor.y) *
                          texture.height,
                      );
                      figure!.addChild(piece);
                      return piece;
                    });
                    bossPieces.set(unit.id, pieces);
                  }
                }
              }
            }
          }
        }
      }
      dirty = false;
      sceneEnd('geometry', geometryStarted);
    }
    if (current.kind === 'arena') {
      host.dataset.artReady = String(
        [...current.frame.player, ...current.frame.rival].every((unit) => figures.has(unit.id)),
      );
      for (const [id, figure] of figures) {
        const pose = poses.get(id)!;
        const entry = current.reduced
          ? 1
          : current.clock
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
        const anticipation =
          !current.reduced && actor && progress < 0.18 ? Math.sin((progress / 0.18) * Math.PI) : 0;
        const contact =
          !current.reduced && hit && progress >= 0.78
            ? Math.sin(((progress - 0.78) / 0.22) * Math.PI)
            : 0;
        figure.position.set(
          pose.x - direction * anticipation * 3 - direction * contact * 6,
          pose.y + 8 * (1 - entry),
        );
        figure.scale.set(
          pose.sx * (1 - anticipation * 0.025),
          pose.sy * (1 + anticipation * 0.025),
        );
        // DOM portraits are already present while textures load. Keep that
        // presence when swapping layers, including a pause during entry.
        figure.alpha = pose.alive ? 1 : 0.35;
        figure.rotation =
          (pose.alive ? 0 : 0.12) + -direction * (anticipation * 0.025 + contact * 0.035);
        if (current.boss?.id === id) {
          const actor = propArt?.actor;
          const arm = bossArms.get(id);
          if (actor && arm) {
            const sample = bossActorPose(current.next, progress, id, pose.alive, !!current.reduced);
            arm.rotation = sample.arm * actor.armAngle;
            // Limited sleeve compression accompanies the joint gesture; never body resizing.
            arm.scale.set(1 - sample.activity * 0.02, 1 + sample.activity * 0.02);
            figure.x -= direction * sample.recoil * 3;
            figure.y += sample.fall * 6;
            figure.rotation += sample.fall * 0.08;
            host.dataset.bossActorReady = 'true';
            host.dataset.bossActorPose = sample.phase;
            host.dataset.bossActorArmAngle = String(arm.rotation);
            host.dataset.bossActorLayers = '2';
            // Existing observation hooks now report the actual painted arm/prop Sprite.
            host.dataset.bossPropReady = 'true';
            host.dataset.bossPropUnit = id;
            host.dataset.bossPropPose = sample.phase;
            host.dataset.bossPropAngle = String(arm.rotation);
            host.dataset.bossPropActivity = String(sample.activity);
            host.dataset.bossPropLayers = '2';
            host.dataset.bossPropScaleX = String(arm.scale.x);
            host.dataset.bossPropScaleY = String(arm.scale.y);
          } else {
            host.dataset.bossActorReady = 'false';
            host.dataset.bossActorLayers = '0';
            const sample = bossPropPose(current.next, progress, id, pose.alive, !!current.reduced);
            figure.y += sample.fall * 6;
            figure.rotation += sample.fall * 0.08;
            const pieces = bossPieces.get(id);
            host.dataset.bossPropReady = String(!!pieces);
            host.dataset.bossPropUnit = id;
            host.dataset.bossPropPose = sample.phase;
            const activity = sample.activity;
            pieces?.forEach((piece, index) => {
              const layer = propArt!.layers[index];
              piece.alpha = activity;
              piece.rotation = 0;
              piece.scale.set(1, 1);
              if (layer.motion === 'book-cover') {
                piece.rotation = activity * -0.035;
                piece.scale.x = 1 - activity * 0.06;
                piece.alpha = Math.min(activity * 6, 1);
              } else if (layer.motion === 'book-pages') {
                piece.rotation = activity * 0.025;
                piece.scale.x = 1 + activity * 0.04;
              } else if (layer.motion === 'bowl-contents') {
                piece.scale.set(1 - activity * 0.1, 1 + activity * 0.08);
              }
            });
            host.dataset.bossPropAngle = String(
              pieces?.find((_, index) => propArt!.layers[index].motion === 'book-cover')
                ?.rotation ?? 0,
            );
            host.dataset.bossPropActivity = String(activity);
            host.dataset.bossPropLayers = String(pieces?.length ?? 0);
            const movingPiece = pieces?.find((_, index) =>
              ['book-cover', 'bowl-contents'].includes(propArt!.layers[index].motion),
            );
            host.dataset.bossPropScaleX = String(movingPiece?.scale.x ?? 1);
            host.dataset.bossPropScaleY = String(movingPiece?.scale.y ?? 1);
          }
        }
      }
    }
    sparks.clear();
    if (current.kind === 'arena') {
      const event = current.next;
      if (event?.kind === 'spell-cast') {
        const baseFrom = positions.get(event.actorId)!,
          leader = figures.get(event.actorId),
          actorArm = bossArms.get(event.actorId),
          actorOrigin = propArt?.actor,
          source =
            current.boss?.id === event.actorId && bossPieces.has(event.actorId) ? propArt : null,
          dx =
            source && leader
              ? (source.origin[0] - leader.anchor.x) * leader.texture.width * leader.scale.x
              : 0,
          dy =
            source && leader
              ? (source.origin[1] - leader.anchor.y) * leader.texture.height * leader.scale.y
              : 0,
          rotation = leader?.rotation ?? 0,
          from =
            actorArm && actorOrigin && current.boss?.id === event.actorId
              ? actorArm.toGlobal({
                  x: (actorOrigin.origin[0] - actorOrigin.armPivot[0]) * actorOrigin.frameSize[0],
                  y: (actorOrigin.origin[1] - actorOrigin.armPivot[1]) * actorOrigin.frameSize[1],
                })
              : source && leader
                ? {
                    x: leader.x + dx * Math.cos(rotation) - dy * Math.sin(rotation),
                    y: leader.y + dx * Math.sin(rotation) + dy * Math.cos(rotation),
                  }
                : baseFrom,
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
          if (source || (actorArm && current.boss?.id === event.actorId)) {
            sparks.ellipse(from.x, from.y, 10 + Math.sin(flight * Math.PI) * 5, 4).stroke({
              color: paletteColor('gold'),
              width: 1.5,
              alpha: Math.sin(flight * Math.PI) * 0.8,
            });
          }
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
          sparks.ellipse(target.x, target.y + 10 - p * 12, 12 + p * 20, 6 + p * 7).stroke({
            color: paletteColor(event.kind === 'healed' ? 'unusualAccent' : 'rivalAccent'),
            width: 2,
            alpha: Math.sin(p * Math.PI) * 0.8,
          });
      }
    }
    const visibleFigures = String(
      [...figures.values()].filter((figure) => figure.visible && figure.alpha >= 0.3).length,
    );
    if (host.dataset.visibleFigures !== visibleFigures)
      host.dataset.visibleFigures = visibleFigures;
    const submitStarted = sceneStart();
    app.render();
    sceneEnd('render-submit', submitStarted);
    sceneEnd('paint', paintStarted);
    host.dataset.renderCount = String(++renders);
  };
  const redraw = new FrameInvalidation(
    (draw) => requestAnimationFrame(draw),
    (id) => cancelAnimationFrame(id),
    paint,
  );
  const requestPaint = () => {
    if (!destroyed && !document.hidden && !app.ticker.started) redraw.request();
  };
  app.ticker.add((ticker) => {
    if (current.kind === 'arena' && current.playing) {
      if (!current.clock) elapsed += ticker.deltaMS * current.speed;
      paint();
    }
  });
  const update = (next: SceneData) => {
    dirty ||= !sameSceneGeometry(current, next);
    current = next;
    const nextStamp = next.kind === 'arena' ? next.frame.cursor : -1;
    if (nextStamp !== stamp) {
      stamp = nextStamp;
      elapsed = 0;
    }
    const ticking =
      next.kind === 'arena' && next.playing && !document.hidden && sceneNeedsContinuousFrames(next);
    if (ticking) {
      redraw.cancelPending();
      app.start();
    } else app.stop();
    host.dataset.activeTicking = String(ticking);
    // An active ticker paints the next frame. React phase updates only invalidate
    // geometry; painting immediately as well needlessly submits a second frame.
    if (!ticking) redraw.flush();
  };
  const observer = new ResizeObserver(([entry]) => {
    viewWidth = entry.contentRect.width;
    viewHeight = entry.contentRect.height;
    requestPaint();
  });
  observer.observe(host);
  const visibility = () => {
    if (destroyed) return;
    if (document.hidden) {
      redraw.cancelPending();
      app.stop();
      host.dataset.activeTicking = 'false';
    } else {
      const ticking =
        current.kind === 'arena' && current.playing && sceneNeedsContinuousFrames(current);
      if (ticking) app.start();
      host.dataset.activeTicking = String(ticking);
      requestPaint();
    }
  };
  document.addEventListener('visibilitychange', visibility);
  update(data);
  return {
    update,
    destroy: () => {
      destroyed = true;
      images.clear();
      redraw.cancelPending();
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      app.stop();
      app.destroy({ removeView: true, releaseGlobalResources: false }, { children: true });
      atlas.destroy();
      for (const texture of textures.values()) texture.destroy(true);
      textures.clear();
      figures.clear();
      bossPieces.clear();
      bossArms.clear();
      host.dataset.destroyed = 'true';
      host.dataset.activeTicking = 'false';
      host.dataset.textureCount = '0';
      host.dataset.textureBytes = '0';
      host.dataset.visibleFigures = '0';
      host.dataset.bossPropReady = 'false';
      host.dataset.bossPropLayers = '0';
      host.dataset.bossActorReady = 'false';
      host.dataset.bossActorLayers = '0';
    },
  };
}
