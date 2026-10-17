import { sceneStart, sceneEnd } from './scene-diagnostics';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { selectedContentPackId, subscribeContentPack } from '../content-packs/active';
import type { SceneData, createPixiScene } from './pixi-scenes';
import type { Language } from '../../domain/collection/wizards';
import { text } from '../translations';
export function SceneCanvas({
  data,
  language,
  onUnavailable,
}: {
  data: SceneData;
  language: Language;
  onUnavailable?: () => void;
}) {
  const packId = useSyncExternalStore(subscribeContentPack, selectedContentPackId);
  const host = useRef<HTMLDivElement>(null),
    latest = useRef(data),
    renderer = useRef<Awaited<ReturnType<typeof createPixiScene>> | null>(null),
    [failed, setFailed] = useState(false),
    failureCallback = useRef(onUnavailable);
  failureCallback.current = onUnavailable;
  latest.current = data;
  useEffect(() => {
    let cancelled = false,
      unavailable = false;
    const node = host.current;
    const abandon = () => {
      if (cancelled) return;
      unavailable = true;
      renderer.current?.destroy();
      renderer.current = null;
      if (node) {
        delete node.dataset.renderer;
        delete node.dataset.artReady;
      }
      setFailed(true);
      failureCallback.current?.();
    };
    node?.addEventListener('webglcontextlost', abandon, true);
    setFailed(false);
    const importStarted = sceneStart();
    void import('./pixi-scenes')
      .then(async (module) => {
        sceneEnd('module-import', importStarted);
        if (cancelled || !host.current) return;
        const scene = await module.createPixiScene(host.current!, latest.current);
        if (cancelled || unavailable) {
          scene.destroy();
          return;
        }
        scene.update(latest.current);
        renderer.current = scene;
      })
      .catch(() => {
        abandon();
      });
    return () => {
      cancelled = true;
      node?.removeEventListener('webglcontextlost', abandon, true);
      renderer.current?.destroy();
      renderer.current = null;
      if (node) {
        delete node.dataset.renderer;
        delete node.dataset.artReady;
      }
    };
  }, [data.kind, packId]);
  useEffect(() => {
    renderer.current?.update(data);
  }, [data]);
  return (
    <>
      <div
        key={`${data.kind}:${packId}`}
        className={`scene-canvas scene-${data.kind}`}
        ref={host}
        aria-hidden="true"
      />
      {failed && <p className="scene-fallback">{text(language, 'graphicsUnavailable')}</p>}
    </>
  );
}
