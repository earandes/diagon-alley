import { useEffect, useState } from 'react';

/** Cosmetic scene layers only; no game clock, random input or animation loop in JS. */
export function SceneAtmosphere({
  reduced,
  active = true,
}: {
  reduced: boolean;
  active?: boolean;
}) {
  const [visible, setVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  if (reduced) return null;
  return (
    <div
      className="scene-atmosphere"
      aria-hidden="true"
      data-running={visible && active}
      data-priority={active ? 'ambient' : 'suspended'}
    >
      <i className="scene-lamplight scene-lamplight-left" />
      <i className="scene-lamplight scene-lamplight-right" />
      <i className="scene-mist" />
      {[18, 37, 68, 83, 54, 27].map((left, index) => (
        <i
          key={left}
          className="scene-mote"
          style={{
            left: `${left}%`,
            animationDelay: `${-index * 2.7}s`,
            animationDuration: `${11 + index * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
