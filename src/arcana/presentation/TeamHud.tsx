import { AffinityLabel } from './TacticalBadge';
import { BondBand } from './BondBand';
import { createPortal } from 'react-dom';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { themedName, wizardName } from './content-packs/active';
import type { GameState } from '../application/game';
import type { PublicContent } from '../application/public-content';
import type { Language } from '../domain/collection/wizards';
import { activeSynergies } from '../domain/combat/synergies';
import { equipmentName } from './equipment-label';
import { text } from './translations';
import { prepText } from './prep-messages';
import { Artwork } from './Artwork';
import { TraitBadge } from './HouseInsignia';
import { effectivePreparationRules } from './contextual-preparation';

export function TeamHud({
  game,
  content,
  language,
  onPrepare,
}: {
  game: GameState;
  content: PublicContent | null;
  language: Language;
  onPrepare?: (origin: HTMLElement) => void;
}) {
  const run = game.exploration?.run;
  const partyRoot = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const element = partyRoot.current;
    const panel = element?.parentElement;
    if (!element || !panel?.matches('.expedition-panel')) return;
    const measure = () =>
      panel.style.setProperty(
        '--party-map-space',
        element.querySelector('.house-band')
          ? `${Math.ceil(element.getBoundingClientRect().height) + 24}px`
          : '0px',
      );
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => {
      observer.disconnect();
      panel.style.removeProperty('--party-map-space');
    };
  }, []);
  const units = run
    ? run.members.map((m) => ({
        ...m.unit,
        temporary: m.source === 'temporary',
        name: themedName(
          m.unit.wizardId,
          game.copies.find((c) => c.copyId === m.unit.id)?.wizard.name[language] ??
            content?.catalog.wizards.find((w) => w.id === m.unit.wizardId)?.name[language] ??
            text(language, 'temporaryAlly'),
          language,
        ),
      }))
    : game.copies
        .filter((c) => game.team?.copyIds.includes(c.copyId))
        .map((c) => ({
          id: c.copyId,
          wizardId: c.wizard.id,
          affinity: content?.campaign.ownedAffinities?.[c.wizard.id] ?? null,
          temporary: false,
          name: wizardName(c.wizard, language),
          hp: c.wizard.stats.maxHp,
          maxHp: c.wizard.stats.maxHp,
          mana: c.wizard.stats.maxMana,
          maxMana: c.wizard.stats.maxMana,
          power: c.wizard.stats.power,
          speed: c.wizard.stats.speed,
        }));
  const [opened, setOpened] = useState<string | null>(null);
  const [position, setPosition] = useState({ left: 8, top: 8 });
  const pinned = useRef(false),
    delay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>()),
    card = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const suppressFocus = useRef<string | null>(null);
  const clearDelay = () => {
    if (delay.current) clearTimeout(delay.current);
  };
  const close = () => {
    clearDelay();
    pinned.current = false;
    setOpened(null);
  };
  const inspect = (id: string) => {
    clearDelay();
    if (!pinned.current) setOpened(id);
  };
  const leave = () => {
    clearDelay();
    delay.current = setTimeout(() => {
      if (
        !pinned.current &&
        !card.current?.contains(document.activeElement) &&
        ![...triggers.current.values()].some((b) => b === document.activeElement)
      )
        setOpened(null);
    }, 180);
  };
  useEffect(() => () => clearDelay(), []);
  useEffect(() => {
    if (!opened) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        const origin = triggers.current.get(opened);
        const returnFocus = card.current?.contains(document.activeElement);
        close();
        if (returnFocus) {
          suppressFocus.current = opened;
          origin?.focus();
        }
      }
    };
    const outside = (event: PointerEvent) => {
      if (
        !(event.target instanceof Node) ||
        card.current?.contains(event.target) ||
        [...triggers.current.values()].some((b) => b.contains(event.target as Node))
      )
        return;
      close();
    };
    document.addEventListener('keydown', key);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', key);
      document.removeEventListener('pointerdown', outside);
    };
  }, [opened]);
  useLayoutEffect(() => {
    if (!opened) return;
    const place = () => {
      const origin = triggers.current.get(opened)?.getBoundingClientRect(),
        panel = card.current?.getBoundingClientRect();
      if (!origin || !panel) return;
      const left = Math.max(
        8,
        Math.min(origin.left + origin.width / 2 - panel.width / 2, innerWidth - panel.width - 8),
      );
      const top =
        origin.bottom + 8 + panel.height <= innerHeight - 8
          ? origin.bottom + 8
          : Math.max(8, origin.top - panel.height - 8);
      setPosition({ left, top });
    };
    place();
    const observer = new ResizeObserver(place);
    if (card.current) observer.observe(card.current);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [opened, language]);
  const unit = units.find((u) => u.id === opened);
  const synergies = run ? activeSynergies(run.members.map((m) => m.unit)) : [];
  const numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  const loadout = game.team?.loadouts.find((l) => l.copyId === unit?.id);
  const historic =
    run?.status !== 'active' ? run?.members.find((m) => m.unit.id === unit?.id)?.unit : null;
  const gear = historic
    ? []
    : (game.inventory.equipment ?? []).filter(
        (e) => e.id === loadout?.wandId || e.id === loadout?.broomId,
      );
  return (
    <section ref={partyRoot} className="team team-compact" aria-label={text(language, 'yourTeam')}>
      <h2 className="visually-hidden">
        {text(language, run && run.status !== 'active' ? 'lastExpeditionTeam' : 'yourTeam')}
      </h2>
      {!units.length && <p>{text(language, 'noTeamSelected')}</p>}
      {units.map((member) => (
        <div className="team-unit" key={member.id}>
          <button
            className="team-token"
            data-team-member={member.id}
            ref={(element) => {
              if (element) triggers.current.set(member.id, element);
              else triggers.current.delete(member.id);
            }}
            aria-label={member.name}
            aria-describedby={member.affinity ? `${panelId}-affinity-${member.id}` : undefined}
            aria-haspopup="dialog"
            aria-expanded={opened === member.id}
            aria-controls={opened === member.id ? panelId : undefined}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') inspect(member.id);
            }}
            onPointerLeave={leave}
            onFocus={() => {
              if (suppressFocus.current === member.id) suppressFocus.current = null;
              else inspect(member.id);
            }}
            onBlur={(event) => {
              if (!card.current?.contains(event.relatedTarget)) leave();
            }}
            onClick={(event) => {
              clearDelay();
              if (opened === member.id && pinned.current) close();
              else {
                pinned.current = true;
                setOpened(member.id);
                if (event.detail === 0) requestAnimationFrame(() => card.current?.focus());
              }
            }}
          >
            <Artwork
              asset={`character.${member.wizardId}.thumbnail`}
              language={language}
              className="team-portrait"
              decorative
            />
            {member.affinity && (
              <AffinityLabel
                id={`${panelId}-affinity-${member.id}`}
                affinity={member.affinity}
                language={language}
              />
            )}
            <small className="team-source">
              <Artwork
                asset={member.temporary ? 'ui.temporary' : 'ui.owned'}
                language={language}
                decorative
              />
              <span className="visually-hidden">
                {text(language, member.temporary ? 'temporaryTeamMember' : 'ownedTeamMember')}
              </span>
            </small>
            <meter
              min={0}
              max={member.maxHp}
              value={member.hp}
              aria-label={text(language, 'healthOf', { name: member.name })}
            />
            <span className="team-art-fallback">{member.name}</span>
          </button>
        </div>
      ))}
      {unit &&
        createPortal(
          <div
            id={panelId}
            ref={card}
            role="dialog"
            data-inspected-unit={unit.id}
            aria-label={unit.name}
            className="team-inspector"
            tabIndex={-1}
            style={position}
            onPointerEnter={clearDelay}
            onPointerLeave={leave}
            onFocus={clearDelay}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) leave();
            }}
          >
            <button
              className="inspector-close"
              aria-label={text(language, 'close')}
              onClick={() => {
                close();
                suppressFocus.current = unit.id;
                triggers.current.get(unit.id)?.focus();
              }}
            >
              ×
            </button>
            <Artwork
              asset={`character.${unit.wizardId}.portrait`}
              language={language}
              className="inspector-portrait"
              decorative
            />
            <h3>{unit.name}</h3>
            {unit.affinity && <AffinityLabel affinity={unit.affinity} language={language} />}
            <TraitBadge
              traits={content?.catalog.wizards.find((w) => w.id === unit.wizardId)?.traits}
              language={language}
            />
            <p className="inspector-source">
              {text(language, unit.temporary ? 'temporaryTeamMember' : 'ownedTeamMember')}
            </p>
            <dl className="inspector-stats">
              <div>
                <dt>{text(language, 'hP')}</dt>
                <dd>
                  {numbers.format(unit.hp)} / {numbers.format(unit.maxHp)}
                </dd>
              </div>
              <div>
                <dt>{text(language, 'mP')}</dt>
                <dd>
                  {numbers.format(unit.mana)} / {numbers.format(unit.maxMana)}
                </dd>
              </div>
              <div>
                <dt>{text(language, 'power')}</dt>
                <dd>{numbers.format(unit.power)}</dd>
              </div>
              <div>
                <dt>{text(language, 'speed')}</dt>
                <dd>{numbers.format(unit.speed)}</dd>
              </div>
            </dl>
            {gear.map((e) => (
              <p className="inspector-gear" key={e.id}>
                <Artwork
                  asset={e.kind === 'wand' ? `product.wand-${e.wood}` : `product.broom-${e.model}`}
                  language={language}
                  decorative
                />
                {equipmentName(e, language)}
              </p>
            ))}
            {historic && (
              <p>
                {text(language, 'wandBonus', {
                  value: numbers.format(historic.wandPowerBonus),
                  multiplier: numbers.format(historic.wandMultiplier),
                })}{' '}
                ·{' '}
                {text(language, 'broomBonus', { value: numbers.format(historic.broomInitiative) })}
              </p>
            )}
            {run?.status === 'active' && (
              <p className="inspector-synergies">
                {text(language, 'activeSynergies')}:{' '}
                {synergies.length
                  ? synergies
                      .map(
                        (s) =>
                          `${text(language, s.affinity)} ${s.threshold === 3 ? 'III' : s.threshold === 2 ? 'II' : 'I'}`,
                      )
                      .join(' · ')
                  : text(language, 'noActiveSynergies')}
              </p>
            )}
          </div>,
          document.body,
        )}
      {onPrepare && (
        <button
          className="team-prepare game-object"
          onClick={(event) => onPrepare(event.currentTarget)}
          aria-label={prepText(language, 'preparation')}
          title={prepText(language, 'preparation')}
        >
          <Artwork asset="ui.map" language={language} decorative />
          <span className="visually-hidden">{prepText(language, 'preparation')}</span>
        </button>
      )}
      {run?.status === 'active' && content && (
        <BondBand
          units={run.members.map((m) => ({ ...m.unit, source: m.source }))}
          mode={run.bondFocus}
          rules={effectivePreparationRules(run, content.combatRules)}
          language={language}
        />
      )}
    </section>
  );
}
