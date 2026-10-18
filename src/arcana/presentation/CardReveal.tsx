import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  activePack,
  wizardName,
  selectedContentPackId,
  subscribeContentPack,
} from './content-packs/active';
import { Artwork } from './Artwork';
import { FrogMagic } from './FrogMagic';
import { GameSettings } from './GameSettings';
import { useReducedMotion } from './useReducedMotion';
import { StarRating } from './StarRating';
import { RarityBadge } from './RarityBadge';
import type { ToadOpeningReceipt } from '../application/game';
import type { Language } from '../domain/collection/wizards';
import { text } from './translations';
import './reveal-finale.css';
import './reveal-theatre.css';
import { RevealTheatre } from './RevealTheatre';
import { claimVisualEvent, hasVisualEvent } from './visual-history';
import {
  openingMotionRecipe,
  type OpeningMotionRecipe,
  type OpeningPhase,
} from './opening-motion-model';

interface OpeningSession {
  id: string;
  packId: string;
  admitted: boolean;
  finished: boolean;
  elapsed: number;
  recipe: OpeningMotionRecipe;
}
interface OpeningView {
  id: string;
  finished: boolean;
  magic: boolean;
  paused: boolean;
  phase: OpeningPhase;
}
export function CardReveal({
  receipt,
  language,
  reduced,
  onCollection,
  onClose,
  onLanguage,
}: {
  receipt: ToadOpeningReceipt;
  language: Language;
  reduced: boolean;
  onCollection?: () => void;
  onClose?: () => void;
  onLanguage?: (language: Language) => void;
}) {
  const motion = useReducedMotion(),
    noMotion = reduced || motion.reduced;
  const packId = useSyncExternalStore(subscribeContentPack, selectedContentPackId);
  const session = useRef<OpeningSession | null>(null);
  const [omittedId, setOmittedId] = useState<string | null>(null);
  const [view, setView] = useState<OpeningView>(() => ({
    id: receipt.id,
    finished: noMotion || hasVisualEvent('opening', receipt.id),
    magic: false,
    paused: document.hidden,
    phase: 'anticipation',
  }));
  const [announcement, setAnnouncement] = useState<{
    id: string;
    language: Language;
    value: string;
  } | null>(null);
  const stage = useRef<HTMLDivElement>(null),
    region = useRef<HTMLDialogElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const omitted = omittedId === receipt.id;
  const finished =
    view.id === receipt.id ? view.finished : noMotion || hasVisualEvent('opening', receipt.id);
  const magic = view.id === receipt.id && view.magic;
  const staticResult = finished || noMotion || omitted;
  useEffect(() => {
    const current = region.current,
      origin = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (current && !current.open) current.showModal();
    heading.current?.focus({ preventScroll: true });
    return () => {
      if (current?.open) current.close();
      origin?.focus({ preventScroll: true });
    };
  }, [receipt.id]);
  useEffect(() => {
    if (!staticResult || !claimVisualEvent('opening-result', receipt.id)) return;
    setAnnouncement({
      id: receipt.id,
      language,
      value: text(language, receipt.isNew ? 'newDiscovery' : 'newCopy'),
    });
  }, [staticResult, receipt.id, language]);
  useEffect(() => {
    if (!session.current || session.current.id !== receipt.id) {
      const admitted = claimVisualEvent('opening', receipt.id);
      session.current = {
        id: receipt.id,
        packId,
        admitted,
        finished: !admitted || noMotion || omitted,
        elapsed: 0,
        recipe: openingMotionRecipe(
          activePack.animations.opening,
          receipt.wizard.rarity,
          receipt.isNew,
        ),
      };
    }
    const current = session.current;
    const finishStatic = () => {
      current.finished = true;
      setView({ id: receipt.id, finished: true, magic: false, paused: false, phase: 'finish' });
    };
    if (noMotion || omitted || current.packId !== packId || current.finished) {
      finishStatic();
      return;
    }
    let cancelled = false,
      context: gsap.Context | null = null,
      timeline: gsap.core.Timeline | null = null;
    const paused = () => {
      if (cancelled) return;
      const hidden = document.hidden;
      if (hidden) timeline?.pause();
      else timeline?.resume();
      setView((v) => (v.id === receipt.id ? { ...v, paused: hidden } : v));
    };
    setView({
      id: receipt.id,
      finished: false,
      magic: false,
      paused: document.hidden,
      phase: 'anticipation',
    });
    document.addEventListener('visibilitychange', paused);
    void import('gsap')
      .then(({ gsap }) => {
        if (cancelled || !stage.current) return;
        const recipe = current.recipe,
          l = recipe.labels,
          d = recipe.durations,
          at = (value: number) => value / 1000;
        const phase = (value: OpeningPhase) => {
          if (!cancelled)
            setView((v) => ({
              ...v,
              id: receipt.id,
              phase: value,
              magic: v.magic || value === 'reveal',
            }));
        };
        context = gsap.context(() => {
          timeline = gsap.timeline({
            paused: true,
            onUpdate: () => {
              if (timeline) current.elapsed = timeline.time() * 1000;
            },
            onComplete: () => {
              if (cancelled) return;
              current.finished = true;
              setView((v) => ({ ...v, id: receipt.id, finished: true, phase: 'finish' }));
            },
          });
          for (const [name, time] of Object.entries(l)) timeline.addLabel(name, at(time));
          timeline.fromTo(
            '.opening-closed',
            { y: 0, rotation: -1 },
            { y: -4, rotation: 1, duration: at(l.seal), ease: 'sine.inOut' },
            'anticipation',
          );
          timeline.to(
            '.opening-seal',
            { scale: 1.1, y: -14, opacity: 0, duration: at(d.seal), ease: 'power2.in' },
            'seal',
          );
          timeline.to('.opening-closed', { opacity: 0, duration: at(d.lid * 0.25) }, 'lid');
          timeline.fromTo(
            '.opening-base',
            { opacity: 0 },
            { opacity: 1, duration: at(d.lid * 0.25) },
            'lid',
          );
          timeline.fromTo(
            '.opening-lid',
            { opacity: 1, y: 0, rotation: 0, transformOrigin: '50% 70%' },
            { y: -110, x: 32, rotation: 18, opacity: 0, duration: at(d.lid), ease: 'power2.out' },
            'lid',
          );
          timeline.fromTo(
            '.opening-subject',
            { opacity: 0, y: 38, scaleX: 1.08, scaleY: 0.78 },
            { opacity: 1, y: -72, scaleX: 1, scaleY: 1, duration: at(d.hop), ease: 'power2.out' },
            'hop',
          );
          timeline.to(
            '.opening-subject',
            { y: 8, scaleY: 0.82, scaleX: 1.08, duration: at(d.settle), ease: 'power2.in' },
            'settle',
          );
          timeline.to(
            '.opening-subject',
            {
              opacity: 0,
              x: 150,
              y: -100,
              scaleY: 1.05,
              scaleX: 0.95,
              rotation: 12,
              duration: at(d.escape),
              ease: 'power2.out',
            },
            'escape',
          );
          timeline.to(
            '.opening-base',
            { opacity: 0, y: 20, scale: 0.94, duration: at(d.escape) },
            'escape',
          );
          timeline.fromTo(
            '.opening-card-back',
            { opacity: 0, y: 60, rotateY: 0, scale: 0.78 },
            { opacity: 1, y: 0, scale: 1, duration: at(d.card), ease: 'power3.out' },
            'card',
          );
          timeline.to(
            '.opening-card-back',
            { rotateY: 90, opacity: 0, duration: at(d.flip), ease: 'power2.in' },
            'flip',
          );
          timeline.fromTo(
            '.opening-card',
            { opacity: 0, y: 0, rotateY: -90, scale: 1 },
            { opacity: 1, rotateY: 0, duration: at(d.reveal), ease: 'power2.out' },
            'reveal',
          );
          timeline.fromTo(
            '.opening-theatre',
            { opacity: 0 },
            { opacity: recipe.intensity, duration: at(d.reveal), ease: 'power2.out' },
            'reveal',
          );
          timeline.fromTo(
            '.opening-ring',
            { opacity: 0, scale: 0.8 },
            { opacity: recipe.intensity * 0.5, scale: 1.2, duration: at(d.reveal) },
            'reveal',
          );
          for (const name of Object.keys(l) as OpeningPhase[])
            timeline.call(() => phase(name), [], name);
          // Keep the final settle in the same presentation clock, not a second timeout.
          timeline.to({ rest: 0 }, { rest: 1, duration: at(l.finish - l.resolve) }, 'resolve');
          timeline.time(at(current.elapsed), false);
          if (!document.hidden) timeline.resume();
        }, stage);
      })
      .catch(() => {
        if (!cancelled) finishStatic();
      });
    return () => {
      cancelled = true;
      if (timeline) current.elapsed = timeline.time() * 1000;
      timeline?.kill();
      context?.revert();
      document.removeEventListener('visibilitychange', paused);
    };
  }, [receipt.id, noMotion, omitted, packId]);
  const recipe =
    session.current?.id === receipt.id
      ? session.current.recipe
      : openingMotionRecipe(activePack.animations.opening, receipt.wizard.rarity, receipt.isNew);
  return (
    <dialog
      ref={region}
      className="reveal"
      aria-label={text(language, 'confirmedCard')}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      data-opening-state={staticResult ? 'result' : 'playing'}
      data-rarity={receipt.wizard.rarity}
      data-reveal-magic={magic && !noMotion && !omitted ? 'cast' : 'still'}
      data-opening-phase={view.phase}
      data-discovery={receipt.isNew ? 'new' : 'repeat'}
      data-paused={view.paused}
    >
      {onLanguage && (
        <GameSettings
          language={language}
          onLanguage={onLanguage}
          reduced={reduced}
          ownReduced={motion.own}
          systemReduced={motion.system}
          onReduced={motion.change}
        />
      )}
      <h2 ref={heading} tabIndex={-1} className="reveal-heading">
        {text(language, 'confirmedCard')}
      </h2>
      <div
        ref={stage}
        onErrorCapture={() => setOmittedId(receipt.id)}
        className={`opening-stage ${staticResult ? 'opening-finished' : ''}`}
        aria-hidden="true"
      >
        <div className="opening-ring"></div>
        <RevealTheatre rarity={receipt.wizard.rarity} isNew={receipt.isNew} />
        <FrogMagic
          active={magic && !noMotion && !omitted}
          paused={view.paused}
          durationMs={recipe.magicMs}
          count={recipe.sparkCount}
        />
        <div className="opening-base opening-piece">
          <Artwork asset="toad.base" language={language} decorative eager />
        </div>
        <div className="opening-lid opening-piece">
          <Artwork asset="toad.lid" language={language} decorative eager />
        </div>
        <div className="opening-closed opening-piece">
          <Artwork asset="toad.box" language={language} decorative eager />
        </div>
        <div className="opening-seal opening-piece">
          <Artwork asset="toad.seal" language={language} decorative eager />
        </div>
        <div className="opening-subject">
          <Artwork asset="toad.subject" language={language} decorative eager />
        </div>
        <div className="opening-card-back">
          <Artwork asset="card.back" language={language} decorative eager />
        </div>
        <div className="opening-card">
          <Artwork
            asset={`character.${receipt.wizard.id}.portrait`}
            language={language}
            className="opening-portrait"
            decorative
            eager
          />
          <Artwork
            asset="card.frame"
            language={language}
            className="opening-frame"
            decorative
            eager
          />
        </div>
      </div>
      <div className="holographic-card" hidden={!staticResult}>
        <h3>{wizardName(receipt.wizard, language)}</h3>
        <RarityBadge rarity={receipt.wizard.rarity} language={language} />
        <StarRating stars={receipt.wizard.stars} language={language} />
      </div>
      <p className="reveal-discovery" hidden={!staticResult}>
        {text(language, receipt.isNew ? 'newDiscovery' : 'newCopy')}
      </p>
      <span className="visually-hidden" role="status" lang={announcement?.language}>
        {announcement?.id === receipt.id ? announcement.value : undefined}
      </span>
      {!staticResult && (
        <button onClick={() => setOmittedId(receipt.id)}>{text(language, 'skipReveal')}</button>
      )}
      <div className="reveal-actions">
        {onCollection && staticResult && (
          <button className="reveal-collect game-object" onClick={onCollection}>
            <Artwork asset="ui.collection" language={language} decorative />
            {text(language, 'viewInChromodex')}
          </button>
        )}
        {onClose && (
          <button className="reveal-continue game-object" onClick={onClose}>
            <Artwork asset="ui.map" language={language} decorative />
            {text(language, 'continuePlaying')}
          </button>
        )}
      </div>
    </dialog>
  );
}
