import type { Combat } from '../domain/combat/engine';
import type { Language } from '../domain/collection/wizards';
import { battleFacts, type BattleFact as BossBattleFact } from '../application/client/battle-facts';
import type { IntentionChoice } from '../domain/exploration/intentions';
import { HouseInsignia, houseName } from './HouseInsignia';
import { bondName } from './BondEmblem';
import { priorityText } from './priority-messages';
import { bossText } from './boss-messages';
import { themedName } from './content-packs/active';
import { Artwork } from './Artwork';
import './boss-closure-a70.css';

/** Static, inspectable facts. Reading a historical result must not announce or celebrate it again. */
type FactProps = { combat: Combat; language: Language; preferred?: IntentionChoice | null };
export function BossBattleFacts(props: FactProps) {
  return <BattleFacts {...props} bossContext />;
}
export function BattleFacts({
  combat,
  language,
  preferred,
  bossContext = false,
}: FactProps & { bossContext?: boolean }) {
  const facts = battleFacts(combat, preferred);
  if (!facts.length) return null;
  const format = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-GB');
  const describe = (fact: BossBattleFact) => {
    if (fact.kind === 'house' || fact.kind === 'bond') {
      const name =
        fact.kind === 'house' ? houseName(fact.house, language) : bondName(fact.group, language);
      return {
        asset: fact.kind === 'house' ? 'ui.collection' : `bond.${fact.group}`,
        label: priorityText(language, fact.kind),
        summary: priorityText(language, fact.kind === 'house' ? 'houseFact' : 'bondFact', {
          name,
          tier: fact.tier === 1 ? 'I' : 'II',
        }),
        description: priorityText(language, 'groupDetail', { count: fact.members }),
      };
    }
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
    if (fact.kind === 'guard')
      return {
        asset: `character.${fact.wizardId}.thumbnail`,
        label: priorityText(language, 'guard'),
        summary: priorityText(language, 'guardFact', { name, amount: format.format(fact.amount) }),
        description: priorityText(language, 'guardDetail'),
      };
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
    <section
      className="boss-battle-facts"
      data-battle-facts
      data-boss-facts={bossContext || undefined}
      aria-label={bossText(language, 'facts')}
    >
      {facts.map((fact) => {
        const visual = describe(fact);
        return (
          <details
            key={`${fact.kind}:${fact.sequence}`}
            className="boss-battle-fact"
            data-battle-fact={fact.kind}
            data-boss-fact={bossContext ? fact.kind : undefined}
          >
            <summary>
              {fact.kind === 'house' ? (
                <HouseInsignia house={fact.house} />
              ) : (
                <Artwork asset={visual.asset} language={language} decorative />
              )}
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
