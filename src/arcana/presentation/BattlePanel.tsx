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
  game: GameState;
  content: PublicContent | null;
  language: Language;
  reduced: boolean;
  onBack: () => void;
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
}: BattlePanelProps & { replay: BattleReplay }) {
  const total = combat.events.length,
    playback = useBattlePlayback(combat.events, activePack.animations.arena.eventMs, reduced),
    { cursor, playing, speed, setPlaying, setSpeed } = playback,
    frame = useMemo(() => replay.frame(cursor), [replay, cursor]);
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
    savedNode?.kind === 'advance-node' &&
    savedNode.run.graph.nodes.find((n) => n.id === savedNode.request.nodeId)?.kind === 'boss';
  const figureKey = (
    unit: Combat['input']['player'][number],
    side: 'player' | 'rival',
    index: number,
  ) =>
    unit.wizardId === 'rival' && side === 'rival'
      ? isBoss && index === activePack.arenaAppearances.bossPosition
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
          isBoss &&
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
    >
      <header className="arena-heading">
        <button
          className="arena-exit"
          onClick={onBack}
          aria-label={t('backToMap')}
          title={t('backToMap')}
        >
          <span aria-hidden="true">←</span>
        </button>
        <h2>{t('combatArena')}</h2>
        <span className="arena-round">
          {arenaText(language, 'round')} {format.format(frame.round)}
        </span>
      </header>
      <div className="arena-playback-tools">
        <div className="replay-controls" role="group" aria-label={arenaText(language, 'controls')}>
          <button
            disabled={reduced || cursor === total}
            aria-pressed={!playing}
            onClick={() => setPlaying(false)}
          >
            <span aria-hidden="true">Ⅱ</span> {t('pause')}
          </button>
          <button
            disabled={reduced || cursor === total}
            aria-pressed={playing}
            onClick={() => setPlaying(true)}
          >
            <span aria-hidden="true">▷</span> {t('autoPlayback')}
          </button>
          <button
            disabled={reduced || cursor === total}
            aria-pressed={speed === 2}
            onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
          >
            {t('doubleSpeed')}
          </button>
          <button
            disabled={cursor === total}
            aria-label={t('skipPlayback')}
            title={t('skipPlayback')}
            onClick={() => {
              setPlaying(false);
              playback.skip();
            }}
          >
            <span aria-hidden="true">▸▸|</span>
            <span className="visually-hidden">{t('skipPlayback')}</span>
          </button>
        </div>
        <button
          className="arena-record-trigger"
          aria-label={t('battleRecord')}
          title={t('battleRecord')}
          onClick={(event) => inspect('record', event.currentTarget)}
        >
          <Artwork asset="ui.collection" language={language} decorative />
          <span className="visually-hidden">{t('battleRecord')}</span>
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
          }}
          language={language}
        />
        {confirmedPresentation && cursor === total && combat.outcome === 'player' && (
          <Celebration receiptId={combat.id} reduced={reduced} />
        )}
        <div className="arena-columns">
          {(['player', 'rival'] as const).map((side) => (
            <div key={side} className="arena-team" role="region" aria-label={sideName(side)}>
              <h3>{sideName(side)}</h3>
              <div
                className="arena-fighters"
                style={
                  { '--arena-side-count': frame[side].length } as import('react').CSSProperties
                }
              >
                {frame[side].map((unit, index) => {
                  const acting = next && 'actorId' in next && next.actorId === unit.id;
                  const targeted = next?.kind === 'spell-cast' && next.targetId === unit.id;
                  const delta = deltaFor(unit.id);
                  return (
                    <article
                      className="pedestal"
                      key={unit.id}
                      data-unit={unit.id}
                      data-acting={acting || undefined}
                      data-target={targeted || undefined}
                      data-fallen={unit.hp === 0 || undefined}
                      aria-label={name(unit.id)}
                    >
                      <button
                        className="arena-inspect"
                        aria-label={`${arenaText(language, 'inspect')}: ${name(unit.id)}`}
                        onClick={(event) => inspect(unit.id, event.currentTarget)}
                      >
                        <span className="arena-figure-space">
                          <Artwork
                            asset={appearances[unit.id]}
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
                        <strong>{baseName(unit.id)}</strong>
                        <small className="arena-position" aria-hidden="true">
                          {index + 1}
                        </small>
                        <span className="arena-health">
                          <meter
                            min={0}
                            max={unit.maxHp}
                            value={unit.hp}
                            aria-label={t('healthOf', { name: name(unit.id) })}
                          />
                          <span>
                            {format.format(unit.hp)}
                            <span className="visually-hidden">
                              {' '}
                              / {format.format(unit.maxHp)} {t('hP')}
                            </span>
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
            <button onClick={onBack}>{arenaText(language, 'continue')}</button>
          </>
        ) : (
          <p>{frame.event ? description(frame.event) : arenaText(language, 'saved')}</p>
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
          aria-label={inspection === 'record' ? t('battleRecord') : name(inspection)}
          onCancel={(event) => {
            event.stopPropagation();
            setInspection(null);
          }}
        >
          <button
            className="arena-inspector-close"
            onClick={() => setInspection(null)}
            aria-label={t('close')}
          >
            ×
          </button>
          {selectedUnit ? (
            <>
              <Artwork
                asset={appearances[selectedUnit.id]}
                language={language}
                decorative
                className="arena-inspector-portrait"
              />
              <h2>{baseName(selectedUnit.id)}</h2>
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
