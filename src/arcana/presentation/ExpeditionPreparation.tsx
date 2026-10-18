import { ChallengeChoice } from './ExpeditionChallenge';
import type { ExpeditionChallenge } from '../domain/exploration/challenges';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { GameState } from '../application/game';
import type { PublicContent } from '../application/public-content';
import {
  preparationUnit,
  preparationFormation,
  previewEquipment,
  effectivePreparationRules,
  filterPreparationCopies,
  type PreparationFilter,
} from './contextual-preparation';
import { equipmentSpellPower, equipmentInitiative } from '../domain/combat/equipment-effects';
import { AffinityLabel } from './TacticalBadge';
import { PreparationSynergies } from './PreparationSynergies';
import { IntentionReminder } from './ExpeditionIntentions';
import { contextualText as c } from './contextual-messages';
import './contextual-preparation.css';
import type { EquipEquipmentRequest, SetTeamRequest } from '../application/team-contracts';
import type { Language, OwnedWizard, WizardCatalog } from '../domain/collection/wizards';
import type { EquipmentSlot } from '../domain/economy/equipment';
import { Artwork } from './Artwork';
import { EquipmentArt } from './EquipmentArt';
import { themedName, wizardName } from './content-packs/active';
import { equipmentName } from './equipment-label';
import { equipmentSpecializationText } from './equipment-specialization';
import { prepText } from './prep-messages';
import { text } from './translations';
import './expedition-preparation.css';
import { useSelectionMotion } from './useSelectionMotion';
import { useReducedMotion } from './useReducedMotion';

