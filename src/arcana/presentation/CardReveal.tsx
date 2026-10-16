import { useEffect, useRef, useState } from 'react';
import { activePack, wizardName } from './content-packs/active';
import { Artwork } from './Artwork';
import { FrogMagic } from './FrogMagic';
import { GameSettings } from './GameSettings';
import { useReducedMotion } from './useReducedMotion';
import { Celebration } from './Celebration';
import { StarRating } from './StarRating';
import { RarityBadge } from './RarityBadge';
import type { ToadOpeningReceipt } from '../application/game';
import type { Language } from '../domain/collection/wizards';
import { text } from './translations';
import './reveal-finale.css';
import './reveal-theatre.css';
import { RevealTheatre } from './RevealTheatre';
const revealedMagic = new Set<string>();
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
  const motion = useReducedMotion();
  const announced = useRef(new Set<string>());
  const [announcement, setAnnouncement] = useState<{ language: Language; value: string } | null>(
    null,
  );
  useEffect(() => {
    if (announced.current.has(receipt.id)) return;
    announced.current.add(receipt.id);
    setAnnouncement({
      language,
      value: text(language, receipt.isNew ? 'newDiscovery' : 'newCopy'),
    });
  }, [receipt.id, language]);
  const stage = useRef<HTMLDivElement>(null),
    region = useRef<HTMLDialogElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const current = region.current;
    const origin = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (current && !current.open) current.showModal();
    heading.current?.focus({ preventScroll: true });
    return () => {
      if (current?.open) current.close();
      origin?.focus({ preventScroll: true });
    };
  }, [receipt.id]);
  const [omitted, setOmitted] = useState(false),
    [finished, setFinished] = useState(reduced),
    [magic, setMagic] = useState(false);
  useEffect(() => {
    if (reduced || omitted) {
      revealedMagic.add(receipt.id);
      setMagic(false);
    }
  }, [reduced, omitted, receipt.id]);
  useEffect(() => {
    if (finished) return;
    if (reduced || omitted) {
      setFinished(true);
      return;
    }
    let cancelled = false;
    let animation: { revert: () => void } | null = null;
    void import('gsap')
      .then(({ gsap }) => {
        if (cancelled || !stage.current) return;
        const timings = activePack.animations.opening;
        animation = gsap.context(() => {
          const timeline = gsap.timeline({
            onComplete: () => {
              if (!cancelled) {
                if (!revealedMagic.has(receipt.id)) {
                  revealedMagic.add(receipt.id);
                  setMagic(true);
                }
                setFinished(true);
              }
            },
          });
          // A cosmetic sequence over an already committed receipt: anticipation, escape,
          // then the card takes the stage. Skip/reduced never send another command.
          timeline.fromTo(
            '.opening-closed',
            { y: 0, rotation: -2 },
            {
              y: -7,
              rotation: 2,
              duration: 0.18,
              repeat: 3,
              yoyo: true,
              ease: 'sine.inOut',
            },
            0,
          );
          timeline.fromTo(
            '.opening-ring',
            { opacity: 0, scale: 0.3 },
            {
              opacity: 0.75,
              scale: 1.2,
              duration: 0.7,
              ease: 'power2.out',
            },
            0.4,
          );
          timeline.to(
            '.opening-seal',
            { scale: 1.35, y: -30, opacity: 0, duration: timings.sealMs / 1000 },
            0.55,
          );
          timeline.to('.opening-closed', { opacity: 0, duration: 0.15 }, 0.8);
          timeline.fromTo('.opening-base', { opacity: 0 }, { opacity: 1, duration: 0.18 }, 0.8);
          timeline.fromTo(
            '.opening-lid',
            { opacity: 1, y: 0, rotation: 0 },
            {
              y: -180,
              x: 75,
              rotation: 26,
              opacity: 0,
              duration: timings.lidMs / 1000,
              ease: 'power2.in',
            },
            0.85,
          );
          timeline.fromTo(
            '.opening-subject',
            { opacity: 0, y: 55, scaleX: 1.15, scaleY: 0.65 },
            {
              opacity: 1,
              y: -100,
              scaleX: 1,
              scaleY: 1,
              duration: timings.subjectMs / 1000,
              ease: 'back.out(1.3)',
            },
            1.1,
          );
          timeline.to(
            '.opening-subject',
            { y: 10, scaleY: 0.78, scaleX: 1.15, duration: 0.22, ease: 'power2.in' },
            1.8,
          );
          timeline.to(
            '.opening-subject',
            {
              opacity: 0,
              x: 240,
              y: -180,
              scaleY: 1.1,
              scaleX: 0.9,
              rotation: 18,
              duration: 0.55,
              ease: 'power2.out',
            },
            2.05,
          );
          timeline.to('.opening-base', { opacity: 0, y: 35, scale: 0.85, duration: 0.45 }, 2.1);
          timeline.fromTo(
            '.opening-card-back',
            { opacity: 0, y: 80, rotateY: 0, scale: 0.6 },
            { opacity: 1, y: 0, rotateY: 0, scale: 1, duration: 0.65, ease: 'power3.out' },
            2.15,
          );
          timeline.to(
            '.opening-card-back',
            { rotateY: 90, opacity: 0, duration: 0.45, ease: 'power2.in' },
            2.85,
          );
          timeline.fromTo(
            '.opening-card',
            { opacity: 0, y: 0, rotateY: -90, scale: 1 },
            {
              opacity: 1,
              y: 0,
              rotateY: 0,
              scale: 1,
              duration: timings.cardMs / 1000,
              ease: 'power2.out',
            },
            3.2,
          );
          timeline.to('.opening-ring', { opacity: 0.25, scale: 1.45, duration: 0.6 }, 3.2);
          timeline.fromTo('.opening-theatre', { opacity: 0 }, { opacity: 1, duration: 0.55 }, 3.1);
        }, stage);
      })
      .catch(() => {
        if (!cancelled) setFinished(true);
      });
    return () => {
      cancelled = true;
      animation?.revert();
    };
  }, [receipt.id, reduced, omitted, finished]);
  const staticResult = finished || reduced || omitted;
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
      data-reveal-magic={magic && !reduced && !omitted ? 'cast' : 'still'}
    >
      {onLanguage && (
        <GameSettings
          language={language}
          onLanguage={onLanguage}
          reduced={reduced}
          ownReduced={motion.own}
          onReduced={motion.change}
        />
      )}
      <h2 ref={heading} tabIndex={-1} className="reveal-heading">
        {text(language, 'confirmedCard')}
      </h2>
      <div
        ref={stage}
        className={`opening-stage ${staticResult ? 'opening-finished' : ''}`}
        aria-hidden="true"
      >
        <div className="opening-ring"></div>
        <RevealTheatre rarity={receipt.wizard.rarity}>
          {finished && receipt.isNew && (
            <Celebration
              receiptId={receipt.id}
              reduced={reduced || omitted}
              rarity={receipt.wizard.rarity}
            />
          )}
        </RevealTheatre>
        <FrogMagic active={!staticResult} />
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
        {announcement?.value}
      </span>
      {!staticResult && (
        <button onClick={() => setOmitted(true)}>{text(language, 'skipReveal')}</button>
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
