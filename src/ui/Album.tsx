import { useState } from 'react';
import {
  copyCount,
  discoveryCount,
  type DemoState,
  type Identity,
  type Language,
  type Family,
  type RarityId,
} from '../domain/model';
import {
  copiesText,
  familyName,
  progressText,
  rarityName,
  raritySymbol,
  translate,
} from '../i18n/messages';
import { IdentityArtwork } from './VisualArt';
import { Rarity } from './IdentityDetails';
export function Album({
  active,
  state,
  language,
  identities,
  onInspect,
}: {
  active: boolean;
  state: DemoState;
  language: Language;
  identities: Identity[];
  onInspect: (id: string) => void;
}) {
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const [family, setFamily] = useState<Family | 'all'>('all'),
    [rarity, setRarity] = useState<RarityId | 'all'>('all');
  const filtered = identities.filter(
    (i) => (family === 'all' || i.family === family) && (rarity === 'all' || i.rarityId === rarity),
  );
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">{t('bookLabel')}</p>
        <h1 tabIndex={-1}>{t('album')}</h1>
        <p>{t('albumIntro')}</p>
      </div>
      <div className="collection-progress">
        <strong>{progressText(language, discoveryCount(state))}</strong>
        <progress aria-label={t('progressLabel')} value={discoveryCount(state)} max="12" />
      </div>
      <div className="filters">
        <label>
          {t('familyFilter')}
          <select value={family} onChange={(e) => setFamily(e.target.value as Family | 'all')}>
            <option value="all">{t('all')}</option>
            {(['person', 'object', 'flavour'] as Family[]).map((f) => (
              <option value={f} key={f}>
                {familyName(language, f)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('rarityFilter')}
          <select value={rarity} onChange={(e) => setRarity(e.target.value as RarityId | 'all')}>
            <option value="all">{t('allRarities')}</option>
            {(['R01', 'R02', 'R03'] as RarityId[]).map((r) => (
              <option value={r} key={r}>
                {raritySymbol[r]} {rarityName(language, r)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="fine-print">
        {t('filterCount')}: {filtered.length} / 12
      </p>
      <ul className="album-grid">
        {filtered.map((i) => {
          const count = copyCount(state, i.id);
          return (
            <li key={i.id}>
              <button
                id={'identity-' + i.id}
                className={'album-entry ' + (count ? 'discovered' : 'undiscovered')}
                onClick={() => {
                  onInspect(i.id);
                }}
              >
                {active && <IdentityArtwork identity={i} />}
                <strong>{i.name[language]}</strong>
                <span>{familyName(language, i.family)}</span>
                <Rarity identity={i} language={language} />
                <span className="entry-state">
                  {count ? copiesText(language, count) : t('pending')}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {!filtered.length && (
        <section>
          <p>{t('empty')}</p>
          <button
            onClick={() => {
              setFamily('all');
              setRarity('all');
            }}
          >
            {t('resetFilters')}
          </button>
        </section>
      )}
      <p className="art-caption">{t('placeholder')}</p>
    </>
  );
}
