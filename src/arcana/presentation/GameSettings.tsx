import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Artwork } from './Artwork';
import { contentPackOptions, selectedContentPackId, setContentPack } from './content-packs/active';
import type { Language } from '../domain/collection/wizards';
import { text } from './translations';
import './settings-case.css';
import { mapSettingsText } from './map-settings-messages';
import { PlaybackPreferences } from './motion/PlaybackPreferences';
import { AudioPreferences } from './audio/AudioPreferences';

export const AccountSettingsContext = createContext<ReactNode>(null);

/** Preferences stay local; account actions are provided by the session coordinator. */
export function GameSettings({
  language,
  onLanguage,
  reduced,
  ownReduced,
  systemReduced = false,
  onReduced,
  accountControl,
}: {
  language: Language;
  onLanguage: (language: Language) => void;
  reduced: boolean;
  ownReduced: boolean;
  systemReduced?: boolean;
  onReduced: (enabled: boolean) => void;
  accountControl?: ReactNode;
}) {
  const sharedAccountControl = useContext(AccountSettingsContext);
  const account = accountControl ?? sharedAccountControl;
  const [open, setOpen] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    return () => {
      if (element.open) element.close();
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <button
        ref={trigger}
        className="settings-trigger game-object"
        aria-label={text(language, 'gameSettings')}
        title={text(language, 'gameSettings')}
        onClick={() => setOpen(true)}
      >
        <Artwork asset="ui.settings" language={language} decorative />
        <span className="visually-hidden">{text(language, 'gameSettings')}</span>
      </button>
      {open && (
        <dialog
          ref={dialog}
          className="game-settings settings-case"
          aria-label={text(language, 'gameSettings')}
          onCancel={(event) => {
            event.stopPropagation();
            setOpen(false);
          }}
        >
          <button
            className="settings-close game-object"
            aria-label={text(language, 'close')}
            onClick={() => setOpen(false)}
          >
            <Artwork asset="ui.pass" language={language} decorative />
            <span className="visually-hidden">{text(language, 'close')}</span>
          </button>
          <header className="settings-case-heading">
            <Artwork asset="ui.settings" language={language} decorative />
            <h2>{text(language, 'gameSettings')}</h2>
          </header>
          {account && <section className="settings-account">{account}</section>}
          <fieldset className="settings-choices">
            <legend>{text(language, 'gameLanguage')}</legend>
            {(['es', 'en'] as const).map((value) => (
              <button
                key={value}
                aria-pressed={language === value}
                onClick={() => onLanguage(value)}
              >
                <span className="language-monogram" aria-hidden="true">
                  {value.toUpperCase()}
                </span>
                <span>{value === 'es' ? 'Español' : 'English'}</span>
                {language === value && <Artwork asset="ui.seal" language={language} decorative />}
              </button>
            ))}
          </fieldset>
          <fieldset className="settings-choices">
            <legend>{text(language, 'gameWorld')}</legend>
            {contentPackOptions.map((pack) => (
              <button
                key={pack.id}
                aria-pressed={selectedContentPackId() === pack.id}
                onClick={() => setContentPack(pack.id)}
              >
                <span className={`world-medallion world-medallion-${pack.id}`} aria-hidden="true">
                  {pack.id === 'diagon-alley' ? '✦' : '☽'}
                </span>
                <span>{pack.name[language]}</span>
                {selectedContentPackId() === pack.id && (
                  <Artwork asset="ui.seal" language={language} decorative />
                )}
              </button>
            ))}
          </fieldset>
          <PlaybackPreferences language={language} />
          <AudioPreferences language={language} />
          <MotionPreference
            language={language}
            reduced={reduced}
            ownReduced={ownReduced}
            systemReduced={systemReduced}
            onReduced={onReduced}
          />
          <button
            className="settings-save-letter"
            aria-expanded={showSave}
            onClick={() => setShowSave(!showSave)}
          >
            <Artwork asset="ui.missions" language={language} decorative />
            <span>{text(language, 'gameAboutSave')}</span>
          </button>
          {showSave && (
            <div className="settings-help">
              <p>{text(language, 'localTrialProvisionalBalanceAndArtSavedOn')}</p>
              <p>{text(language, 'gameWorldSwapHint')}</p>
              <p>{text(language, 'gameArtworkStatus')}</p>
            </div>
          )}
        </dialog>
      )}
    </>
  );
}

/** Own preference remains actionable even when the operating system enforces reduced motion. */
export function MotionPreference({
  language,
  reduced,
  ownReduced,
  systemReduced,
  onReduced,
}: {
  language: Language;
  reduced: boolean;
  ownReduced: boolean;
  systemReduced: boolean;
  onReduced: (enabled: boolean) => void;
}) {
  return (
    <>
      <button
        className="settings-motion"
        aria-pressed={ownReduced}
        aria-describedby="settings-motion-state"
        onClick={() => onReduced(!ownReduced)}
      >
        <Artwork asset="ui.motion" language={language} decorative />
        {mapSettingsText(language, 'motionOwn')}
        {ownReduced && <Artwork asset="ui.seal" language={language} decorative />}
      </button>
      <p
        id="settings-motion-state"
        className="settings-motion-state"
        data-motion-system={systemReduced}
        data-motion-effective={reduced}
      >
        {mapSettingsText(
          language,
          systemReduced ? 'motionSystem' : reduced ? 'motionEffectiveOn' : 'motionEffectiveOff',
        )}
      </p>
    </>
  );
}
