import { Artwork } from './Artwork';
import { visualAsset } from './content-packs/art';
import type { CSSProperties } from 'react';
import { text } from './translations';
import { shopText } from './shop-messages';
import { useReducedMotion } from './useReducedMotion';
import type { Language } from '../domain/collection/wizards';
import './shop-journey.css';

export type ShopPlace = 'confectionery' | 'workshop' | 'vault';
const shops = [
  {
    id: 'confectionery',
    title: 'theEnchantedConfectionery',
    purpose: 'sweets',
    object: 'toad.box',
    sign: { left: '12%', top: '20.5%', width: '76%', height: '7%' },
  },
  {
    id: 'workshop',
    title: 'wandWorkshop',
    purpose: 'wands',
    object: 'product.wand-birch',
    sign: { left: '12%', top: '16.8%', width: '76%', height: '6.6%' },
  },
  {
    id: 'vault',
    title: 'obsidianVaults',
    purpose: 'treasure',
    object: 'product.gold-key',
    sign: { left: '28%', top: '38.3%', width: '44%', height: '3.2%' },
  },
] as const;

/** Destinations only: entering a shop cannot buy, forge, open or grant anything. */
export function ShopHub({
  language,
  onEnter,
}: {
  language: Language;
  onEnter: (place: ShopPlace) => void;
}) {
  const { reduced } = useReducedMotion();
  return (
    <section
      className="shop-alley"
      data-reduced={reduced}
      aria-label={text(language, 'bazaarPlaces')}
    >
      <div className="shop-alley-heading">
        <h1>{text(language, 'bazaar')}</h1>
        <p>{shopText(language, 'chooseDoor')}</p>
      </div>
      <div className="shop-storefronts">
        {shops.map((shop) => {
          const painted = !!visualAsset(`shopfront.${shop.id}`);
          return (
            <button
              type="button"
              key={shop.id}
              className="shop-storefront game-object"
              data-shop={shop.id}
              data-painted={painted}
              aria-label={text(language, shop.title)}
              onClick={() => onEnter(shop.id)}
            >
              {!painted && <span className="storefront-sign">{text(language, shop.title)}</span>}
              <span className="storefront-window">
                <Artwork
                  className="storefront-interior"
                  asset={painted ? `shopfront.${shop.id}` : `scene.${shop.id}`}
                  language={language}
                  decorative
                  eager
                />
                {painted && (
                  <span className="storefront-painted-sign" style={shop.sign as CSSProperties}>
                    {text(language, shop.title)}
                  </span>
                )}
                <span className="storefront-light" aria-hidden="true" />
                {!painted && (
                  <Artwork
                    className="storefront-object"
                    asset={shop.object}
                    language={language}
                    decorative
                  />
                )}
                {!painted && <span className="storefront-latch" aria-hidden="true" />}
              </span>
              <span className="storefront-step">
                <span>{shopText(language, shop.purpose)}</span>
                <span className="storefront-enter">
                  {shopText(language, 'enterShop')} <span aria-hidden="true">↗</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