function PreparationGear({
  copy,
  game,
  language,
  ready,
  onEquip,
  content,
}: {
  content?: PublicContent;
  copy: OwnedWizard;
  game: GameState;
  language: Language;
  ready: boolean;
  onEquip: (request: EquipEquipmentRequest) => void;
}) {
  const [slot, setSlot] = useState<EquipmentSlot | null>(null);
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    maximumFractionDigits: 2,
  });
  const comparison = (before: number, after: number) =>
    `${numbers.format(before)} → ${numbers.format(after)}`;
  const loadout = game.team?.loadouts.find((entry) => entry.copyId === copy.copyId);
  const equippedId = slot === 'wand' ? loadout?.wandId : loadout?.broomId;
  const { reduced } = useReducedMotion();
  const slotMotion = useSelectionMotion(
    `${copy.copyId}:${loadout?.wandId ?? ''}:${loadout?.broomId ?? ''}`,
    reduced,
    160,
  );
  return (
    <div className="preparation-gear">
      <div
        className="preparation-gear-slots"
        ref={slotMotion}
        aria-label={prepText(language, 'equipment')}
      >
        {(['wand', 'broom'] as const).map((kind) => {
          const id = kind === 'wand' ? loadout?.wandId : loadout?.broomId;
          const item = game.inventory.equipment?.find((entry) => entry.id === id);
          return (
            <button
              key={kind}
              className="game-object preparation-gear-slot"
              aria-expanded={slot === kind}
              aria-label={text(language, kind === 'wand' ? 'wandForCopy' : 'broomForCopy', {
                number: game.copies.indexOf(copy) + 1,
              })}
              onClick={() => setSlot(slot === kind ? null : kind)}
            >
              {item ? (
                <EquipmentArt item={item} language={language} selectionMotion={false} />
              ) : (
                <Artwork asset="ui.clear" language={language} decorative />
              )}
              <span>{item ? equipmentName(item, language) : prepText(language, 'remove')}</span>
            </button>
          );
        })}
      </div>
      {slot && (
        <div
          className="preparation-gear-tray"
          role="group"
          aria-label={text(language, slot === 'wand' ? 'wandForCopy' : 'broomForCopy', {
            number: game.copies.indexOf(copy) + 1,
          })}
        >
          <button
            className="game-object"
            disabled={!ready || !equippedId}
            aria-label={prepText(language, 'remove')}
            aria-pressed={!equippedId}
            onClick={() => onEquip({ copyId: copy.copyId, slot, equipmentId: null })}
          >
            <Artwork asset="ui.clear" language={language} decorative />
            <span>{prepText(language, 'remove')}</span>
            <small className="gear-stat-comparison">
              {slot === 'wand' ? text(language, 'power') : c(language, 'initiative')}{' '}
              {slot === 'wand'
                ? comparison(
                    previewEquipment(game, copy, slot, null, content).powerBefore,
                    previewEquipment(game, copy, slot, null, content).powerAfter,
                  )
                : comparison(
                    previewEquipment(game, copy, slot, null, content).initiativeBefore,
                    previewEquipment(game, copy, slot, null, content).initiativeAfter,
                  )}
            </small>
          </button>
          {(game.inventory.equipment ?? [])
            .filter((item) => item.kind === slot)
            .map((item) => {
              const owner = game.team?.loadouts.find(
                (entry) => entry.wandId === item.id || entry.broomId === item.id,
              );
              const ownerCopy = game.copies.find((entry) => entry.copyId === owner?.copyId);
              const name = equipmentName(item, language);
              const preview = previewEquipment(game, copy, slot, item.id, content);
              const label =
                ownerCopy && ownerCopy.copyId !== copy.copyId
                  ? prepText(language, 'transfer', {
                      name,
                      owner: wizardName(ownerCopy.wizard, language),
                    })
                  : prepText(language, 'equip', { name });
              return (
                <button
                  key={item.id}
                  className="game-object"
                  data-equipment-id={item.id}
                  disabled={!ready || equippedId === item.id}
                  aria-pressed={equippedId === item.id}
                  aria-label={label}
                  title={label}
                  onClick={() => onEquip({ copyId: copy.copyId, slot, equipmentId: item.id })}
                >
                  <EquipmentArt item={item} language={language} />
                  <span>{name}</span>
                  <small className="gear-stat-comparison" data-equipment-preview={slot}>
                    {slot === 'wand' ? text(language, 'power') : c(language, 'initiative')}{' '}
                    {slot === 'wand'
                      ? comparison(preview.powerBefore, preview.powerAfter)
                      : comparison(preview.initiativeBefore, preview.initiativeAfter)}
                  </small>
                  {slot === 'wand' &&
                    (preview.initiativeBefore !== preview.initiativeAfter ||
                      preview.healingBefore !== preview.healingAfter) && (
                      <small className="gear-stat-comparison" data-specialization-preview>
                        {c(language, 'initiative')}{' '}
                        {comparison(preview.initiativeBefore, preview.initiativeAfter)}
                        {' · '}
                        {equipmentSpecializationText('healing', language)}{' '}
                        {comparison(preview.healingBefore, preview.healingAfter)}
                      </small>
                    )}
                  {slot === 'wand' &&
                    item.kind === 'wand' &&
                    (item.healing || item.initiativeBonus) &&
                    game.exploration?.run?.status === 'active' &&
                    game.exploration.run.equipmentRulesVersion !== 2 && (
                      <small>{equipmentSpecializationText('legacy', language)}</small>
                    )}
                  {ownerCopy && ownerCopy.copyId !== copy.copyId && (
                    <small className="preparation-gear-owner">
                      {wizardName(ownerCopy.wizard, language)}
                    </small>
                  )}
                  {equippedId === item.id && (
                    <Artwork
                      asset="ui.seal"
                      language={language}
                      className="preparation-selection-seal"
                      decorative
                    />
                  )}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

/** A local choice until confirmation; this component never grants a character or starts a run itself. */
export function ExpeditionPreparation({
  game,
  catalog,
  language,
  ready,
  onTeam,
  onEquip,
  onStart,
  onClose,
  content,
  context = 'formation',
  onReturnToMap,
  recovery,
  combatChoices = [],
  onCombatNode,
}: {
  content?: PublicContent;
  recovery?: ReactNode;
  context?: 'formation' | 'beans';
  combatChoices?: readonly { id: string; kind: 'duel' | 'boss' }[];
  onCombatNode?: (id: string) => void;
  onReturnToMap?: () => void;
  game: GameState;
  catalog: WizardCatalog;
  language: Language;
  ready: boolean;
  onTeam: (request: SetTeamRequest) => void;
  onEquip: (request: EquipEquipmentRequest) => void;
  onStart: (copyIds: readonly string[], challenge?: ExpeditionChallenge) => void;
  onClose?: () => void;
}) {
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    maximumFractionDigits: 2,
  });
  const hasBeans = game.inventory.products.some(
    (product) => product.kind === 'random-beans' && product.status === 'available',
  );
  const run = game.exploration?.run?.status === 'active' ? game.exploration.run : null;
  const committed = run
    ? run.members.filter((member) => member.source === 'owned').map((member) => member.unit.id)
    : [];
  const committedKey = committed.join('|');
  const [chosen, setChosen] = useState<readonly string[]>(committed);
  const [inspected, setInspected] = useState<string | null>(null);
  const inspector = useRef<HTMLDialogElement>(null);
  const inspectionOrigin = useRef<HTMLButtonElement | null>(null);
  const inspectionTitle = useId();
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<PreparationFilter>({});
  const [challenge, setChallenge] = useState<ExpeditionChallenge>('discovery');
  const lastRun = game.exploration?.run;
  const recommendedChallenge =
    lastRun?.status === 'won'
      ? lastRun.challenge === 'discovery'
        ? 'tactical'
        : lastRun.challenge === 'tactical'
          ? 'mastery'
          : undefined
      : undefined;
  useEffect(() => {
    setChosen(committedKey ? committedKey.split('|') : []);
  }, [committedKey, run?.id]);
  const temporary = run?.members.filter((member) => member.source === 'temporary') ?? [];
  const capacity = 5 - temporary.length;
  const selectedCopy = game.copies.find((copy) => copy.copyId === inspected);
  const knownMembers = [...(run?.members ?? []), ...(run?.reserves ?? [])];
  const recordedInspected = knownMembers.find((member) => member.unit.id === inspected);
  const inspectedUnit = selectedCopy
    ? preparationUnit(game, selectedCopy, content)
    : recordedInspected?.unit;
  const selectedWizard =
    selectedCopy?.wizard ?? catalog.wizards.find((wizard) => wizard.id === inspectedUnit?.wizardId);
  const formation = preparationFormation(game, chosen, content);
  const previousFormation = preparationFormation(game, committed, content);
  useEffect(() => {
    if (inspected && inspector.current && !inspector.current.open) inspector.current.showModal();
  }, [inspected]);
  const inspect = (copyId: string, origin: HTMLButtonElement) => {
    inspectionOrigin.current = origin;
    setInspected(copyId);
  };
  const closeInspection = () => {
    inspector.current?.close();
    setInspected(null);
    inspectionOrigin.current?.focus();
  };
  const hasStandingAlly =
    !run ||
    temporary.some((member) => member.unit.hp > 0) ||
    chosen.some(
      (id) =>
        (knownMembers.find((member) => member.unit.id === id)?.unit.hp ??
          game.copies.find((copy) => copy.copyId === id)?.wizard.stats.maxHp ??
          0) > 0,
    );
  const changed = chosen.join('|') !== committedKey;
  const filteredCopies = filterPreparationCopies(game, content, filter);
  const identities = game.copies.filter(
    (copy, index, copies) =>
      copies.findIndex((entry) => entry.wizard.id === copy.wizard.id) === index,
  );
  const availableAffinities = [
    ...new Set(
      game.copies.map((copy) => preparationUnit(game, copy, content).affinity ?? 'unknown'),
    ),
  ];
  const changeFilter = (next: PreparationFilter) => {
    setFilter(next);
    setPage(0);
  };
  const pageCount = Math.max(1, Math.ceil(filteredCopies.length / 6));
  const currentPage = Math.min(page, pageCount - 1);
  const canConfirm =
    ready &&
    chosen.length + temporary.length >= 1 &&
    chosen.length <= capacity &&
    hasStandingAlly &&
    (!run || changed);
  const p = (key: Parameters<typeof prepText>[1], values?: Record<string, string | number>) =>
    prepText(language, key, values);
  return (
    <section
      className="expedition-preparation"
      data-expedition-preparation={run ? 'active' : 'new'}
      aria-label={p('preparation')}
    >
      <header>
        <h2>{context === 'beans' ? text(language, 'beanChallenge') : p('preparation')}</h2>
        {onClose && (
          <button
            className="preparation-back game-object"
            aria-label={p('return')}
            onClick={onClose}
          >
            <Artwork asset="ui.pass" language={language} decorative />
            <span className="visually-hidden">{p('return')}</span>
          </button>
        )}
      </header>
      {!inspected && recovery}
      {content && <IntentionReminder game={game} content={content} language={language} />}
      {context === 'beans' && (
        <section
          className="preparation-beans-destination"
          aria-label={c(language, 'beansDestination')}
        >
          <Artwork asset="beans.jar" language={language} decorative />
          <div>
            <strong>{c(language, hasBeans ? 'beansDestination' : 'emptyJar')}</strong>
            <p>{hasBeans ? c(language, 'beansNext') : text(language, 'noBeansAvailable')}</p>
          </div>
          {combatChoices.length === 1 && onCombatNode && (
            <div
              className="preparation-combat-destinations"
              role="group"
              aria-label={c(language, 'beansNext')}
            >
              {combatChoices.map((node) => (
                <button
                  key={node.id}
                  className="game-object"
                  data-prepare-combat={node.id}
                  disabled={!ready}
                  onClick={() => onCombatNode(node.id)}
                >
                  <Artwork asset={`node.${node.kind}`} language={language} decorative />
                  <span>{c(language, node.kind === 'boss' ? 'prepareBoss' : 'prepareDuel')}</span>
                  <small>
                    <Artwork asset="currency.essence" language={language} decorative />5
                  </small>
                </button>
              ))}
            </div>
          )}
          {onReturnToMap && (
            <button className="game-object" onClick={onReturnToMap}>
              <Artwork asset="ui.map" language={language} decorative />
              <span>{c(language, 'returnMap')}</span>
            </button>
          )}
        </section>
      )}
      {context === 'formation' && (
        <>
          {!run && content?.campaign.challenges && (
            <ChallengeChoice
              recommended={recommendedChallenge}
              value={challenge}
              onChange={setChallenge}
              language={language}
              ready={ready}
            />
          )}
          <div
            className="preparation-formation"
            aria-label={p('capacity', { count: formation.length })}
          >
            {formation.map((member, index) => {
              const copy = game.copies.find((entry) => entry.copyId === member.unit.id);
              const name = copy
                ? wizardName(copy.wizard, language)
                : themedName(
                    member.unit.wizardId,
                    catalog.wizards.find((wizard) => wizard.id === member.unit.wizardId)?.name[
                      language
                    ] ?? text(language, 'temporaryAlly'),
                    language,
                  );
              return (
                <div
                  className={
                    member.source === 'temporary'
                      ? 'preparation-position preparation-temporary'
                      : 'preparation-position'
                  }
                  key={member.unit.id}
                  data-filled="true"
                  data-condition={member.unit.hp <= 0 ? 'fallen' : 'standing'}
                >
                  <button
                    className="game-object"
                    aria-label={p('consult', { name })}
                    aria-haspopup="dialog"
                    onClick={(event) => inspect(member.unit.id, event.currentTarget)}
                  >
                    <Artwork
                      asset={`character.${member.unit.wizardId}.thumbnail`}
                      language={language}
                      decorative
                    />
                    <span>{index + 1}</span>
                    <Artwork
                      asset={member.source === 'temporary' ? 'ui.temporary' : 'ui.owned'}
                      language={language}
                      className="preparation-temporary-seal"
                      decorative
                    />
                    <span className="visually-hidden">
                      {c(language, member.source === 'temporary' ? 'temporary' : 'owned')} ·{' '}
                      {member.unit.hp}/{member.unit.maxHp} {text(language, 'hP')}
                    </span>
                  </button>
                </div>
              );
            })}
            {Array.from({ length: Math.max(0, 5 - formation.length) }, (_, i) => (
              <div
                className="preparation-position preparation-vacant"
                key={`empty-${i}`}
                data-filled="false"
              >
                <span
                  className="preparation-empty"
                  aria-label={p('slot', { number: formation.length + i + 1 })}
                >
                  {formation.length + i + 1}
                </span>
              </div>
            ))}
          </div>
          <div className="preparation-legend">
            <span className="preparation-capacity" aria-live="polite">
              <span aria-hidden="true">{chosen.length + temporary.length}/5</span>
              <span className="visually-hidden">
                {p('capacity', { count: chosen.length + temporary.length })}
              </span>
            </span>
            {temporary.length > 0 && (
              <span className="preparation-origin" title={p('temporaryHint')}>
                <Artwork asset="ui.temporary" language={language} decorative />
                <span>{p('thisRoute')}</span>
                <span className="visually-hidden">{p('temporaryHint')}</span>
              </span>
            )}
            <details className="preparation-help">
              <summary aria-label={p('help')} title={p('help')}>
                <span aria-hidden="true">?</span>
              </summary>
              <div>
                <p>{p('minimum')}</p>
                <p>{p('duels')}</p>
                {temporary.length > 0 && <p>{p('temporaryHint')}</p>}
              </div>
            </details>
          </div>
          {content && (
            <PreparationSynergies
              members={formation}
              previous={run ? previousFormation : undefined}
              rules={effectivePreparationRules(run, content.combatRules)}
              language={language}
            />
          )}
          <div className="preparation-workspace">
            <div className="preparation-roster">
              <h3>{p(chosen.length ? 'own' : 'choose')}</h3>
              {game.copies.length > 6 && (
                <details className="preparation-filters">
                  <summary>{p('findCompanion')}</summary>
                  <div
                    className="preparation-affinity-filters"
                    role="group"
                    aria-label={p('filterAffinity')}
                  >
                    <button
                      className="game-object"
                      aria-pressed={!filter.affinity}
                      onClick={() => changeFilter({ ...filter, affinity: undefined })}
                    >
                      {p('allAffinities')}
                    </button>
                    {availableAffinities.map((affinity) => (
                      <button
                        className="game-object"
                        key={affinity}
                        data-preparation-affinity={affinity}
                        aria-pressed={filter.affinity === affinity}
                        onClick={() =>
                          changeFilter({
                            ...filter,
                            affinity: filter.affinity === affinity ? undefined : affinity,
                          })
                        }
                      >
                        {affinity === 'unknown' ? (
                          <span>{c(language, 'unknown')}</span>
                        ) : (
                          <AffinityLabel affinity={affinity} language={language} />
                        )}
                      </button>
                    ))}
                  </div>
                  <details className="preparation-identity-filters">
                    <summary>{p('filterIdentity')}</summary>
                    <div role="group" aria-label={p('filterIdentity')}>
                      <button
                        className="game-object"
                        aria-pressed={!filter.wizardId}
                        onClick={() => changeFilter({ ...filter, wizardId: undefined })}
                      >
                        {p('allIdentities')}
                      </button>
                      {identities.map((copy) => (
                        <button
                          className="game-object"
                          key={copy.wizard.id}
                          data-preparation-identity={copy.wizard.id}
                          aria-label={wizardName(copy.wizard, language)}
                          aria-pressed={filter.wizardId === copy.wizard.id}
                          onClick={() =>
                            changeFilter({
                              ...filter,
                              wizardId:
                                filter.wizardId === copy.wizard.id ? undefined : copy.wizard.id,
                            })
                          }
                        >
                          <Artwork
                            asset={`character.${copy.wizard.id}.thumbnail`}
                            language={language}
                            decorative
                          />
                          <span>{wizardName(copy.wizard, language)}</span>
                        </button>
                      ))}
                    </div>
                  </details>
                  {(filter.affinity || filter.wizardId) && (
                    <button className="preparation-clear-filter" onClick={() => changeFilter({})}>
                      {p('clearFilters')}
                    </button>
                  )}
                </details>
              )}
              {filteredCopies.length === 0 && (
                <p role="status" className="preparation-filter-empty">
                  {p('noMatches')}{' '}
                  <button onClick={() => changeFilter({})}>{p('clearFilters')}</button>
                </p>
              )}
              <div
                className="preparation-cards"
                data-count={Math.min(6, filteredCopies.length - currentPage * 6)}
              >
                {filteredCopies.slice(currentPage * 6, currentPage * 6 + 6).map((copy) => {
                  const selected = chosen.includes(copy.copyId);
                  const number =
                    game.copies
                      .filter((entry) => entry.wizard.id === copy.wizard.id)
                      .indexOf(copy) + 1;
                  const name = wizardName(copy.wizard, language);
                  const unit = preparationUnit(game, copy, content);
                  return (
                    <div className="preparation-card-entry" key={copy.copyId}>
                      <button
                        className="game-object preparation-card"
                        data-copy-id={copy.copyId}
                        aria-label={p('chooseCopy', { name, number })}
                        aria-describedby={`${inspectionTitle}-peek-${copy.copyId}`}
                        aria-pressed={selected}
                        disabled={!ready || (!selected && chosen.length >= capacity)}
                        onClick={() => {
                          setChosen(
                            selected
                              ? chosen.filter((id) => id !== copy.copyId)
                              : [...chosen, copy.copyId],
                          );
                        }}
                      >
                        <Artwork
                          asset={`character.${copy.wizard.id}.portrait`}
                          language={language}
                          decorative
                        />
                        <span>{name}</span>
                        <small
                          className={
                            game.copies.filter((entry) => entry.wizard.id === copy.wizard.id)
                              .length > 1
                              ? undefined
                              : 'visually-hidden'
                          }
                        >
                          {p('copy', { number })}
                        </small>
                        {selected && (
                          <Artwork
                            asset="ui.seal"
                            language={language}
                            className="preparation-selection-seal"
                            decorative
                          />
                        )}
                      </button>
                      <div
                        className="preparation-peek"
                        role="tooltip"
                        id={`${inspectionTitle}-peek-${copy.copyId}`}
                      >
                        <strong>{name}</strong>
                        <span>
                          {text(language, 'hP')}{' '}
                          {unit ? `${unit.hp}/${unit.maxHp}` : copy.wizard.stats.maxHp} ·{' '}
                          {text(language, 'mP')}{' '}
                          {unit ? `${unit.mana}/${unit.maxMana}` : copy.wizard.stats.maxMana}
                        </span>
                      </div>
                      <button
                        className="game-object preparation-inspect-trigger"
                        data-preparation-inspect={copy.copyId}
                        aria-label={p('consult', { name })}
                        aria-haspopup="dialog"
                        onClick={(event) => inspect(copy.copyId, event.currentTarget)}
                      >
                        <svg aria-hidden="true" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="12" />
                          <path d="M16 15v8M16 9v1" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
              {pageCount > 1 && (
                <div className="preparation-pages">
                  <button
                    className="game-object"
                    aria-label={text(language, 'gamePreviousPage')}
                    disabled={currentPage === 0}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    <Artwork asset="ui.pass" language={language} decorative />
                  </button>
                  <span>
                    {currentPage + 1}/{pageCount}
                  </span>
                  <button
                    className="game-object"
                    aria-label={text(language, 'gameNextPage')}
                    disabled={currentPage === pageCount - 1}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    <Artwork asset="ui.pass" language={language} decorative />
                  </button>
                </div>
              )}
            </div>
            {selectedWizard && inspectedUnit && (
              <dialog
                ref={inspector}
                className="preparation-inspection"
                aria-labelledby={inspectionTitle}
                onCancel={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  closeInspection();
                }}
              >
                <button
                  className="game-object preparation-inspection-close"
                  aria-label={p('return')}
                  onClick={closeInspection}
                  autoFocus
                >
                  <span aria-hidden="true">×</span>
                </button>
                <>
                  <div className="preparation-character">
                    <Artwork
                      asset={`character.${selectedWizard.id}.figure`}
                      language={language}
                      decorative
                    />
                    <h3 id={inspectionTitle}>{wizardName(selectedWizard, language)}</h3>
                  </div>
                  <small className="preparation-stat-label">
                    {c(language, recordedInspected?.source === 'temporary' ? 'temporary' : 'owned')}
                  </small>
                  <dl
                    className="preparation-stats"
                    aria-label={p(recordedInspected ? 'runStats' : 'base')}
                  >
                    {(
                      [
                        [
                          'hP',
                          inspectedUnit
                            ? `${inspectedUnit.hp}/${inspectedUnit.maxHp}`
                            : selectedWizard.stats.maxHp,
                        ],
                        [
                          'mP',
                          inspectedUnit
                            ? `${inspectedUnit.mana}/${inspectedUnit.maxMana}`
                            : selectedWizard.stats.maxMana,
                        ],
                        [
                          'power',
                          `${numbers.format(inspectedUnit.power)} → ${numbers.format(equipmentSpellPower(inspectedUnit))}`,
                        ],
                        [
                          'speed',
                          `${numbers.format(inspectedUnit.speed)} → ${numbers.format(equipmentInitiative(inspectedUnit))}`,
                        ],
                      ] as const
                    ).map(([key, value]) => (
                      <div key={key}>
                        <dt>{text(language, key)}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="preparation-affinity">
                    {c(language, inspectedUnit.affinity ?? 'unknown')}
                  </p>
                  <small className="preparation-stat-label">{c(language, 'baseToGear')}</small>
                  {recovery}
                  {selectedCopy && (
                    <PreparationGear
                      key={selectedCopy.copyId}
                      copy={selectedCopy}
                      game={game}
                      language={language}
                      ready={ready}
                      onEquip={onEquip}
                      content={content}
                    />
                  )}
                  {selectedCopy && (
                    <small className="preparation-stat-label">{c(language, 'savedGear')}</small>
                  )}
                </>
              </dialog>
            )}
          </div>
          <footer>
            {!hasStandingAlly && <p role="status">{p('needStanding')}</p>}
            <button
              className="preparation-confirm game-object"
              data-preparation-confirm
              disabled={!canConfirm}
              onClick={() =>
                run
                  ? onTeam({ copyIds: chosen })
                  : onStart(chosen, content?.campaign.challenges ? challenge : undefined)
              }
            >
              <Artwork asset={run ? 'ui.seal' : 'ui.map'} language={language} decorative />
              <span>{p(run ? (changed ? 'save' : 'saved') : 'start')}</span>
            </button>
          </footer>
        </>
      )}
    </section>
  );
}
