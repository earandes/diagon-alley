// Visual fixture only: no inventory, purchases or production route imports this module.
import { useEffect, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { Artwork } from '../../src/arcana/presentation/Artwork';
import { GameSettings } from '../../src/arcana/presentation/GameSettings';
import { CardReveal } from '../../src/arcana/presentation/CardReveal';
import type { OpeningReceipt } from '../../src/arcana/application/game';
import { trialConfiguration } from '../../src/arcana/infrastructure/content/trial-configuration';
import {
  activePack,
  selectedContentPackId,
  subscribeContentPack,
  wizardName,
} from '../../src/arcana/presentation/content-packs/active';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
const opening = trialConfiguration().opening;

function Fixture() {
  useSyncExternalStore(subscribeContentPack, selectedContentPackId);
  const query = new URLSearchParams(location.search);
  const [language, setLanguage] = useState<'es' | 'en'>(query.get('lang') === 'en' ? 'en' : 'es');
  const [reduced, setReduced] = useState(false);
  const [showReveal, setShowReveal] = useState(Boolean(query.get('reveal')));
  const wizard = opening.catalog.wizards.find((entry) => entry.id === query.get('reveal'));
  const receipt: OpeningReceipt | null = wizard
    ? {
        id: `visual-fixture-${wizard.id}`,
        kind: 'open-toad',
        request: {
          unitId: 'visual-fixture-unit',
          catalogVersion: opening.catalog.version,
          tableVersion: opening.table.version,
        },
        wizard,
        copyId: 'visual-fixture-copy',
        isNew: true,
      }
    : null;
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return (
    <div
      className="arcana-shell game-shell art-fixture"
      data-content-pack={activePack.id}
      style={{ display: 'block' }}
    >
      <style>{`
        .art-fixture { color:#fff0d0; background:#101b2c; }
        .art-fixture > .fixture-background { position:fixed; inset:0; width:100%; height:100%; object-fit:cover; opacity:.2; pointer-events:none; }
        .art-fixture > header, .art-fixture > main { position:relative; }
        .art-fixture > main { width:100%; max-width:none; padding:24px; }
        .art-family-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:20px; }
        .art-family-grid > figure { margin:0; padding:10px; background:#101a30ee; border:1px solid #b08c4f; }
        .art-family-grid .fixture-portrait { width:100%; height:auto; aspect-ratio:4/5; object-fit:cover; }
        .art-family-grid figcaption { font-family:Cinzel,Georgia,serif; margin:8px 0; }
        .fixture-variants { display:flex; align-items:end; justify-content:center; gap:12px; }
        .fixture-figure { width:60%; height:150px; object-fit:contain; }
        .fixture-thumbnail { width:60px; height:75px; object-fit:contain; }
        .art-fixture .reveal::after { content:'Fixture visual · no recompensa / not a reward'; position:fixed; bottom:8px; left:0; width:100%; text-align:center; font:11px system-ui; opacity:.7; pointer-events:none; }
        @media(max-width:700px) { .art-family-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; } .art-fixture > main { padding:12px; } }
      `}</style>
      <Artwork
        asset="scene.boulevard"
        language={language}
        decorative
        className="fixture-background"
      />
      <header className="game-header">
        <h1>
          {activePack.brand} · {language === 'es' ? 'Fixture visual' : 'Visual fixture'}
        </h1>
        <GameSettings
          language={language}
          onLanguage={setLanguage}
          reduced={reduced}
          ownReduced={reduced}
          onReduced={setReduced}
        />
      </header>
      <main>
        <p>
          {language === 'es'
            ? 'Muestra técnica de arte; no representa una colección conseguida.'
            : 'Technical art fixture; this is not an earned collection.'}
        </p>
        <div className="art-family-grid">
          {opening.catalog.wizards.map((wizard) => (
            <figure key={wizard.id} data-character={wizard.id}>
              <Artwork
                asset={`character.${wizard.id}.portrait`}
                language={language}
                eager
                className="fixture-portrait"
              />
              <figcaption>{wizardName(wizard, language)}</figcaption>
              <div className="fixture-variants">
                <Artwork
                  asset={`character.${wizard.id}.figure`}
                  language={language}
                  eager
                  className="fixture-figure"
                />
                <Artwork
                  asset={`character.${wizard.id}.thumbnail`}
                  language={language}
                  eager
                  className="fixture-thumbnail"
                />
              </div>
            </figure>
          ))}
        </div>
      </main>
      {showReveal && receipt && (
        <CardReveal
          receipt={receipt}
          language={language}
          reduced={query.get('motion') !== 'normal'}
          onLanguage={setLanguage}
          onClose={() => setShowReveal(false)}
        />
      )}
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Fixture />);
