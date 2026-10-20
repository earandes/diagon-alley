import { GameSettings } from './GameSettings';
import { useReducedMotion } from './useReducedMotion';
import { VisualChoices } from './VisualChoices';
import { commerceOffers } from '../application/client/read-models';
import { EquipmentArt } from './EquipmentArt';
import { Artwork } from './Artwork';
import { useConfirmedMotion } from './useConfirmedMotion';
import './motion-a69.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { vaultGuidance } from '../application/client/vault-guidance';
import { progressVaultText } from './progress-vault-messages';
import type {
  CommerceCatalogs,
  ForgeWandRequest,
  OpenVaultRequest,
  WandRecipe,
  EquipmentBlueprint,
} from '../domain/economy/commerce';
import type { GameState, OperationReceipt } from '../application/game';
import type { ForgeReceipt, VaultReceipt } from '../application/commerce-contracts';
import type { Language } from '../domain/collection/wizards';
import { equipmentName } from './equipment-label';
import { text, type MessageKey } from './translations';
import { ShopBook, ShopExit } from './ShopBook';
import { shopText } from './shop-messages';
import './shop-journey.css';
import type { PublicContent } from '../application/public-content';
import { WandRecipeComparison } from './WandRecipeComparison';
type Quote =
  | { kind: 'forge'; recipe: WandRecipe; version: number; seen: string | null }
  | { kind: 'vault'; version: number; seen: string | null };
