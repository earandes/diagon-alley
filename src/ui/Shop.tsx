import { frogAvailable, type DemoState, type Identity, type Language } from '../domain/model';
import { translate } from '../i18n/messages';
import { ProductArtwork, ShopBackdrop, type ShopProductId } from './VisualArt';

export function Shop({
  state,
  language,
  identities,
  onFrog,
  onInspect,
  listOpen,
  onListToggle,
}: {
  listOpen: boolean;
  onListToggle: (open: boolean) => void;
  state: DemoState;
  language: Language;
  identities: Identity[];
  onFrog: (origin: string) => void;
  onInspect: (id: ShopProductId, origin: string) => void;
}) {
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const products: { id: ShopProductId; name: string; status: string; action: string }[] = [
    {
      id: 'frog',
      name: t('frog'),
      status: frogAvailable(state) ? t('oneAvailable') : t('frogGone'),
      action: t('consult'),
    },
    { id: 'beans', name: t('beans'), status: t('openingUnavailable'), action: t('consultBeans') },
    ...(['O01', 'O02'] as const).map((id) => ({
      id,
      name: identities.find((i) => i.id === id)!.name[language],
      status: t('inCollection'),
      action: t('consultInvention'),
    })),
  ];
  const inspect = (id: ShopProductId, origin: string) =>
    id === 'frog' ? onFrog(origin) : onInspect(id, origin);
  return (
    <>
      <figure className="interior-scene">
        <ShopBackdrop />
        <button
          id="shelf-frog"
          className="shelf-button"
          onClick={() => onFrog('shelf-frog')}
          aria-label={t('consult')}
        >
          <ProductArtwork id="frog" />
        </button>
      </figure>
      <p className="art-caption">{t('placeholder')}</p>
      <div className="shop-products">
        {products.map((p) => (
          <article className="shop-product" key={p.id}>
            <ProductArtwork id={p.id} />
            <div className="product-copy">
              <h2>{p.name}</h2>
              <p className={p.id === 'frog' ? 'stock' : 'product-status'}>{p.status}</p>
              <button
                id={'consult-' + p.id}
                className={p.id === 'frog' ? 'primary' : ''}
                onClick={() => inspect(p.id, 'consult-' + p.id)}
              >
                {p.action}
              </button>
            </div>
          </article>
        ))}
      </div>
      <p className="fine-print centered">{t('consultNoSpend')}</p>
      {!frogAvailable(state) && <p className="fine-print">{t('exhausted')}</p>}
      <details
        id="product-list"
        className="product-list"
        open={listOpen}
        onToggle={(e) => onListToggle(e.currentTarget.open)}
      >
        <summary>{t('productsList')}</summary>
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              <button id={'list-' + p.id} onClick={() => inspect(p.id, 'list-' + p.id)}>
                <strong>{p.name}</strong>
                <span>{p.status}</span>
                <small>{p.action} →</small>
              </button>
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
