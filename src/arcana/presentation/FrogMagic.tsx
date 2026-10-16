import { useEffect, useRef } from 'react';

const DURATION_MS = 3200;
const SPARK_COUNT = 24;
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
export function FrogMagic({ active }: { active: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!active || !element) return;
    let canvas: HTMLCanvasElement | undefined;
    let frame = 0;
    let observer: ResizeObserver | undefined;
    let visibility: (() => void) | undefined;
    const dispose = () => {
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
      if (!ink || !gold || !teal) return;
      const surface = canvas;
      const resolution = Math.min(devicePixelRatio || 1, 1.5);
      let width = 0,
        height = 0;
      const resize = () => {
        width = element.clientWidth || 480;
        height = element.clientHeight || 480;
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
        if (previous !== undefined) elapsed += time - previous;
        previous = time;
        const progress = Math.min(elapsed / DURATION_MS, 1);
        ink.setTransform(resolution, 0, 0, resolution, 0, 0);
        ink.clearRect(0, 0, width, height);
        ink.globalCompositeOperation = 'lighter';
        ink.globalAlpha = Math.sin(progress * Math.PI) * 0.8;
        const scale = 0.7 + Math.sin(progress * Math.PI) * 0.8;
        for (let index = 0; index < SPARK_COUNT; index++) {
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
        if (!document.hidden && elapsed < DURATION_MS) frame = requestAnimationFrame(draw);
      };
      document.addEventListener('visibilitychange', visibility);
      visibility();
    } catch {
      dispose();
      // The DOM illustration and committed card are the complete fallback.
    }
    return dispose;
  }, [active]);
  return <div className="frog-magic" ref={host} aria-hidden="true" />;
}
