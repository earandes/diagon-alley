import type { Combat } from '../domain/combat/engine';
import type { Language } from '../domain/collection/wizards';
import { bossBattleFacts, type BossBattleFact } from './boss-facts';
import { bossText } from './boss-messages';
import { themedName } from './content-packs/active';
import { Artwork } from './Artwork';
import './boss-closure-a70.css';

/** Static, inspectable facts. Reading a historical result must not announce or celebrate it again. */
export function BossBattleFacts({ combat, language }: { combat: Combat; language: Language }) {
  const facts = bossBattleFacts(combat);
  if (!facts.length) return null;
  const format = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-GB');
  const describe = (fact: BossBattleFact) => {
    if (fact.kind === 'synergy') {
      const values = {
        affinity: bossText(language, fact.affinity),
        members: format.format(fact.members),
      };
      return {
        asset: 'node.refuge',
        label: bossText(language, 'synergy'),
        summary: bossText(language, 'synergyFact', values),
        description: bossText(language, 'synergyDescription', values),
      };
    }
    const name = bossText(language, 'positionedName', {
      name: themedName(fact.wizardId, bossText(language, 'companion'), language),
      position: format.format(
        combat.input.player.findIndex((unit) => unit.id === fact.actorId) + 1,
      ),
    });
    if (fact.kind === 'bean') {
      const values = { name, flavour: bossText(language, fact.flavour) };
      return {
        asset: `character.${fact.wizardId}.thumbnail`,
        label: bossText(language, 'bean'),
        summary: bossText(language, 'beanFact', values),
        description: bossText(language, 'beanDescription', values),
      };
    }
    const values = {
      name,
      amount: format.format(fact.amount),
      source: bossText(language, fact.source),
    };
    return {
      asset: `character.${fact.wizardId}.thumbnail`,
      label: bossText(language, 'healing'),
      summary: bossText(language, 'healingFact', values),
      description: bossText(language, 'healingDescription', values),
    };
  };
  return (
    <section className="boss-battle-facts" data-boss-facts aria-label={bossText(language, 'facts')}>
      {facts.map((fact) => {
        const visual = describe(fact);
        return (
          <details
            key={`${fact.kind}:${fact.sequence}`}
            className="boss-battle-fact"
            data-boss-fact={fact.kind}
          >
            <summary>
              <Artwork asset={visual.asset} language={language} decorative />
              <span>
                <small>{visual.label}</small>
                <span>{visual.summary}</span>
              </span>
            </summary>
            <p>{visual.description}</p>
          </details>
        );
      })}
    </section>
  );
}
