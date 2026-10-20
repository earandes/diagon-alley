// A92 declared component fixtures. No real account, earned inventory, server or balance claim.
import { useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { ShopBook } from '../../src/arcana/presentation/ShopBook';
import { SeasonalEvent } from '../../src/arcana/presentation/SeasonalEvent';
import { seasonalEdition } from '../../src/arcana/infrastructure/content/seasonal-content';
import { CollectionPanel } from '../../src/arcana/presentation/CollectionPanel';
import { BeanAssignments } from '../../src/arcana/presentation/BeanAssignments';
import { visualAsset } from '../../src/arcana/presentation/content-packs/art';
import { ReadingScope } from '../../src/arcana/presentation/ReadingPreferences';
import {
  activePack,
  setContentPack,
  regionAppearance,
} from '../../src/arcana/presentation/content-packs/active';
import { createPriorityFixtureState } from '../browser-priorities/fixture-state';
import type { BeanAssignment } from '../../src/arcana/application/run-contracts';
import type { Language } from '../../src/arcana/domain/collection/wizards';
import type { GameState } from '../../src/arcana/application/game';
import '../../src/arcana/presentation/styles.css';
import '../../src/arcana/presentation/game-stage.css';
import '../../src/arcana/presentation/game-experience.css';

const query = new URLSearchParams(location.search);
const language: Language = query.get('lang') === 'en' ? 'en' : 'es';
setContentPack(query.get('pack') === 'arcana' ? 'arcana' : 'diagon-alley');
const fixture = createPriorityFixtureState(new URLSearchParams('view=beans&temporary&empty'));
const count = Math.min(100, Math.max(0, Number(query.get('stock') ?? '100')));
const catalog = fixture.content.catalog;
const copies = Array.from({ length: 35 }, (_, i) => ({
  copyId: `a92-copy-${i}`,
  sourceId: `a92-declared-source-${i}`,
  catalogVersion: catalog.version,
  origin: 'toad' as const,
  wizard: {
    ...catalog.wizards[i % 3],
    ...(i === 0 ? { finish: { id: 'enchanted' as const, version: 1 as const } } : {}),
  },
}));
const archived = {
  ...copies[0],
  copyId: 'a92-archive-copy',
  wizard: {
    ...copies[0].wizard,
    id: 'a92-archived',
    name: { es: 'Maga del archivo', en: 'Archived witch' },
  },
};
const initial: GameState = {
  ...fixture.initial,
  copies: query.get('view') === 'beans' ? fixture.initial.copies : [...copies, archived],
  inventory: {
    ...fixture.initial.inventory,
    products: Array.from({ length: count }, (_, i) => ({
      id: `a92-jar-${i}`,
      kind: 'random-beans' as const,
      status: 'available' as const,
    })),
  },
};

declare global {
  interface Window {
    __a92Supplies: { read(): string; invalidate(): void; selectStock(count: number): void };
  }
}
function Fixture() {
  const [game, setGame] = useState(initial);
  const [draft, setDraft] = useState<readonly BeanAssignment[]>([]);
  const pack = activePack;
  const sceneUrl = visualAsset(regionAppearance(fixture.active.zoneId, language).mapAsset)?.url;
  if (!sceneUrl) throw Error('A92 collection fixture requires the real regional backdrop');
  window.__a92Supplies = {
    read: () => JSON.stringify({ game, draft }),
    invalidate: () =>
      setGame((state) => ({
        ...state,
        inventory: {
          ...state.inventory,
          products: state.inventory.products.filter((product) => product.id !== draft[0]?.beanId),
        },
      })),
    selectStock: (stock) =>
      setGame((state) => ({
        ...state,
        inventory: { ...state.inventory, products: initial.inventory.products.slice(0, stock) },
      })),
  };
  return (
    <ReadingScope owner={game.playerId}>
      <div
        className="arcana-shell game-shell"
        data-pack={pack.id}
        data-content-pack={pack.id}
        data-reduced="true"
        style={
          {
            ...Object.fromEntries(
              Object.entries(pack.palette).map(([key, value]) => [
                `--pack-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
                value,
              ]),
            ),
            minHeight: '100vh',
            '--scene-url': `url("${sceneUrl}")`,
            '--control-frame': `url("${visualAsset('ui.frame')?.url ?? ''}")`,
          } as CSSProperties
        }
      >
        <div
          className="game-world-backdrop"
          style={{ '--scene-url': `url("${sceneUrl}")` } as CSSProperties}
        />
        <main style={{ maxWidth: 1000, margin: 'auto', padding: 12 }}>
          {query.get('view') === 'books' ? (
            <>
              <ShopBook
                language={language}
                label={language === 'es' ? 'Libro de prueba' : 'Test book'}
                caption={language === 'es' ? 'Consultar libro' : 'Consult book'}
              >
                <p>{language === 'es' ? 'Solo consulta' : 'Read only'}</p>
              </ShopBook>
              <SeasonalEvent
                state={game}
                language={language}
                edition={seasonalEdition}
                serverTime={seasonalEdition.startsAt}
                reducedMotion
                error={query.get('error')}
                onAction={() => {
                  throw Error('A consultation must not send an operation');
                }}
                onPrepareRoute={() => {}}
                onRecover={() => {}}
              />
            </>
          ) : query.get('view') === 'beans' ? (
            <>
              <BeanAssignments
                game={game}
                content={fixture.content}
                run={fixture.active}
                language={language}
                ready
                assignments={draft}
                onChange={setDraft}
              />
              <button type="button" data-a92-cancel onClick={() => setDraft([])}>
                {language === 'es' ? 'Volver a la ruta' : 'Return to route'}
              </button>
            </>
          ) : (
            <CollectionPanel
              game={game}
              content={fixture.content}
              catalog={catalog}
              language={language}
            />
          )}
        </main>
      </div>
    </ReadingScope>
  );
}
document.documentElement.lang = language;
createRoot(document.getElementById('root')!).render(<Fixture />);
