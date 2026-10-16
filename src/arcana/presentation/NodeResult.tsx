import { Artwork } from './Artwork';
import { EncounterOutcome } from './EncounterOutcome';
import type { NodeReceipt } from '../application/run-contracts';
import type { Language } from '../domain/collection/wizards';
import type { NodeKind } from '../domain/exploration/route';
import { text, type MessageKey } from './translations';
const kinds: Record<NodeKind, MessageKey> = {
  duel: 'arcaneDuel',
  refuge: 'alchemyRefuge',
  chest: 'lootChest',
  pact: 'magicPact',
  encounter: 'chanceEncounter',
  boss: 'zoneBoss',
};
export function NodeResult({
  receipt,
  language,
  onReplay,
  onMissions,
  returnAction,
}: {
  receipt: NodeReceipt;
  language: Language;
  onReplay: () => void;
  onMissions: () => void;
  returnAction?: { label: string; onReturn: (origin: HTMLButtonElement) => void };
}) {
  const kind = receipt.run.graph.nodes.find((n) => n.id === receipt.request.nodeId)!.kind;
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  const countKey = (count: number, one: MessageKey, many: MessageKey) =>
    text(language, new Intl.PluralRules(language).select(count) === 'one' ? one : many, {
      count: numbers.format(count),
    });
  return (
    <section className="node-result notice" aria-label={text(language, 'confirmedNodeResult')}>
      <details className="receipt-disclosure" key={receipt.id}>
        <summary aria-label={text(language, 'confirmedNodeResult')}>
          <Artwork
            asset={`node.${kind}`}
            language={language}
            className="receipt-event-icon"
            decorative
          />
          <span className="receipt-saved-seal" aria-hidden="true">
            <Artwork asset="ui.seal" language={language} decorative />
          </span>
          <span className="receipt-objects" aria-hidden="true">
            {receipt.reward.crowns > 0 && (
              <span>
                <Artwork asset="currency.crowns" language={language} decorative />+
                {numbers.format(receipt.reward.crowns)}
              </span>
            )}
            {receipt.reward.goldKeys > 0 && (
              <span>
                <Artwork asset="product.gold-key" language={language} decorative />+
                {numbers.format(receipt.reward.goldKeys)}
              </span>
            )}
            {(['cacao-toad', 'random-beans'] as const).map((product) => {
              const count = receipt.reward.products.filter((p) => p === product).length;
              return count > 0 ? (
                <span key={product}>
                  <Artwork
                    asset={product === 'cacao-toad' ? 'toad.box' : 'beans.jar'}
                    language={language}
                    decorative
                  />
                  +{numbers.format(count)}
                </span>
              ) : null;
            })}
          </span>
          <span className="receipt-expand" aria-hidden="true">
            ⌄
          </span>
        </summary>
        <div className="receipt-body">
          <h3>
            {text(language, 'confirmedNodeResult')} · {text(language, kinds[kind])}
          </h3>
          <p className="visually-hidden">{text(language, 'nodeResultSaved')}</p>
          <button
            onClick={(event) => {
              if (returnAction) { returnAction.onReturn(event.currentTarget); return; }
              event.currentTarget.closest('details')?.removeAttribute('open');
              const target = document.querySelector<HTMLButtonElement>(
                '[data-node]:not(:disabled), [data-start-run]',
              );

              target?.focus({ preventScroll: true });
            }}
          >
            {returnAction?.label ?? text(language, 'returnToRoute')}
          </button>
          {receipt.reward.crowns > 0 && (
            <div className="reward-object">
              <Artwork asset="currency.crowns" language={language} decorative />
              <strong aria-hidden="true">+{numbers.format(receipt.reward.crowns)}</strong>
              <span className="visually-hidden">
                {text(language, 'crownsReward', { count: numbers.format(receipt.reward.crowns) })}
              </span>
            </div>
          )}
          {receipt.reward.goldKeys > 0 && (
            <div className="reward-object">
              <Artwork asset="product.gold-key" language={language} decorative />
              <strong aria-hidden="true">+{numbers.format(receipt.reward.goldKeys)}</strong>
              <span className="visually-hidden">
                {countKey(receipt.reward.goldKeys, 'goldKeyRewardOne', 'goldKeyRewardMany')}
              </span>
            </div>
          )}
          {(['cacao-toad', 'random-beans'] as const).map((product) => {
            const count = receipt.reward.products.filter((p) => p === product).length;
            return count > 0 ? (
              <div key={product} className="reward-object">
                <Artwork
                  asset={product === 'cacao-toad' ? 'toad.box' : 'beans.jar'}
                  language={language}
                  decorative
                />
                <strong aria-hidden="true">+{numbers.format(count)}</strong>
                <span className="visually-hidden">
                  {countKey(
                    count,
                    product === 'cacao-toad' ? 'toadRewardOne' : 'beanRewardOne',
                    product === 'cacao-toad' ? 'toadRewardMany' : 'beanRewardMany',
                  )}
                </span>
              </div>
            ) : null;
          })}
          {kind === 'encounter' && receipt.request.encounterAction !== 'pass' && (
            <EncounterOutcome resolution={receipt.encounter?.resolution} language={language} />
          )}
          {receipt.firstVictory === false && <p>{text(language, 'repeatVictoryReward')}</p>}
          {kind === 'refuge' && (
            <p>
              {text(
                language,
                receipt.request.refugeAction === 'focus' ? 'nodeFocusResolved' : 'refugeResolved',
              )}
            </p>
          )}
          {(receipt.request.encounterAction === 'pass' ||
            receipt.request.pactAction === 'pass') && <p>{text(language, 'nodePassed')}</p>}
          {kind === 'pact' && (
            <div className="pact-recruits">
              <p className="visually-hidden">{text(language, 'pactResolved')}</p>
              {receipt.run.members
                .filter((m) => m.source === 'temporary')
                .map((m) => (
                  <div key={m.unit.id}>
                    <Artwork
                      asset={`character.${m.unit.wizardId}.portrait`}
                      language={language}
                      decorative
                    />
                    <Artwork
                      asset="ui.temporary"
                      language={language}
                      className="recruit-source"
                      decorative
                    />
                  </div>
                ))}
            </div>
          )}
          {kind === 'boss' && receipt.battle?.outcome === 'player' && (
            <p>
              {text(language, 'bossUnlockSaved')}{' '}
              <button onClick={onMissions}>{text(language, 'viewUnlockedLocations')}</button>
            </p>
          )}
          {receipt.battle && (
            <>
              <p>
                {text(
                  language,
                  receipt.battle.outcome === 'player'
                    ? 'victory'
                    : receipt.battle.outcome === 'rival'
                      ? 'defeat'
                      : 'draw',
                )}
              </p>
              <button onClick={onReplay}>{text(language, 'viewSavedBattle')}</button>
            </>
          )}
          <details>
            <summary>{text(language, 'savedTeamVitals')}</summary>
            {receipt.run.members.map((m, index) => (
              <p key={m.unit.id}>
                {text(language, 'savedUnitVitals', {
                  number: index + 1,
                  hp: numbers.format(m.unit.hp),
                  maxHp: numbers.format(m.unit.maxHp),
                  mana: numbers.format(m.unit.mana),
                  maxMana: numbers.format(m.unit.maxMana),
                })}
              </p>
            ))}
          </details>
        </div>
      </details>
    </section>
  );
}
