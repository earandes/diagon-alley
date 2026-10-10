import { copyCount, type Identity, type DemoState, type Language } from '../domain/model';
import { copiesText, familyName, rarityName, raritySymbol, translate } from '../i18n/messages';
import { IdentityArtwork } from './VisualArt';
export function Rarity({ identity, language }: { identity: Identity; language: Language }) {
  return (
    <span className={'rarity ' + identity.rarityId}>
      <span aria-hidden="true">{raritySymbol[identity.rarityId]}</span>{' '}
      {rarityName(language, identity.rarityId)}
    </span>
  );
}
export function IdentityDetails({
  identity,
  state,
  language,
}: {
  identity: Identity;
  state: DemoState;
  language: Language;
}) {
  return (
    <>
      <div className="keepsake-art">
        <IdentityArtwork identity={identity} />
      </div>
      <p className="art-caption">{translate(language, 'placeholder')}</p>
      <h2>{identity.name[language]}</h2>
      <p>
        {familyName(language, identity.family)} · <Rarity identity={identity} language={language} />
      </p>
      <p>{identity.context[language]}</p>
      <p className="origin">{translate(language, 'from')}</p>
      <p className="copy-count">{copiesText(language, copyCount(state, identity.id))}</p>
      {state.copies.some((c) => c.identity.id === identity.id && c.origin === 'gift') && (
        <p className="gift-note">{translate(language, 'knownGift')}</p>
      )}
    </>
  );
}
