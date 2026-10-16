import { useState } from 'react';
import { Artwork } from './Artwork';
import { wizardName } from './content-packs/active';
import { toadProbabilities } from '../application/client/read-models';
import type { PublicContent } from '../application/public-content';
import type { BuyOpenToadRequest, GameState, OpenToadRequest } from '../application/game';
import type { ProductKind, PurchaseRequest } from '../domain/economy/inventory';
import type { Language } from '../domain/collection/wizards';
import { text } from './translations';
import { ShopBook, ShopExit } from './ShopBook';
import { shopText } from './shop-messages';
import { useReducedMotion } from './useReducedMotion';
import './shop-journey.css';

export function SweetshopScene({
  game,
  content,
  language,
  ready,
  onPurchase,
  onOpen,
  onStreet,
  onBuyOpen,
  onPrepare,
}: {
  game: GameState;
  content: PublicContent;
  language: Language;
  ready: boolean;
  onPurchase: (request: PurchaseRequest) => void;
  onOpen: (request: OpenToadRequest) => void;
  onStreet?: () => void;
  onBuyOpen: (request: BuyOpenToadRequest) => void;
  onPrepare?: (origin: HTMLElement) => void;
}) {
  const [product, setProduct] = useState<ProductKind>('cacao-toad');
  const { reduced } = useReducedMotion();
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-GB');
  const units = game.inventory.products.filter(
    (unit) => unit.kind === product && unit.status === 'available',
  );
  const offer = content.shop.products.find((offer) => offer.kind === product);
  const frog = product === 'cacao-toad';
  const t = (key: Parameters<typeof text>[1], values?: Record<string, string | number>) =>
    text(language, key, values);
  return (
    <section
      className="sweetshop-scene shop-interior"
      data-reduced={reduced}
      aria-label={t('theEnchantedConfectionery')}
    >
      <div className="shop-interior-heading">
        <ShopExit language={language} onStreet={onStreet} />
        <h2>{t('theEnchantedConfectionery')}</h2>
      </div>
      <div className="sweetshop-display" role="group" aria-label={t('gameChooseSweet')}>
        {content.shop.products.map((offer) => (
          <div className="sweetshop-product-place" key={offer.kind}>
            <button
              className="sweetshop-object game-object"
              data-product={offer.kind}
              aria-label={t(offer.kind === 'cacao-toad' ? 'cocoaToad' : 'chanceBeans')}
              aria-pressed={product === offer.kind}
              onClick={() => setProduct(offer.kind)}
            >
              <Artwork
                asset={offer.kind === 'cacao-toad' ? 'toad.box' : 'beans.jar'}
                language={language}
                decorative
                eager
              />
              <span className="sweet-label">
                {t(offer.kind === 'cacao-toad' ? 'cocoaToad' : 'chanceBeans')}
              </span>
              <span className="object-price">
                <Artwork asset="currency.crowns" language={language} decorative />
                {numbers.format(offer.crowns)}
              </span>
              <span className="sweet-pedestal" aria-hidden="true" />
            </button>
            {offer.kind === 'random-beans' && (
              <ShopBook
                language={language}
                label={shopText(language, 'beansInfo')}
                caption={shopText(language, 'info')}
                compact
              >
                <ol className="bean-use-story">
                  {(['beans.jar', 'node.duel', 'product.bean-mint'] as const).map(
                    (asset, index) => (
                      <li key={asset}>
                        <Artwork asset={asset} language={language} decorative />
                        <span>
                          {shopText(
                            language,
                            (['beanStepBuy', 'beanStepAssign', 'beanStepDiscover'] as const)[index],
                          )}
                        </span>
                      </li>
                    ),
                  )}
                </ol>
                <p className="bean-use-note">{shopText(language, 'beanNote')}</p>
              </ShopBook>
            )}
          </div>
        ))}
      </div>
      <div className="counter-actions shop-counter-actions">
        {units.length > 0 && (
          <span className="sweet-stock" aria-label={t('gameSweetStock', { count: units.length })}>
            <Artwork asset={frog ? 'toad.box' : 'beans.jar'} language={language} decorative />
            <span>
              <small>{shopText(language, 'available')}</small>× {numbers.format(units.length)}
            </span>
          </span>
        )}
        {frog && units[0] && (
          <button
            className="open-frog-action"
            data-primary-action
            disabled={!ready}
            aria-label={shopText(language, 'openOwnedLabel')}
            onClick={() =>
              onOpen({
                unitId: units[0].id,
                catalogVersion: content.catalog.version,
                tableVersion: content.toadTable.version,
              })
            }
          >
            <Artwork asset="toad.seal" language={language} decorative />
            <span>
              {shopText(language, 'openOwned')}
              <small>{shopText(language, 'noCharge')}</small>
            </span>
          </button>
        )}
        {!frog && units.length > 0 && onPrepare && (
          <button
            className="bean-prepare-action game-object"
            data-primary-action
            onClick={(event) => onPrepare(event.currentTarget)}
          >
            <Artwork asset="ui.map" language={language} decorative />
            <span>
              {shopText(language, 'prepareGear')}
              <small>{shopText(language, 'beansNext')}</small>
            </span>
            <span aria-hidden="true">→</span>
          </button>
        )}
        {offer && (!frog || !units.length) && (
          <button
            className={`counter-buy shop-purchase-ticket${!frog && units.length ? ' shop-purchase-secondary' : ''}`}
            data-primary-action={!units.length || undefined}
            disabled={!ready || game.inventory.crowns < offer.crowns}
            aria-label={
              frog
                ? shopText(language, 'buyOpenLabel', {
                    value: numbers.format(offer.crowns),
                    currency: t('crowns'),
                  })
                : t('buyChanceBeans', { value: numbers.format(offer.crowns) })
            }
            onClick={() =>
              frog
                ? onBuyOpen({
                    priceVersion: content.shop.version,
                    catalogVersion: content.catalog.version,
                    tableVersion: content.toadTable.version,
                  })
                : onPurchase({ product, quantity: 1, priceVersion: content.shop.version })
            }
          >
            <Artwork asset="currency.crowns" language={language} decorative />
            <span>
              <strong>{shopText(language, frog ? 'buyOpen' : 'buy')}</strong>
              <span className="purchase-amount">{numbers.format(offer.crowns)}</span>
            </span>
            <span className="purchase-arrow" aria-hidden="true">
              ↗
            </span>
          </button>
        )}
      </div>
      {offer && game.inventory.crowns < offer.crowns && !(frog && units.length) && (
        <p className="short-hint">{t('gameEarnCoinsOnMap')}</p>
      )}
      {frog && (
        <div className="shop-counter-tools">
          <ShopBook
            language={language}
            label={t('cardProbabilities')}
            caption={shopText(language, 'checkCards')}
          >
            <div className="shop-card-catalogue">
              {toadProbabilities(content.catalog, content.toadTable).map((row) => (
                <article key={row.wizard.id}>
                  <Artwork
                    asset={`character.${row.wizard.id}.portrait`}
                    language={language}
                    decorative
                  />
                  <span>{wizardName(row.wizard, language)}</span>
                  <strong>
                    {new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-GB', {
                      style: 'percent',
                      maximumFractionDigits: 3,
                    }).format(row.probability)}
                  </strong>
                </article>
              ))}
            </div>
          </ShopBook>
        </div>
      )}
    </section>
  );
}
