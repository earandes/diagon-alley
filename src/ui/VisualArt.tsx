import { useState } from 'react';
import type { Identity } from '../domain/model';
import { FamilyArt } from './Art';
import { CardEngraving } from './CardEngravings';

type Crop = readonly [x: number, y: number, width: number, height: number];
/** Runtime framing only: the original raster remains unchanged and is not a rig. */
export function ArtRegion({
  source,
  crop,
  className = '',
}: {
  source: 'interior' | 'closed' | 'revealed' | 'alley' | 'frog';
  crop: Crop;
  className?: string;
}) {
  const [missing, setMissing] = useState(false);
  const [x, y, width, height] = crop;
  const sourceWidth = source === 'alley' || source === 'frog' ? 1536 : 853;
  return (
    <div
      className={'art-region artwork ' + className + (missing ? ' image-missing' : '')}
      style={{ aspectRatio: `${width}/${height}` }}
      aria-hidden="true"
    >
      {!missing && (
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice">
          <image
            href={`/art/${source}-v1.webp`}
            x={-x}
            y={-y}
            width={sourceWidth}
            height={source === 'alley' || source === 'frog' ? 1024 : 1844}
            onError={() => setMissing(true)}
          />
        </svg>
      )}
      {missing && <span className="missing-ornament">✦</span>}
    </div>
  );
}
export function ShopBackdrop() {
  return (
    <div className="shop-backdrop artwork" aria-hidden="true">
      <ArtRegion source="interior" crop={[383, 270, 344, 290]} />
    </div>
  );
}
export function IllustratedAlley() {
  return (
    <div className="illustrated-alley artwork" aria-hidden="true">
      <ArtRegion source="alley" crop={[450, 0, 1000, 1024]} />
      <span className="alley-lamp lantern-light" />
      <span className="alley-hanging-sign swing-sign">✦</span>
      <span className="alley-vignette" />
    </div>
  );
}
const productCrops = {
  frog: [38, 863, 373, 230],
  beans: [445, 863, 372, 230],
  O01: [38, 1265, 373, 185],
  O02: [445, 1265, 372, 185],
} as const;
export type ShopProductId = keyof typeof productCrops;
export function ProductArtwork({ id }: { id: ShopProductId }) {
  return (
    <ArtRegion source="interior" crop={productCrops[id]} className={'product-art art-' + id} />
  );
}
export function IdentityArtwork({ identity }: { identity: Identity }) {
  if (identity.id === 'C01')
    return <ArtRegion source="revealed" crop={[278, 459, 311, 414]} className="identity-art" />;
  if (identity.id === 'O01' || identity.id === 'O02') return <ProductArtwork id={identity.id} />;
  if (identity.family !== 'flavour')
    return (
      <div className="identity-art artwork" aria-hidden="true">
        <CardEngraving identity={identity} />
      </div>
    );
  return (
    <div
      className={'identity-art symbolic-art artwork family-' + identity.family}
      aria-hidden="true"
    >
      <FamilyArt family={identity.family} />
      <span className="identity-monogram">{identity.id}</span>
    </div>
  );
}
export function IllustratedFrogBox({
  animate = false,
  settled = false,
  identity,
}: {
  animate?: boolean;
  settled?: boolean;
  identity?: Identity;
}) {
  const crop: Crop = [180, 578, 515, 463];
  return (
    <div
      className={
        'illustrated-box frog-stage artwork ' +
        (animate ? 'ritual ' : '') +
        (settled ? 'settled' : '')
      }
      aria-hidden="true"
    >
      <div className="velvet-cushion" />
      <div className="frog-shadow" />
      <div className="box-interior" />
      <div className="box-base">
        <ArtRegion
          source={animate || settled ? 'revealed' : 'closed'}
          crop={animate || settled ? [105, 981, 485, 125] : crop}
        />
      </div>
      <div className="box-lid">
        <ArtRegion source="closed" crop={crop} />
      </div>
      <div className="frog-subject">
        <ArtRegion source="frog" crop={[0, 0, 1536, 1024]} />
      </div>
      <div className="ritual-card">
        {identity ? <IdentityArtwork identity={identity} /> : <span>✦</span>}
      </div>
      <div className="reveal-glow" />
    </div>
  );
}