export function CommercePanel({
  mode,
  content,
  game,
  receipt,
  language,
  ready,
  pending,
  error,
  onForge,
  onVault,
  onRecover,
  connected,
  onPrepare,
  onLanguage,
  reduced = false,
  onStreet,
  onMap,
  preparationContent,
}: {
  mode: 'workshop' | 'vault';
  content: CommerceCatalogs;
  game: GameState;
  receipt: OperationReceipt | null;
  language: Language;
  ready: boolean;
  pending: boolean;
  error: string | null;
  onForge: (request: ForgeWandRequest) => void;
  onVault: (request: OpenVaultRequest) => void;
  onRecover: () => void;
  connected: boolean;
  onPrepare: (origin: HTMLElement) => void;
  onLanguage: (language: Language) => void;
  reduced?: boolean;
  onStreet?: () => void;
  onMap?: () => void;
  preparationContent?: PublicContent;
}) {
  const [wood, setWood] = useState(content.forge.recipes[0].wood),
    [core, setCore] = useState(content.forge.recipes[0].core),
    [quote, setQuote] = useState<Quote | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    origin = useRef<HTMLButtonElement | null>(null),
    resultRegion = useRef<HTMLElement>(null),
    resultHeading = useRef<HTMLHeadingElement>(null),
    committed = useRef(false);
  const motion = useReducedMotion();
  const t = (key: MessageKey, values?: Record<string, string | number>) =>
      text(language, key, values),
    numbers = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US');
  const result = useMemo(() => {
    const kind = mode === 'workshop' ? 'forge-wand' : 'open-vault';
    if (receipt?.kind === kind) return receipt as ForgeReceipt | VaultReceipt;
    for (let index = game.receipts.length - 1; index >= 0; index--) {
      const candidate = game.receipts[index];
      if (candidate.kind === kind) return candidate as ForgeReceipt | VaultReceipt;
    }
    return null;
  }, [receipt, game.receipts, mode]);
  const guidance = useMemo(
    () => vaultGuidance(game, preparationContent, result?.kind === 'open-vault'),
    [game, preparationContent, result?.kind],
  );
  const vaultReturn =
    guidance.status === 'source'
      ? 'findSource'
      : game.exploration?.run?.status === 'active'
        ? 'continueRoute'
        : 'plan';
  const resultMotion = useConfirmedMotion(
    'commerce-result',
    result?.id,
    !!result && receipt?.id === result.id && !pending && !error,
    reduced || motion.reduced,
    400,
  );
  const offers = commerceOffers(game.inventory, content);
  const offer = offers.recipes.find(({ recipe }) => recipe.wood === wood && recipe.core === core),
    recipe = offer?.recipe;
  const blueprint = (recipe: WandRecipe): EquipmentBlueprint => ({
    kind: 'wand',
    wood: recipe.wood,
    core: recipe.core,
    powerBonus: recipe.powerBonus,
    multiplier: recipe.multiplier,
    ...(recipe.initiativeBonus === undefined ? {} : { initiativeBonus: recipe.initiativeBonus }),
    ...(recipe.healing === undefined ? {} : { healing: recipe.healing }),
  });
  const percent = new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  });
  const open = (value: Quote, button: HTMLButtonElement) => {
    origin.current = button;
    committed.current = false;
    setQuote(value);
  };
  useEffect(() => {
    if (!quote || !dialog.current) return;
    const current = dialog.current;
    current.showModal();
    return () => {
      if (current.open) current.close();
      if (committed.current) {
        resultRegion.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        resultHeading.current?.focus({ preventScroll: true });
      } else if (origin.current?.isConnected && !origin.current.disabled) origin.current.focus();
      else document.getElementById('content')?.focus({ preventScroll: true });
    };
  }, [quote]);
  useEffect(() => {
    if (quote && result && result.id !== quote.seen) {
      committed.current = true;
      setQuote(null);
    }
  }, [result?.id, quote]);
  return (
    <section
      className={`commerce-panel shop-interior shop-${mode}`}
      data-reduced={reduced || motion.reduced}
    >
      <div className="shop-interior-heading">
        <ShopExit language={language} onStreet={onStreet} />
        <h2>{t(mode === 'workshop' ? 'wandWorkshop' : 'obsidianVaults')}</h2>
      </div>
      {mode === 'workshop' ? (
        <>
          <div className="forge-materials">
            <VisualChoices
              label={t('wood')}
              value={wood}
              language={language}
              onChange={(value) => setWood(value as typeof wood)}
              options={[...new Set(content.forge.recipes.map((r) => r.wood))].map((id) => ({
                id,
                label: t(id),
                asset: `product.wand-${id}`,
              }))}
            />
            <VisualChoices
              label={t('core')}
              value={core}
              language={language}
              onChange={(value) => setCore(value as typeof core)}
              options={[...new Set(content.forge.recipes.map((r) => r.core))].map((id) => ({
                id,
                label: t(id),
                asset: `product.core-${id}`,
              }))}
            />
          </div>
          {recipe ? (
            <>
              <p className="recipe-name">
                {t(recipe.wood)} · {t(recipe.core)}
              </p>
              <WandRecipeComparison
                game={game}
                recipe={recipe}
                version={content.forge.version}
                language={language}
                content={preparationContent}
              >
                <button
                  data-primary-action
                  className="forge-action"
                  aria-label={t('forgeWandPrice', { value: numbers.format(recipe.crowns) })}
                  disabled={!ready || !offer?.affordable}
                  onClick={(e) =>
                    open(
                      {
                        kind: 'forge',
                        recipe,
                        version: content.forge.version,
                        seen: result?.id ?? null,
                      },
                      e.currentTarget,
                    )
                  }
                >
                  <EquipmentArt item={blueprint(recipe)} language={language} />
                  <span className="object-price">
                    <Artwork asset="currency.crowns" language={language} decorative />
                    <span>
                      {shopText(language, 'forge')} · {numbers.format(recipe.crowns)}
                    </span>
                  </span>
                </button>
              </WandRecipeComparison>
              {!offer?.affordable && <p>{t('notEnoughCrownsForRecipe')}</p>}
            </>
          ) : (
            <p>{t('recipeUnavailable')}</p>
          )}
        </>
      ) : (
        <>
          <p className="visually-hidden">{t('vaultHint')}</p>
          <div className="vault-door-stage" data-has-key={offers.canOpenVault}>
            <div className="vault-door-rim" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <button
              className="vault-lock-action game-object"
              data-primary-action
              aria-label={t('openVaultPrice')}
              aria-describedby={!offers.canOpenVault ? 'vault-key-hint' : undefined}
              disabled={!ready || !offers.canOpenVault}
              onClick={(e) =>
                open(
                  { kind: 'vault', version: content.vault.version, seen: result?.id ?? null },
                  e.currentTarget,
                )
              }
            >
              <span className="vault-lock-wheel" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <i />
              </span>
              <span className="vault-lock-keyhole" aria-hidden="true" />
              <span className="vault-action-label">
                {shopText(language, offers.canOpenVault ? 'keySlot' : 'vaultLocked')}
              </span>
              <span className="vault-key-price">
                <Artwork asset="product.gold-key" language={language} decorative />
                <span>1</span>
              </span>
            </button>
            <span
              className="vault-key-ring"
              role="img"
              aria-label={shopText(language, 'keysCount', {
                count: numbers.format(game.inventory.goldKeys ?? 0),
              })}
            >
              <Artwork asset="product.gold-key" language={language} decorative />
              <span>× {numbers.format(game.inventory.goldKeys ?? 0)}</span>
            </span>
          </div>
          {!offers.canOpenVault && (
            <div className="vault-next-goal">
              <p id="vault-key-hint">
                {progressVaultText(
                  language,
                  guidance.status === 'source'
                    ? guidance.source === 'boss'
                      ? 'source'
                      : 'routeSource'
                    : guidance.status === 'unknown'
                      ? 'unknown'
                      : guidance.opened
                        ? 'used'
                        : 'unavailable',
                )}
              </p>
              {onMap && (
                <button
                  type="button"
                  className="game-object vault-map-action"
                  aria-label={progressVaultText(language, vaultReturn)}
                  onClick={onMap}
                >
                  <Artwork asset="ui.map" language={language} decorative />
                  <span>{progressVaultText(language, vaultReturn)}</span>
                </button>
              )}
            </div>
          )}
        </>
      )}
      {result && (
        <section
          ref={resultRegion}
          className="notice commerce-result"
          data-confirmed-motion={resultMotion}
          aria-label={t('confirmedEquipmentResult')}
        >
          <h3 ref={resultHeading} tabIndex={-1}>
            {t(result.kind === 'forge-wand' ? 'confirmedWand' : 'confirmedVaultLoot')}
          </h3>
          {result.kind === 'forge-wand' ? (
            <>
              <EquipmentArt item={result.equipment} language={language} selectionMotion={false} />
              <p>{equipmentName(result.equipment, language)}</p>
            </>
          ) : (
            <>
              <Artwork
                asset="product.loot-chest"
                language={language}
                className="vault-loot-art"
                decorative
              />
              <div className="commerce-result-loot">
                <span
                  className="loot-currency"
                  aria-label={t('crownsReward', { count: numbers.format(result.reward.crowns) })}
                >
                  <Artwork asset="currency.crowns" language={language} decorative />
                  {numbers.format(result.reward.crowns)}
                </span>
                {result.reward.products.map((kind, index) => (
                  <span className="result-loot-product" key={index}>
                    <Artwork
                      asset={kind === 'cacao-toad' ? 'toad.box' : 'beans.jar'}
                      language={language}
                      decorative
                    />
                    <span>{t(kind === 'cacao-toad' ? 'cocoaToad' : 'chanceBeans')}</span>
                  </span>
                ))}
                {result.equipment.map((gear) => (
                  <div className="result-loot-product" key={gear.id}>
                    <EquipmentArt item={gear} language={language} />
                    <span>{equipmentName(gear, language)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <p className="visually-hidden">{t('equipmentSavedHint')}</p>
          <button
            className="shop-result-kit game-object"
            onClick={(event) => onPrepare(event.currentTarget)}
          >
            <Artwork asset="ui.map" language={language} decorative />
            {shopText(language, 'prepareGear')}
          </button>
        </section>
      )}
      <div className="shop-counter-tools">
        {mode === 'vault' && (
          <ShopBook
            language={language}
            label={t('possibleVaultLoot')}
            caption={shopText(language, 'checkLoot')}
            asset="product.loot-chest"
          >
            <div className="vault-loot-ledger">
              {offers.vaultRewards.map((entry) => (
                <article key={entry.id}>
                  <strong className="loot-chance">{percent.format(entry.probability)}</strong>
                  <span className="loot-currency">
                    <Artwork asset="currency.crowns" language={language} decorative />
                    {numbers.format(entry.loot.crowns)}
                  </span>
                  <div className="loot-products">
                    {entry.loot.products.map((kind, index) => (
                      <span key={index}>
                        <Artwork
                          asset={kind === 'cacao-toad' ? 'toad.box' : 'beans.jar'}
                          language={language}
                          decorative
                        />
                        <span>{t(kind === 'cacao-toad' ? 'cocoaToad' : 'chanceBeans')}</span>
                      </span>
                    ))}
                  </div>
                  {entry.loot.equipment.map((gear, index) => (
                    <div className="loot-gear" key={index}>
                      <EquipmentArt item={gear} language={language} />
                      <span>{equipmentName(gear, language)}</span>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </ShopBook>
        )}
        <ShopBook
          language={language}
          label={t('ownedEquipment')}
          caption={shopText(language, 'yourGear')}
          asset="product.wand-birch"
        >
          <div className="shop-owned-gear">
            {game.inventory.equipment?.map((gear, index) => (
              <article key={gear.id}>
                <EquipmentArt item={gear} language={language} />
                <span>{t('equipmentInstance', { number: index + 1 })}</span>
                <span>{equipmentName(gear, language)}</span>
              </article>
            ))}
            {!game.inventory.equipment?.length && <p>{shopText(language, 'noEquipment')}</p>}
          </div>
        </ShopBook>
      </div>
      {quote && (
        <dialog
          ref={dialog}
          className="notice shop-trade-confirmation"
          aria-label={t('equipmentConfirmation')}
          onCancel={() => setQuote(null)}
        >
          <GameSettings
            language={language}
            onLanguage={onLanguage}
            reduced={motion.reduced}
            ownReduced={motion.own}
            systemReduced={motion.system}
            onReduced={motion.change}
          />
          <h3>{t(quote.kind === 'forge' ? 'confirmForge' : 'confirmExchange')}</h3>
          <p>
            {quote.kind === 'forge'
              ? t('forgeConfirmation', { value: numbers.format(quote.recipe.crowns) })
              : t('vaultConfirmation')}
          </p>
          {quote.kind === 'forge' ? (
            <EquipmentArt item={blueprint(quote.recipe)} language={language} />
          ) : (
            <Artwork
              asset="product.gold-key"
              language={language}
              className="vault-key-art"
              decorative
            />
          )}
          {quote.kind === 'forge' && <p>{equipmentName(blueprint(quote.recipe), language)}</p>}
          {error && (
            <p role="alert">
              {t(
                error === 'STALE_WORKSHOP'
                  ? 'workshopChanged'
                  : error === 'INSUFFICIENT_KEYS'
                    ? 'earnBossKey'
                    : error === 'INSUFFICIENT_CROWNS'
                      ? 'notEnoughCrownsForRecipe'
                      : 'equipmentNeedsRecovery',
              )}
            </p>
          )}
          <button
            className="shop-confirm-seal"
            disabled={!ready}
            onClick={() =>
              quote.kind === 'forge'
                ? onForge({ recipeId: quote.recipe.id, catalogVersion: quote.version })
                : onVault({ tableVersion: quote.version })
            }
          >
            <Artwork
              asset={quote.kind === 'forge' ? 'ui.seal' : 'product.gold-key'}
              language={language}
              decorative
            />
            {t(quote.kind === 'forge' ? 'confirmForge' : 'confirmExchange')}
          </button>
          {pending && (
            <button disabled={!connected} onClick={onRecover}>
              {t('recoverOperation')}
            </button>
          )}
          <button onClick={() => setQuote(null)}>{t(ready ? 'cancel' : 'close')}</button>
        </dialog>
      )}
    </section>
  );
}
