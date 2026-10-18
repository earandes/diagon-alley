import type { ReactNode } from 'react';
import { usePlaybackSpeed } from './motion/PlaybackPreferences';
import { HouseInsignia, houseName, houseEffect } from './HouseInsignia';
import { sceneStart, sceneEnd } from './scenes/scene-diagnostics';
import { Artwork } from './Artwork';
import { activePack } from './content-packs/active';
import { Celebration } from './Celebration';
import { themedName } from './content-packs/active';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Combat, BattleEvent } from '../domain/combat/engine';
import type { GameState } from '../application/game';
import type { PublicContent } from '../application/public-content';
import type { Language } from '../domain/collection/wizards';
import { BattleReplay, type ReplayPassive } from '../application/client/battle-replay';
import type { ArenaPosition } from './scenes/pixi-scenes';
import { SceneCanvas } from './scenes/SceneCanvas';
import { text, type MessageKey } from './translations';
import { arenaText } from './arena-messages';
import './arena-a63.css';
import { useBattlePlayback } from './motion/useBattlePlayback';
import { battleVisualChanges } from './motion/battle-deltas';
import { bossPresentation } from './boss-presentation';
import './boss-a70.css';
import './arena-scene-a86.css';
import { useBattleAudio } from './audio/runtime';
const affinities = {
  neutral: 'neutral',
  alchemy: 'alchemy',
  fire: 'fire',
  shadows: 'shadows',
} as const;
const flavours = {
  mint: 'mintBean',
  pepper: 'pepperBean',
  earth: 'earthBean',
  soap: 'soapBean',
} as const;
interface BattlePanelProps {
  combat: Combat;
  confirmedPresentation?: boolean;
  /** Declared presentation fixtures only; the app derives this from its saved node. */
  bossEncounter?: boolean;
  game: GameState;
  content: PublicContent | null;
  language: Language;
  reduced: boolean;
  onBack: () => void;
  settings?: ReactNode;
  resources?: ReactNode;
}
export function BattlePanel(props: BattlePanelProps) {
  const replay = useMemo(() => {
    try {
      return new BattleReplay(props.combat);
    } catch {
      return null;
    }
  }, [props.combat]);
  if (!replay)
    return (
      <section className="battle-panel">
        <h2>{text(props.language, 'combatArena')}</h2>
        <p role="alert">{text(props.language, 'savedReplayUnavailable')}</p>
        <button onClick={props.onBack}>{text(props.language, 'backToMap')}</button>
      </section>
    );
  return <BattlePlayback key={props.combat.id} {...props} replay={replay} />;
}
function BattlePlayback({
  combat,
  game,
  content,
  language,
  reduced,
  onBack,
  replay,
  confirmedPresentation = false,
  bossEncounter,
  settings,
  resources,
}: BattlePanelProps & { replay: BattleReplay }) {
  const renderStarted = sceneStart();
  useLayoutEffect(() => sceneEnd('react-commit-wall', renderStarted));
  const total = combat.events.length,
    playback = useBattlePlayback(combat.events, activePack.animations.arena.eventMs, reduced),
    { cursor, playing, speed, setPlaying, setSpeed } = playback,
    frame = useMemo(() => replay.frame(cursor), [replay, cursor]);
  useBattleAudio(combat, playback);
  const [preferredSpeed, rememberSpeed] = usePlaybackSpeed();
  useEffect(() => setSpeed(preferredSpeed), [preferredSpeed]);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const pauseButton = useRef<HTMLButtonElement>(null);
  const outcomeAction = useRef<HTMLButtonElement>(null);
  const focusResult = useRef(false);
  useLayoutEffect(() => {
    if (frame.outcome && focusResult.current) {
      focusResult.current = false;
      outcomeAction.current?.focus({ preventScroll: true });
    }
  }, [frame.outcome]);
  const openOptions = () => {
    setPlaying(false);
    setOptionsOpen(true);
  };
  const resume = () => {
    setOptionsOpen(false);
    setPlaying(true);
    pauseButton.current?.focus();
  };
  const stage = useRef<HTMLDivElement>(null);
  const inspector = useRef<HTMLDialogElement>(null);
  const inspectionOrigin = useRef<HTMLButtonElement | null>(null);
  const [inspection, setInspection] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const announced = useRef(false);
  const [announcedLanguage, setAnnouncedLanguage] = useState(language);
  useEffect(() => {
    if (!frame.outcome || announced.current) return;
    announced.current = true;
    setAnnouncedLanguage(language);
    setAnnouncement(
      text(
        language,
        frame.outcome === 'player' ? 'victory' : frame.outcome === 'rival' ? 'defeat' : 'draw',
      ),
    );
  }, [frame.outcome, language]);
  useEffect(() => {
    if (!inspection || !inspector.current) return;
    const dialog = inspector.current;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      inspectionOrigin.current?.focus({ preventScroll: true });
    };
  }, [inspection]);
  const inspect = (id: string, origin: HTMLButtonElement) => {
    setPlaying(false);
    setOptionsOpen(false);
    inspectionOrigin.current = origin;
    setInspection(id);
  };
  const [positions, setPositions] = useState<readonly ArenaPosition[]>([]);
  useLayoutEffect(() => {
    const host = stage.current;
    if (!host) return;
    const measure = () => {
      const bounds = host.getBoundingClientRect();
      // Read all geometry after layout; the renderer never reads DOM geometry each frame.
      const next = [...host.querySelectorAll<HTMLElement>('[data-unit]')].map((element) => {
        const box = (element.querySelector('.arena-portrait') ?? element).getBoundingClientRect();
        return {
          id: element.dataset.unit!,
          x: box.left - bounds.left + box.width / 2,
          y: box.top - bounds.top + box.height / 2,
          figureHeight: box.height,
        };
      });
      setPositions((current) =>
        current.length === next.length &&
        next.every(
          (point, index) =>
            point.id === current[index].id &&
            Math.abs(point.x - current[index].x) < 0.5 &&
            Math.abs(point.y - current[index].y) < 0.5 &&
            Math.abs((point.figureHeight ?? 105) - (current[index].figureHeight ?? 105)) < 0.5,
        )
          ? current
          : next,
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    for (const element of host.querySelectorAll('[data-unit]')) observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, [combat.id, language]);
  const t = (key: MessageKey, values?: Record<string, string | number>) =>
      text(language, key, values),
    format = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  const savedNode = game.receipts.find(
    (r) => r.kind === 'advance-node' && r.battle?.id === combat.id,
  );
  const isBoss =
    bossEncounter ??
    (savedNode?.kind === 'advance-node' &&
      savedNode.run.graph.nodes.find((n) => n.id === savedNode.request.nodeId)?.kind === 'boss');
  const boss = isBoss ? bossPresentation(combat.input.rival, language) : undefined;
  // The generic boss skin belongs to the old all-neutral roster. In a named
  // formation it must not introduce a second, contradictory chief identity.
  const legacyBoss = boss?.unit.wizardId === 'rival';
  const figureKey = (
    unit: Combat['input']['player'][number],
    side: 'player' | 'rival',
    index: number,
  ) =>
    side === 'rival' && unit.id === boss?.unit.id
      ? boss.figure
      : unit.wizardId === 'rival' && side === 'rival'
        ? legacyBoss && index === activePack.arenaAppearances.bossPosition
          ? activePack.arenaAppearances.boss
          : activePack.arenaAppearances.rivals[index % activePack.arenaAppearances.rivals.length]
        : `character.${unit.wizardId}.figure`;
  const appearances = Object.fromEntries(
    (['player', 'rival'] as const).flatMap((side) =>
      combat.input[side].map((u, index) => [u.id, figureKey(u, side, index)]),
    ),
  );
  const baseName = (id: string) => {
    const u = [...combat.input.player, ...combat.input.rival].find((u) => u.id === id);
    return themedName(
      u?.wizardId,
      game.copies.find((c) => c.copyId === id)?.wizard.name[language] ??
        content?.catalog.wizards.find((w) => w.id === u?.wizardId)?.name[language] ??
        t(
          legacyBoss &&
            combat.input.rival.findIndex((r) => r.id === id) ===
              activePack.arenaAppearances.bossPosition
            ? 'zoneBoss'
            : 'arcaneRival',
        ),
      language,
    );
  };
  const sideName = (side: 'player' | 'rival') => t(side === 'player' ? 'yourTeam' : 'opponent');
  const name = (id: string) => {
    const side = combat.input.player.some((unit) => unit.id === id) ? 'player' : 'rival';
    const position = combat.input[side].findIndex((unit) => unit.id === id);
    return position < 0
      ? t('unknownCombatant')
      : t('combatantLabel', {
          side: sideName(side),
          position: format.format(position + 1),
          name: baseName(id),
        });
  };
  const passiveLabel = (passive: ReplayPassive) =>
    t(
      passive.affinity === 'alchemy'
        ? 'alchemyPassive'
        : passive.affinity === 'fire'
          ? 'firePassive'
          : 'shadowsPassive',
      {
        tier:
          ({ 1: 'I', 2: 'II', 3: 'III' } as Record<number, string>)[passive.tier] ??
          format.format(passive.tier),
        value: format.format(passive.value),
      },
    );
  const description = (event: BattleEvent) => {
    switch (event.kind) {
      case 'combat-started':
        return t('battleStarts');
      case 'house-activated':
        return `${sideName(event.team)} · ${houseName(event.house, language)} · ${houseEffect(event, language)}`;
      case 'synergy-activated':
        return t(
          new Intl.PluralRules(language).select(event.members) === 'one'
            ? 'teamSynergyEventOne'
            : 'teamSynergyEvent',
          {
            side: sideName(event.team),
            affinity: t(affinities[event.affinity]),
            count: format.format(event.members),
          },
        );
      case 'bean-activated':
        return t('beanEvent', { name: name(event.actorId), bean: t(flavours[event.flavour]) });
      case 'turn-started':
        return t('turnEvent', {
          name: name(event.actorId),
          initiative: format.format(event.initiative),
        });
      case 'mana-exhausted':
        return t('noManaEvent', { name: name(event.actorId) });
      case 'healed':
        if (event.source === 'house')
          return `${name(event.actorId)} · ${language === 'es' ? 'Casa' : 'House'} · +${format.format(event.amount)} ${t('hP')}`;
        if (event.source === 'equipment')
          return arenaText(language, 'equipmentHeal')
            .replace('{name}', name(event.actorId))
            .replace('{value}', format.format(event.amount));
        return t('healEvent', { name: name(event.actorId), value: format.format(event.amount) });
      case 'burn-tick':
        return t('burnEvent', { name: name(event.actorId), value: format.format(event.damage) });
      case 'spell-cast':
        return t(event.missed ? 'missEvent' : 'spellEvent', {
          name: name(event.actorId),
          target: name(event.targetId),
          value: format.format(event.damage),
        });
      case 'combat-finished':
        return t(
          event.outcome === 'player' ? 'victory' : event.outcome === 'rival' ? 'defeat' : 'draw',
        );
    }
  };
  const next = combat.events[cursor] ?? null;
  const houseEvents = combat.events.filter((e) => e.kind === 'house-activated');
  const selectedHouse = houseEvents.find((e) => inspection === `house:${e.team}:${e.house}`);
  const selectedUnit = [...frame.player, ...frame.rival].find((unit) => unit.id === inspection);
  const outcomeLabel = frame.outcome
    ? t(frame.outcome === 'player' ? 'victory' : frame.outcome === 'rival' ? 'defeat' : 'draw')
    : null;
  const changes = useMemo(
    () => battleVisualChanges(combat.events, cursor),
    [combat.events, cursor],
  );
  const deltaFor = (id: string): string | null => {
    if (reduced || cursor >= total) return null;
    const event = changes.get(id);
    if (event?.kind === 'spell-cast' && event.targetId === id)
      return event.missed ? '↷' : `−${format.format(event.damage)}`;
    if (event?.kind === 'healed' && event.actorId === id) return `+${format.format(event.amount)}`;
    if (event?.kind === 'burn-tick' && event.actorId === id)
      return `−${format.format(event.damage)}`;
    return null;
  };
  return (
    <section
      className="battle-panel arena-a63"
      data-replay-cursor={cursor}
      data-replay-total={total}
      data-replay-progress={playback.progress.toFixed(4)}
      data-replay-phase={playback.phase}
      data-replay-playing={playing && playback.visible}
      data-replay-speed={speed}
      data-boss-leader={boss?.unit.id}
    >
      <header className="arena-heading">
        <div className="arena-encounter-title">
          <h2 aria-label={t('combatArena')}>
            {arenaText(language, isBoss ? 'finalDuel' : 'duel')}
          </h2>
          <span className="arena-round">
            {frame.round > 0
              ? `${arenaText(language, 'round')} ${format.format(frame.round)}`
              : arenaText(language, 'ready')}
          </span>
        </div>
        <button
          ref={pauseButton}
          className="arena-pause"
          aria-label={t('pause')}
          title={t('pause')}
          aria-expanded={optionsOpen}
          aria-controls="arena-options"
          onClick={openOptions}
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M11 8v16M21 8v16" />
          </svg>
        </button>
      </header>
      <div
        className="arena-playback-tools"
        id="arena-options"
        hidden={!optionsOpen}
        role="region"
        aria-label={arenaText(language, 'options')}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !(event.target as Element).closest('dialog[open]')) {
            event.stopPropagation();
            setOptionsOpen(false);
            pauseButton.current?.focus();
          }
        }}
      >
        <h3>{arenaText(language, 'options')}</h3>
        <div className="replay-controls" role="group" aria-label={arenaText(language, 'controls')}>
          <button disabled={reduced || cursor === total} onClick={resume}>
            {arenaText(language, 'resume')}
          </button>
          <button
            disabled={reduced}
            aria-pressed={speed === 2}
            onClick={() => rememberSpeed(speed === 1 ? 2 : 1)}
          >
            {t('doubleSpeed')}
          </button>
          <button
            disabled={cursor === total}
            aria-label={t('skipPlayback')}
            onClick={() => {
              focusResult.current = true;
              setOptionsOpen(false);
              playback.skip();
            }}
          >
            {t('skipPlayback')}
          </button>
        </div>
        <button
          className="arena-record-trigger"
          onClick={(event) => inspect('record', event.currentTarget)}
        >
          <Artwork asset="ui.collection" language={language} decorative />
          {t('battleRecord')}
        </button>
        {resources && (
          <details className="battle-wallet">
            <summary>{arenaText(language, 'savedResources')}</summary>
            {resources}
          </details>
        )}
        {settings}
        <button className="arena-exit" onClick={onBack}>
          {t('backToMap')}
        </button>
        <button
          className="arena-options-close"
          onClick={() => {
            setOptionsOpen(false);
            pauseButton.current?.focus();
          }}
        >
          {t('close')}
        </button>
      </div>
      <div
        ref={stage}
        className="arena-stage"
        data-reduced={reduced}
        style={
          {
            '--arena-count': Math.max(frame.player.length, frame.rival.length),
            '--arena-entry': `${activePack.animations.arena.entryMs}ms`,
          } as import('react').CSSProperties
        }
      >
        <SceneCanvas
          onUnavailable={() => {
            setPlaying(false);
            playback.skip();
          }}
          data={{
            kind: 'arena',
            positions,
            appearances,
            frame,
            next,
            clock: playback.clock,
            playing: playing && playback.visible && !reduced && cursor < total,
            speed,
            boss: boss && { id: boss.unit.id, wizardId: boss.unit.wizardId },
            reduced,
          }}
          language={language}
        />
        {confirmedPresentation && cursor === total && combat.outcome === 'player' && (
          <Celebration receiptId={combat.id} reduced={reduced} />
        )}
        <div className="arena-columns">
          {(['player', 'rival'] as const).map((side) => (
            <div key={side} className="arena-team" role="region" aria-label={sideName(side)}>
              <div className="arena-team-heading">
                <h3>{sideName(side)}</h3>
                <div className="arena-houses" aria-label={arenaText(language, 'houses')}>
                  {houseEvents
                    .filter((e) => e.team === side)
                    .map((e) => (
                      <button
                        key={e.house}
                        className="arena-house"
                        data-house-passive={e.house}
                        aria-label={`${arenaText(language, 'houseInspect')}: ${houseName(e.house, language)} · ${e.members} · ${e.tier === 1 ? 'I' : 'II'}`}
                        onClick={(event) =>
                          inspect(`house:${side}:${e.house}`, event.currentTarget)
                        }
                      >
                        <HouseInsignia house={e.house} />
                        <small>{e.tier === 1 ? 'I' : 'II'}</small>
                      </button>
                    ))}
                </div>
              </div>
              <div
                className="arena-fighters"
                style={
                  { '--arena-side-count': frame[side].length } as import('react').CSSProperties
                }
              >
                {frame[side].map((unit) => {
                  const acting = next && 'actorId' in next && next.actorId === unit.id;
                  const targeted = next?.kind === 'spell-cast' && next.targetId === unit.id;
                  const delta = deltaFor(unit.id);
                  return (
                    <article
                      className="pedestal"
                      key={unit.id}
                      data-unit={unit.id}
                      data-boss-unit={unit.id === boss?.unit.id || undefined}
                      data-boss-actor={
                        (unit.id === boss?.unit.id && boss.figure === 'boss.circe.figure') ||
                        undefined
                      }
                      data-acting={acting || undefined}
                      data-target={targeted || undefined}
                      data-fallen={unit.hp === 0 || undefined}
                      data-in-danger={(unit.hp > 0 && unit.hp * 4 <= unit.maxHp) || undefined}
                      aria-label={name(unit.id)}
                    >
                      <button
                        className="arena-inspect"
                        aria-label={`${arenaText(language, 'inspect')}: ${name(unit.id)}`}
                        onClick={(event) => inspect(unit.id, event.currentTarget)}
                      >
                        <span className="arena-figure-space">
                          {(acting || targeted) && (
                            <span className="arena-action-mark">
                              {arenaText(language, acting ? 'actor' : 'target')}
                            </span>
                          )}

                          <Artwork
                            asset={appearances[unit.id]}
                            fallbackAsset={
                              unit.id === boss?.unit.id && unit.wizardId !== 'rival'
                                ? `character.${unit.wizardId}.figure`
                                : undefined
                            }
                            language={language}
                            className="arena-portrait"
                            decorative
                            eager
                          />
                          {delta && (
                            <span
                              key={changes.get(unit.id)?.sequence}
                              className="arena-delta"
                              data-delta-kind={delta.startsWith('+') ? 'heal' : 'damage'}
                              aria-hidden="true"
                            >
                              {delta}
                            </span>
                          )}
                          {unit.hp === 0 && (
                            <span className="arena-fallen-mark" aria-label={t('defeatedUnit')}>
                              ×
                            </span>
                          )}
                        </span>
                        <strong>
                          {unit.house && <HouseInsignia house={unit.house} />}
                          {baseName(unit.id)}
                        </strong>
                        <span className="arena-health">
                          {unit.hp > 0 && unit.hp * 4 <= unit.maxHp && (
                            <span
                              className="arena-danger"
                              role="img"
                              aria-label={arenaText(language, 'lowHealth')}
                            >
                              !
                            </span>
                          )}
                          <meter
                            min={0}
                            max={unit.maxHp}
                            value={unit.hp}
                            aria-label={t('healthOf', { name: name(unit.id) })}
                          />
                          <span>
                            {format.format(unit.hp)}
                            <span>/{format.format(unit.maxHp)}</span>
                          </span>
                        </span>
                      </button>
                    </article>
                  );
                })}
              </div>
              <p className="synergies" data-team-synergies={side}>
                {frame.synergies
                  .filter((passive) => passive.team === side)
                  .map((passive) => (
                    <span
                      key={passive.affinity}
                      title={passiveLabel(passive)}
                      aria-label={passiveLabel(passive)}
                    >
                      {t(affinities[passive.affinity])}{' '}
                      {({ 1: 'I', 2: 'II', 3: 'III' } as Record<number, string>)[passive.tier] ??
                        passive.tier}
                    </span>
                  ))}
              </p>
            </div>
          ))}
        </div>
      </div>
      <footer className="arena-caption">
        {outcomeLabel ? (
          <>
            <strong data-arena-outcome={frame.outcome}>{outcomeLabel}</strong>
            <button ref={outcomeAction} onClick={onBack}>
              {arenaText(language, 'continue')}
            </button>
          </>
        ) : (
          <p className="visually-hidden">{frame.event ? description(frame.event) : ''}</p>
        )}
      </footer>
      <span
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        lang={announcedLanguage}
      >
        {announcement}
      </span>
      {inspection && (
        <dialog
          ref={inspector}
          className="arena-inspector"
          aria-label={
            inspection === 'record'
              ? t('battleRecord')
              : selectedHouse
                ? houseName(selectedHouse.house, language)
                : name(inspection)
          }
          onCancel={(event) => {
            event.stopPropagation();
            setInspection(null);
            setOptionsOpen(Boolean(inspectionOrigin.current?.closest('#arena-options')));
          }}
        >
          <button
            className="arena-inspector-close"
            onClick={() => setInspection(null)}
            aria-label={t('close')}
          >
            ×
          </button>
          {selectedHouse ? (
            <>
              <HouseInsignia house={selectedHouse.house} />
              <h2>{houseName(selectedHouse.house, language)}</h2>
              <p>
                {sideName(selectedHouse.team)} · {selectedHouse.members} ·{' '}
                {selectedHouse.tier === 1 ? 'I' : 'II'}
              </p>
              <p>{houseEffect(selectedHouse, language)}</p>
              <ol>
                {selectedHouse.contributorIds.map((id) => (
                  <li key={id}>{name(id)}</li>
                ))}
              </ol>
            </>
          ) : selectedUnit ? (
            <>
              <Artwork
                asset={appearances[selectedUnit.id]}
                language={language}
                decorative
                className="arena-inspector-portrait"
              />
              <h2>{baseName(selectedUnit.id)}</h2>
              {selectedUnit.house && (
                <p className="trait-badge">
                  <HouseInsignia house={selectedUnit.house} />
                  {houseName(selectedUnit.house, language)}
                </p>
              )}
              {combat.events
                .slice(0, cursor)
                .filter((e) => e.kind === 'house-activated')
                .filter((e) => e.contributorIds.includes(selectedUnit.id))
                .map((e) => (
                  <p key={`house-${e.sequence}`} data-house-passive={e.house}>
                    {houseEffect(e, language)}
                  </p>
                ))}
              <p>{name(selectedUnit.id)}</p>
              <p>
                {t('unitAffinity', { affinity: t(affinities[selectedUnit.affinity]) })} ·{' '}
                {t('unitLevel', { level: format.format(selectedUnit.level) })}
              </p>
              <p>
                {t('hP')} {format.format(selectedUnit.hp)} / {format.format(selectedUnit.maxHp)} ·{' '}
                {t('mP')} {format.format(selectedUnit.mana)} / {format.format(selectedUnit.maxMana)}
              </p>
              <p>
                {t('wandBonus', {
                  value: format.format(selectedUnit.wandPowerBonus),
                  multiplier: format.format(selectedUnit.wandMultiplier),
                })}
              </p>
              <p>{t('broomBonus', { value: format.format(selectedUnit.broomInitiative) })}</p>
              {selectedUnit.bean && (
                <p>{t('recordedBean', { bean: t(flavours[selectedUnit.bean]) })}</p>
              )}
              {selectedUnit.passives.map((passive) => (
                <p key={passive.affinity} data-passive={passive.affinity}>
                  {passiveLabel(passive)}
                </p>
              ))}
            </>
          ) : (
            <>
              <h2>{t('battleRecord')}</h2>
              <p>{arenaText(language, 'savedHelp')}</p>
              <p>
                {t('replayProgress', {
                  round: format.format(frame.round),
                  current: format.format(cursor),
                  total: format.format(total),
                })}
              </p>
              <ol className="battle-log">
                {combat.events.slice(0, cursor).map((event) => (
                  <li key={event.sequence}>{description(event)}</li>
                ))}
              </ol>
            </>
          )}
        </dialog>
      )}
    </section>
  );
}
