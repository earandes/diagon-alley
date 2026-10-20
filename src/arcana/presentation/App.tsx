import type { BondMode } from '../domain/combat/bonds';
import { useGameAudioLifecycle } from './audio/runtime';
import {
  AccountAccess,
  AccountRequestError,
  readAccountSession,
  type AccountMode,
  type AccountSession,
} from './AccountAccess';
import { accountText } from './account-messages';
import { FantasyActionButton } from './FantasyActionButton';
import { challengeText } from './ExpeditionChallenge';
import { SeasonalEvent } from './SeasonalEvent';
import { previewEncounterTrade } from '../domain/exploration/encounter-trades';
import { encounterText } from './encounter-messages';
import type { ExpeditionChallenge } from '../domain/exploration/challenges';
import { NodePreparation } from './NodePreparation';
import { ExpeditionClosure } from './ExpeditionClosure';
import { ExpeditionIntentions, IntentionReminder } from './ExpeditionIntentions';
import type { IntentionChoice } from '../domain/exploration/intentions';
import { expeditionClosure, type ClosureAction } from '../application/client/expedition-closure';
import { nodeActionLabel } from './node-event-messages';
import './node-event-dialog.css';
import './header-pact.css';
import { AccountSettingsContext, GameSettings } from './GameSettings';
import { ReadingScope } from './ReadingPreferences';
import { SweetshopScene } from './SweetshopScene';
import { JourneyCabinet } from './JourneyCabinet';
import { Artwork } from './Artwork';
import { ExpeditionGuide } from './ExpeditionGuide';
import { OperationFeedback } from './OperationFeedback';
import { visualAsset } from './content-packs/art';
import type { CSSProperties } from 'react';
import {
  activePack,
  regionAppearance,
  subscribeContentPack,
  selectedContentPackId,
} from './content-packs/active';
import { useNavigation } from './useNavigation';
import { RecoveryNotice } from './RecoveryNotice';
import { useTrialEntry } from './useTrialEntry';
import { recoveryText } from './recovery-messages';
import { ArcanaClientError } from '../application/client/errors';
import { effectivePreparationRules } from './contextual-preparation';
import { useOnline } from './useOnline';
import { CommercePanel } from './CommercePanel';
import { NodeAnnouncement } from './NodeAnnouncement';
import { PlayerHud } from './PlayerHud';
import { TeamHud } from './TeamHud';
import { ExpeditionPreparation } from './ExpeditionPreparation';
import { SceneAtmosphere } from './SceneAtmosphere';
import { ShopHub } from './ShopHub';
import { prepText } from './prep-messages';
import { NodeResult } from './NodeResult';
import { text, type MessageKey } from './translations';
import { Fragment, useEffect, useState, useSyncExternalStore, useRef } from 'react';
import { CollectionPanel } from './CollectionPanel';
import { BossPartyStage } from './BossPartyStage';
import { BossSupplies } from './BossSupplies';
import './boss-staging.css';
import type { BeanAssignment, NodeOptions } from '../application/run-contracts';
import { MapPanel } from './MapPanel';
import { BattlePanel } from './BattlePanel';
import { CardReveal } from './CardReveal';
import { useReducedMotion } from './useReducedMotion';
import { GameController } from '../application/client/game-controller';
import { latestNodeReceipt, routeOptions } from '../application/client/read-models';
import { ArcanaHttpClient } from '../infrastructure/http/client';
import { IndexedDbClientOperations } from '../infrastructure/client/client-operations';
import type { Language } from '../domain/collection/wizards';
import type { NodeKind } from '../domain/exploration/route';
const controller = new GameController(
  new ArcanaHttpClient('/api', () => null, undefined, 'cookie'),
  new IndexedDbClientOperations(),
  () => crypto.randomUUID(),
);
const nodes: Record<NodeKind, MessageKey> = {
  duel: 'arcaneDuel',
  refuge: 'alchemyRefuge',
  chest: 'lootChest',
  pact: 'magicPact',
  encounter: 'chanceEncounter',
  boss: 'zoneBoss',
};
const NO_BEAN_ASSIGNMENTS: readonly BeanAssignment[] = Object.freeze([]);
export function App() {
  useGameAudioLifecycle();
  const [accountMode, setAccountMode] = useState<AccountMode | null>(null);
  const [accountSession, setAccountSession] = useState<AccountSession | null>(null);
  const [accountUnavailable, setAccountUnavailable] = useState(false);
  const [accountOpening, setAccountOpening] = useState(false);
  const [accountContextRevision, setAccountContextRevision] = useState(0);
  const openingAccount = useRef(false);
  const accountOrigin = useRef<HTMLElement | null>(null);
  const accountQuery = useRef(0);
  const refreshAccount = async () => {
    const query = ++accountQuery.current;
    try {
      const current = await readAccountSession();
      if (query !== accountQuery.current) return;
      setAccountSession(current);
      setAccountUnavailable(false);
      return current;
    } catch {
      if (query !== accountQuery.current) return;
      setAccountSession(null);
      setAccountUnavailable(true);
      return null;
    }
  };
  const openAccount = async (mode: AccountMode, reauthenticate = false) => {
    if (openingAccount.current) return;
    openingAccount.current = true;
    accountOrigin.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setAccountOpening(true);
    try {
      const current = await refreshAccount();
      if (current === undefined || !accountOrigin.current?.isConnected) return; // Superseded query never opens a stale task.
      const owner =
        controller.getSnapshot().game?.playerId ?? controller.getSnapshot().pending?.playerId;
      setAccountMode(
        reauthenticate
          ? 'login'
          : current?.kind === 'account'
            ? !owner || current.playerId === owner
              ? 'manage'
              : 'login'
            : mode === 'manage'
              ? 'login'
              : mode,
      );
    } finally {
      openingAccount.current = false;
      setAccountOpening(false);
    }
  };
  const packId = useSyncExternalStore(subscribeContentPack, selectedContentPackId);
  const [language, setLanguage] = useState<Language>(() => {
      try {
        return localStorage.getItem('arcana-language') === 'en' ? 'en' : 'es';
      } catch {
        return 'es';
      }
    }),
    [selected, setSelected] = useState<string | null>(null),
    [nodeOptions, setNodeOptions] = useState<NodeOptions>({}),
    [beanDraft, setBeanDraft] = useState<{ scope: string; values: readonly BeanAssignment[] }>({
      scope: '',
      values: [],
    }),
    [preparing, setPreparing] = useState(false),
    [preparationContext, setPreparationContext] = useState<'formation' | 'beans'>('formation'),
    [dismissedOpening, setDismissedOpening] = useState<string | null>(null);
  const { view, setView, bazaarPlace, setBazaarPlace } = useNavigation();
  const [admittedOpening, setAdmittedOpening] = useState<{
    playerId: string;
    receiptId: string;
  } | null>(null);
  const online = useOnline();
  const navigation = useRef<HTMLElement>(null);
  const motion = useReducedMotion(),
    dialog = useRef<HTMLDialogElement>(null),
    preparationDialog = useRef<HTMLDialogElement>(null),
    preparationOrigin = useRef<HTMLElement | null>(null),
    nodeOrigin = useRef<HTMLElement | null>(null);
  const openPreparation = (context: 'formation' | 'beans' = 'formation', origin?: HTMLElement) => {
    preparationOrigin.current =
      origin ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setPreparationContext(context);
    setPreparing(true);
  };
  useEffect(() => {
    if (!preparing || !preparationDialog.current) return;
    const element = preparationDialog.current;
    element.showModal();
    return () => {
      if (element.open) element.close();
      const origin = preparationOrigin.current;
      if (origin?.isConnected) origin.focus({ preventScroll: true });
      else document.getElementById('content')?.focus({ preventScroll: true });
    };
  }, [preparing, view]);
  const selectNode = (id: string, origin: HTMLButtonElement) => {
    nodeOrigin.current = origin;
    setAssignments([]);
    setNodeOptions({});
    setSelected(id);
  };
  useEffect(() => {
    if (!selected || !dialog.current) return;
    const current = dialog.current;
    if (!nodeOrigin.current?.isConnected)
      nodeOrigin.current =
        [...document.querySelectorAll<HTMLButtonElement>('[data-node]')].find(
          (button) => button.dataset.node === selected,
        ) ?? null;
    current.showModal();
    current
      .querySelector<HTMLButtonElement>(
        '[data-encounter-choice]:not(:disabled),[data-pact-candidate]:not(:disabled),[data-pact-choice]:not(:disabled),[data-pact-action]:not(:disabled),.node-confirm-action:not(:disabled)',
      )
      ?.focus({ preventScroll: true });
    // Native dialog focus may retain a small scroll offset on mobile WebKit.
    // Each new consultation starts at its illustration; later user scrolling is free.
    current.scrollTop = 0;
    return () => {
      if (current.open) current.close();
      const origin = nodeOrigin.current;
      if (origin?.isConnected && !(origin instanceof HTMLButtonElement && origin.disabled))
        origin.focus();
      else document.getElementById('content')?.focus({ preventScroll: true });
    };
  }, [selected, view]);
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot),
    t = (key: MessageKey, values?: Record<string, string | number>) => text(language, key, values);
  useEffect(() => {
    const receipt = state.receipt;
    const playerId = state.game?.playerId;
    if (
      accountMode ||
      view !== 'shop' ||
      !playerId ||
      !receipt ||
      !['open-toad', 'buy-open-toad'].includes(receipt.kind) ||
      dismissedOpening === receipt.id
    )
      return;
    // Presentation admission only: a recovered result must not cover unfinished authentication.
    // Keep an already admitted reveal mounted when its own Settings opens AccountAccess.
    setAdmittedOpening((previous) =>
      previous?.playerId === playerId && previous.receiptId === receipt.id
        ? previous
        : { playerId, receiptId: receipt.id },
    );
  }, [accountMode, view, state.game?.playerId, state.receipt, dismissedOpening]);
  useEffect(() => {
    const nav = navigation.current;
    const shell = nav?.closest<HTMLElement>('.arcana-shell');
    if (!nav || !shell) return;
    const measure = () =>
      shell.style.setProperty('--nav-height', `${Math.ceil(nav.getBoundingClientRect().height)}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    measure();
    return () => observer.disconnect();
  }, [state.game?.playerId]);
  useEffect(() => {
    document.documentElement.lang = language;
    for (const [key, value] of Object.entries(activePack.palette))
      document.documentElement.style.setProperty(
        '--pack-' + key.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase()),
        value,
      );
    document.title = `${activePack.brand} · ${text(language, 'theHiddenBoulevard')}`;
    try {
      localStorage.setItem('arcana-language', language);
    } catch {
      /* Preferences are optional. */
    }
  }, [language, packId]);
  useEffect(() => {
    if (navigator.onLine) {
      void controller.load();
      void refreshAccount();
    }
  }, []);
  useEffect(() => {
    if (!online) return;
    const current = controller.getSnapshot();
    if (!current.game || current.pending || current.error) void controller.load();
    else void controller.refreshStatus();
  }, [online]);
  useEffect(() => {
    if (state.receipt?.kind === 'start-run') {
      setPreparing(false);
      setView('map');
    }
    if (state.receipt?.kind === 'advance-node') {
      setSelected(null);
      if (state.receipt.battle) setView('battle');
    }
    if (state.receipt?.kind === 'set-intention' && state.receipt.intention === null)
      document.querySelector<HTMLElement>('#content')?.focus({ preventScroll: true });
    // Navigate only for a newly confirmed receipt; visiting a saved screen never sends a command.
  }, [state.receipt]);
  useEffect(() => {
    if (!state.game?.playerId) return;
    const refresh = () => {
      if (navigator.onLine && document.visibilityState === 'visible')
        void controller.refreshStatus();
    };
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [state.game?.playerId]);
  const ready = online && state.status === 'ready' && !state.refreshingStatus,
    game = state.game,
    content = state.content,
    run = game?.exploration?.run;
  // A draft belongs to one authority snapshot and chosen node, never to language or theme.
  const beanScope = JSON.stringify([
    game?.playerId,
    run?.id,
    game?.revision,
    selected,
    content?.campaign.version,
    content ? effectivePreparationRules(run, content.combatRules).version : undefined,
    content ? effectivePreparationRules(run, content.combatRules).beans.version : undefined,
  ]);
  const assignments = beanDraft.scope === beanScope ? beanDraft.values : NO_BEAN_ASSIGNMENTS;
  const setAssignments = (values: readonly BeanAssignment[]) =>
    setBeanDraft({ scope: beanScope, values });
  useEffect(() => {
    setSelected(null);
  }, [run?.id]);
  const availableNodeIds = new Set(run?.status === 'active' ? routeOptions(run, run.graph) : []);
  const availableNodeKey = [...availableNodeIds].join('|');
  useEffect(() => {
    // Another tab may finish this node while its local confirmation is open.
    if (selected && ready && !availableNodeIds.has(selected)) {
      setSelected(null);
      setNodeOptions({});
      setBeanDraft({ scope: '', values: [] });
    }
  }, [selected, ready, run?.id, availableNodeKey]);
  const combatChoices =
    run?.status === 'active'
      ? run.graph.nodes
          .filter(
            (node) =>
              (node.kind === 'duel' || node.kind === 'boss') && availableNodeIds.has(node.id),
          )
          .map((node) => ({ id: node.id, kind: node.kind as 'duel' | 'boss' }))
      : [];
  const openCombatPreparation = (id: string) => {
    if (!ready || !combatChoices.some((node) => node.id === id)) return;
    nodeOrigin.current = null;
    setAssignments([]);
    setNodeOptions({});
    setPreparing(false);
    setView('map');
    setSelected(id);
  };
  const selectedNode = run?.graph.nodes.find((node) => node.id === selected);
  const selectedPlan = (run?.campaignSnapshot?.nodes ?? content?.campaign.nodes)?.find(
    (plan) => plan.nodeId === selected,
  );
  const directPact =
    selectedPlan?.kind === 'pact' &&
    !selectedPlan.recruits &&
    selectedNode?.kind === 'pact' &&
    !!run &&
    run.members.length < 5;
  const nodeBefore = useRef<{ nodeId: string; run: NonNullable<typeof run> } | null>(null);
  const resolveNode = (options: NodeOptions = nodeOptions) => {
    if (!run || !selected || !ready || !availableNodeIds.has(selected)) return;
    nodeBefore.current = { nodeId: selected, run };
    void controller.perform({
      kind: 'advance-node',
      request: {
        runId: run.id,
        nodeId: selected,
        campaignVersion: run.campaignVersion,
        assignments,
        ...options,
      },
    });
  };
  const savedNode = game ? latestNodeReceipt(game) : null;
  const closure = game ? expeditionClosure(game) : null;
  const chooseIntention = (choice: IntentionChoice | null) => {
    const afterRunId = choice ? run?.id : game?.exploration?.intention?.afterRunId;
    if (!ready || !afterRunId) return;
    void controller.perform({ kind: 'set-intention', request: { afterRunId, choice } });
  };
  const openingFromClosure = useRef<{ runId: string; unitId: string } | null>(null);
  const closureAction = (action: ClosureAction, origin?: HTMLElement) => {
    if (!ready || !game || !content) return;
    if (action === 'vault') setBazaarPlace('vault');
    else if (action === 'frog' && closure?.frogId) {
      openingFromClosure.current = { runId: closure.run.id, unitId: closure.frogId };
      setBazaarPlace('confectionery');
      void controller.perform({
        kind: 'open-toad',
        request: {
          unitId: closure.frogId,
          catalogVersion: content.catalog.version,
          tableVersion: content.toadTable.version,
        },
      });
    } else openPreparation('formation', origin);
  };
  const battle =
    state.receipt?.kind === 'advance-node' ? state.receipt.battle : (savedNode?.battle ?? null);
  const battleReceipt = state.receipt?.kind === 'advance-node' ? state.receipt : savedNode;
  const label = (kind: NodeKind) => t(nodes[kind]);
  const startExpedition = (
    copyIds: readonly string[],
    challenge?: ExpeditionChallenge,
    bondFocus?: BondMode,
  ) => {
    if (!content) return;
    void controller.perform({
      kind: 'start-run',
      request: {
        zoneId: content.campaign.zoneId,
        campaignVersion: content.campaign.version,
        copyIds,
        ...(challenge ? { challenge } : {}),
        ...(bondFocus === undefined ? {} : { bondFocus }),
      },
    });
  };
  const scene =
    !game || (view === 'shop' && bazaarPlace === 'street')
      ? 'scene.boulevard'
      : view === 'shop'
        ? `scene.${bazaarPlace}`
        : view === 'battle'
          ? 'scene.arena'
          : regionAppearance(run?.zoneId ?? content?.campaign.zoneId ?? '', language).mapAsset;
  const entry = useTrialEntry(
    async () => {
      if (!(await controller.prepareTrialEntry())) return;
      const response = await fetch('/api/trial/session', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new ArcanaClientError(body?.error?.code ?? 'NETWORK_ERROR', response.status);
      }
      setSelected(null);
      setPreparing(false);
      await controller.load({ allowPlayerChange: true });
      await refreshAccount();
    },
    online && !state.pending && !['loading', 'sending', 'recovering'].includes(state.status),
  );
  const inlinePreparation = view === 'map' && !!content && !run;
  const recovery = (
    <RecoveryNotice
      state={state}
      language={language}
      connected={online}
      onReload={() => void controller.load()}
      onRecover={() => void controller.recover()}
      onSignIn={() => void openAccount('login', true)}
      accessOpening={accountOpening}
      onEnter={() => void entry.enter()}
      entering={entry.pending}
      entryError={entry.error}
    />
  );

  const accountOwner = game?.playerId ?? state.pending?.playerId;
  const accountKind =
    !accountOwner || accountSession?.playerId === accountOwner ? accountSession?.kind : 'anonymous';
  const accountControl = (
    <>
      <button
        type="button"
        data-account-entry="settings"
        disabled={accountOpening}
        onClick={() =>
          openAccount(
            accountKind === 'account' ? 'manage' : accountKind === 'guest' ? 'register' : 'login',
          )
        }
      >
        <Artwork asset="ui.missions" language={language} decorative />
        <span>
          {accountText(
            language,
            accountOpening
              ? 'sending'
              : accountKind === 'account'
                ? 'account'
                : accountKind === 'guest'
                  ? 'save'
                  : 'access',
          )}
        </span>
      </button>
      {accountKind === 'account' && <small>{accountSession?.email}</small>}
      {accountUnavailable && <small>{accountText(language, 'unavailable')}</small>}
    </>
  );

  return (
    <ReadingScope owner={game?.playerId ?? null}>
      <AccountSettingsContext.Provider value={accountControl}>
        <div
          className={`arcana-shell game-shell${game && view === 'map' ? ' arcana-map-view' : ''}`}
          data-reduced={motion.reduced}
          data-view={!game ? 'welcome' : view}
          data-content-pack={activePack.id}
          style={
            {
              ...Object.fromEntries(
                Object.entries(activePack.palette).map(([key, value]) => [
                  '--pack-' + key.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase()),
                  value,
                ]),
              ),
              '--control-frame': `url("${visualAsset('ui.frame')?.url ?? ''}")`,
              '--scene-url': `url("${visualAsset(scene)?.url ?? ''}")`,
            } as CSSProperties
          }
        >
          <Fragment key={accountContextRevision}>
            <a
              href="#content"
              className="skip-link"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById('content')?.focus();
              }}
            >
              {t('skipToContent')}
            </a>
            <div className="game-world-backdrop" aria-hidden="true" />
            <SceneAtmosphere
              reduced={motion.reduced}
              active={view !== 'battle' && !selected && !preparing}
            />
            {(!game || view !== 'battle') && (
              <header className={`game-header${game ? '' : ' welcome-tools'}`}>
                {game && (
                  <h1>
                    {view === 'map' && content
                      ? regionAppearance(run?.zoneId ?? content.campaign.zoneId, language).name
                      : activePack.brand}
                    {view === 'map' && run?.status === 'active' && run.challenge && (
                      <small className="challenge-reminder">
                        {challengeText(language, run.challenge)}
                      </small>
                    )}
                  </h1>
                )}
                {game &&
                  (content?.seasonalEdition || game.seasonal?.participations.length) &&
                  state.serverTime !== null && (
                    <SeasonalEvent
                      state={game}
                      language={language}
                      serverTime={state.serverTime}
                      edition={content?.seasonalEdition}
                      busy={!ready}
                      reducedMotion={motion.reduced}
                      error={state.error}
                      onRecover={() =>
                        void (state.pending ? controller.recover() : controller.load())
                      }
                      recoverLabel={state.pending ? t('recoverOperation') : t('refreshState')}
                      onAction={(request) =>
                        void controller.perform({ kind: 'seasonal-event', request })
                      }
                      onPrepareRoute={() => {
                        setView('map');
                        if (run && run.status !== 'active') openPreparation();
                        else document.getElementById('content')?.focus({ preventScroll: true });
                      }}
                    />
                  )}
                <GameSettings
                  language={language}
                  onLanguage={setLanguage}
                  reduced={motion.reduced}
                  ownReduced={motion.own}
                  systemReduced={motion.system}
                  onReduced={motion.change}
                />
              </header>
            )}

            {!online && (
              <p role="status" className="notice connection-note">
                {t(game ? 'offlinePriorReading' : 'offlineNeedsConnection')}
              </p>
            )}
            <NodeAnnouncement receipt={state.receipt} language={language} />
            {!game ? (
              <main id="content" tabIndex={-1} className="welcome welcome-menu">
                <header className="welcome-brand">
                  <Artwork
                    asset="brand.emblem"
                    language={language}
                    className="welcome-emblem"
                    decorative
                    eager
                  />
                  <h1>
                    {selectedContentPackId() === 'diagon-alley'
                      ? regionAppearance('pasaje', language).name
                      : activePack.brand}
                  </h1>
                  <span className="welcome-brand-rule" aria-hidden="true">
                    <i />
                  </span>
                </header>
                <span className="visually-hidden">{t('anApprenticeAWandAndAPathTo')}</span>
                <div className="welcome-actions">
                  <FantasyActionButton
                    variant="primary"
                    asset="ui.map"
                    language={language}
                    className="portal-enter"
                    aria-label={accountText(language, 'guest')}
                    aria-busy={entry.pending || undefined}
                    disabled={
                      accountOpening ||
                      !online ||
                      !!state.pending ||
                      state.status === 'loading' ||
                      entry.pending
                    }
                    onClick={() => void entry.enter()}
                  >
                    {entry.pending
                      ? recoveryText(language, 'entering')
                      : accountText(language, 'guest')}
                  </FantasyActionButton>
                  <FantasyActionButton
                    variant="secondary"
                    asset="account.login"
                    language={language}
                    data-account-entry="login"
                    disabled={
                      accountOpening || !online || state.status === 'loading' || entry.pending
                    }
                    onClick={() => openAccount('login')}
                  >
                    {accountText(language, 'login')}
                  </FantasyActionButton>
                  <FantasyActionButton
                    variant="tertiary"
                    asset="account.register"
                    language={language}
                    data-account-entry="register"
                    disabled={
                      accountOpening || !online || state.status === 'loading' || entry.pending
                    }
                    onClick={() => openAccount('register')}
                  >
                    {accountText(language, 'register')}
                  </FantasyActionButton>
                </div>
                {accountOpening && <p role="status">{accountText(language, 'sending')}</p>}
                {state.pending && recovery}
                <p className="account-guest-hint">{accountText(language, 'guestHint')}</p>
                {entry.error && (
                  <p role="alert">
                    {recoveryText(
                      language,
                      entry.error === 'RATE_LIMITED' ? 'rateLimited' : 'entryFailed',
                    )}
                  </p>
                )}
                {entry.pending && <p role="status">{recoveryText(language, 'entering')}</p>}
              </main>
            ) : (
              <>
                {view !== 'battle' && (
                  <PlayerHud
                    state={state}
                    connected={online}
                    language={language}
                    onRefresh={() => void controller.refreshStatus()}
                  />
                )}
                <main id="content" tabIndex={-1}>
                  <OperationFeedback
                    receipt={state.error || state.pending ? null : state.receipt}
                    language={language}
                    reduced={motion.reduced}
                  />
                  {!selected && !preparing && !inlinePreparation && recovery}
                  {online &&
                    !selected &&
                    !preparing &&
                    !inlinePreparation &&
                    (state.status === 'loading' ||
                      state.status === 'sending' ||
                      state.status === 'recovering' ||
                      state.refreshingStatus) && (
                      <p role="status">
                        {state.pending
                          ? t('recoveringTheOperationWaitBeforeSpendingAgain')
                          : t('synchronizingState')}
                      </p>
                    )}
                  {view === 'shop' &&
                    (state.receipt?.kind === 'open-toad' ||
                      state.receipt?.kind === 'buy-open-toad') &&
                    admittedOpening?.playerId === game.playerId &&
                    admittedOpening.receiptId === state.receipt.id &&
                    dismissedOpening !== state.receipt.id && (
                      <CardReveal
                        key={state.receipt.id}
                        receipt={state.receipt}
                        language={language}
                        reduced={motion.reduced}
                        onLanguage={setLanguage}
                        onCollection={() => {
                          openingFromClosure.current = null;
                          setDismissedOpening(state.receipt!.id);
                          setView('collection');
                        }}
                        onClose={() => {
                          setDismissedOpening(state.receipt!.id);
                          const origin = openingFromClosure.current;
                          if (
                            origin &&
                            origin.runId === run?.id &&
                            run?.status !== 'active' &&
                            state.receipt?.kind === 'open-toad' &&
                            state.receipt.request.unitId === origin.unitId
                          ) {
                            openingFromClosure.current = null;
                            setView('map');
                          }
                        }}
                      />
                    )}
                  {view === 'map' && content && (
                    <section
                      className="expedition-panel"
                      data-map-phase={closure ? 'closed' : !run ? 'entry' : 'route'}
                    >
                      {!closure && (
                        <div className="expedition-heading">
                          <ExpeditionGuide
                            run={run}
                            language={language}
                            effectiveEssence={state.energy?.points}
                            ready={ready}
                            onPrepare={(origin) => openPreparation('formation', origin)}
                            onConsult={selectNode}
                          />
                        </div>
                      )}
                      {!closure && savedNode && (
                        <NodeResult
                          receipt={savedNode}
                          preferredIntention={
                            game.exploration?.intention?.runId === savedNode.request.runId
                              ? game.exploration?.intention?.choice
                              : undefined
                          }
                          confirmed={ready && state.receipt?.id === savedNode.id}
                          previousRun={
                            nodeBefore.current?.nodeId === savedNode.request.nodeId
                              ? nodeBefore.current.run
                              : undefined
                          }
                          language={language}
                          onReplay={() => setView('battle')}
                          onMissions={() => setView('missions')}
                        />
                      )}
                      {closure ? (
                        <>
                          <ExpeditionClosure
                            game={game}
                            confirmedReceiptId={ready ? state.receipt?.id : undefined}
                            language={language}
                            ready={ready}
                            onAction={closureAction}
                            onReplay={() => setView('battle')}
                            onMissions={() => setView('missions')}
                          />
                          <ExpeditionIntentions
                            game={game}
                            content={content ?? undefined}
                            language={language}
                            ready={ready}
                            onChoose={chooseIntention}
                          />
                        </>
                      ) : !run ? (
                        <div className="region-entry preparation-entry">
                          <ExpeditionPreparation
                            recovery={recovery}
                            key={`new-entry:${game.playerId}`}
                            game={game}
                            catalog={content.catalog}
                            content={content ?? undefined}
                            language={language}
                            ready={ready}
                            onTeam={(request) =>
                              void controller.perform({ kind: 'set-team', request })
                            }
                            onEquip={(request) =>
                              void controller.perform({ kind: 'equip-equipment', request })
                            }
                            onStart={startExpedition}
                          />
                        </div>
                      ) : (
                        <>
                          <IntentionReminder
                            game={game}
                            content={content ?? undefined}
                            language={language}
                            ready={ready}
                            onCancel={() => chooseIntention(null)}
                          />
                          <TeamHud
                            game={game}
                            content={content ?? undefined}
                            language={language}
                            onPrepare={(origin) => openPreparation('formation', origin)}
                          />
                          <MapPanel
                            publicPlans={content.campaign.nodes}
                            run={run}
                            ready={ready}
                            language={language}
                            onSelect={selectNode}
                            confirmedReceiptId={
                              ready && state.receipt?.id === savedNode?.id
                                ? savedNode?.id
                                : undefined
                            }
                          />
                        </>
                      )}

                      {selected && run && (
                        <dialog
                          ref={dialog}
                          onCancel={() => setSelected(null)}
                          aria-label={t('nodeConfirmation')}
                          className={`notice node-event-dialog${selectedNode?.kind === 'boss' ? ' boss-staging' : ''}`}
                          data-event-kind={selectedNode?.kind}
                        >
                          {selectedNode?.kind !== 'boss' && (
                            <Artwork
                              asset={`node.${run.graph.nodes.find((n) => n.id === selected)!.kind}`}
                              language={language}
                              className="node-confirmation-art"
                              decorative
                            />
                          )}
                          <GameSettings
                            language={language}
                            onLanguage={setLanguage}
                            reduced={motion.reduced}
                            ownReduced={motion.own}
                            systemReduced={motion.system}
                            onReduced={motion.change}
                          />
                          <h3
                            className={
                              selectedNode?.kind === 'boss' ? 'visually-hidden' : undefined
                            }
                          >
                            {label(run.graph.nodes.find((n) => n.id === selected)!.kind)}
                          </h3>
                          <p className="visually-hidden">
                            {['duel', 'boss'].includes(
                              run.graph.nodes.find((n) => n.id === selected)!.kind,
                            )
                              ? t('uses5EssenceAutomaticCombatWithYourCurrent')
                              : t('resolveThisEventWithYourCurrentTeam')}
                          </p>
                          {selectedNode?.kind === 'duel' && (
                            <div
                              className="node-cost"
                              aria-label={t('uses5EssenceAutomaticCombatWithYourCurrent')}
                            >
                              <Artwork asset="currency.essence" language={language} decorative />
                              <strong>5</strong>
                            </div>
                          )}
                          {selectedPlan && (
                            <NodePreparation
                              plan={selectedPlan}
                              run={run}
                              game={game}
                              language={language}
                              rules={effectivePreparationRules(run, content.combatRules)}
                              rounding={
                                run.campaignSnapshot?.rounding ??
                                content.campaign.rounding ??
                                'floor'
                              }
                              options={nodeOptions}
                              ready={ready}
                              onChange={setNodeOptions}
                              onResolve={directPact ? resolveNode : undefined}
                            />
                          )}
                          {content && selectedNode?.kind === 'boss' && (
                            <div className="boss-player-preparation">
                              <BossPartyStage
                                run={run}
                                game={game}
                                assignments={assignments}
                                language={language}
                                ready={ready}
                                rules={effectivePreparationRules(run, content.combatRules)}
                                onPrepare={(origin) => openPreparation('formation', origin)}
                                supplies={
                                  <BossSupplies
                                    run={run}
                                    game={game}
                                    content={content ?? undefined}
                                    language={language}
                                    ready={ready}
                                    assignments={assignments}
                                    onChange={setAssignments}
                                  />
                                }
                              />
                            </div>
                          )}
                          {content &&
                            selectedNode?.kind !== 'boss' &&
                            ['duel', 'boss'].includes(
                              run.graph.nodes.find((n) => n.id === selected)!.kind,
                            ) && (
                              <>
                                <button
                                  className="node-team-prepare"
                                  onClick={(event) =>
                                    openPreparation('formation', event.currentTarget)
                                  }
                                  disabled={!ready}
                                >
                                  <Artwork asset="ui.team" language={language} decorative />
                                  <span>{prepText(language, 'equipment')}</span>
                                </button>
                                <BossSupplies
                                  run={run}
                                  game={game}
                                  content={content ?? undefined}
                                  language={language}
                                  ready={ready}
                                  assignments={assignments}
                                  onChange={setAssignments}
                                />
                              </>
                            )}
                          {!preparing && recovery}
                          <div
                            className={
                              ['duel', 'boss'].includes(selectedNode!.kind)
                                ? 'node-event-actions node-combat-actions'
                                : 'node-event-actions'
                            }
                          >
                            {!directPact && (
                              <button
                                aria-label={
                                  selectedPlan?.kind === 'encounter' && selectedPlan.offer
                                    ? encounterText(
                                        language,
                                        nodeOptions.encounterAction === 'pass' ? 'pass' : 'accept',
                                      )
                                    : nodeActionLabel(language, selectedNode!.kind)
                                }
                                title={
                                  selectedPlan?.kind === 'encounter' && selectedPlan.offer
                                    ? encounterText(
                                        language,
                                        nodeOptions.encounterAction === 'pass' ? 'pass' : 'accept',
                                      )
                                    : nodeActionLabel(language, selectedNode!.kind)
                                }
                                className="node-confirm-action"
                                aria-describedby={
                                  selectedNode?.kind === 'boss' ? 'boss-challenge-cost' : undefined
                                }
                                autoFocus
                                disabled={
                                  !ready ||
                                  (selectedPlan?.kind === 'encounter' &&
                                    selectedPlan.offer !== undefined &&
                                    nodeOptions.encounterAction !== 'pass' &&
                                    !previewEncounterTrade(
                                      run.members,
                                      selectedPlan.offer,
                                      nodeOptions.encounterChoiceId,
                                      nodeOptions.encounterUnitId,
                                    ).eligible) ||
                                  (selectedPlan?.kind === 'pact' &&
                                    selectedPlan.recruits !== undefined &&
                                    nodeOptions.pactAction !== 'pass' &&
                                    !selectedPlan.recruits.some(
                                      (unit) => unit.id === nodeOptions.recruitId,
                                    )) ||
                                  (run.graph.nodes.find((n) => n.id === selected)?.kind ===
                                    'pact' &&
                                    run.members.length === 5 &&
                                    nodeOptions.pactAction !== 'pass' &&
                                    !nodeOptions.replaceUnitId)
                                }
                                onClick={() => resolveNode()}
                              >
                                <Artwork
                                  asset={`node.${selectedNode!.kind}`}
                                  language={language}
                                  decorative
                                />
                                <span>
                                  {selectedPlan?.kind === 'encounter' && selectedPlan.offer
                                    ? encounterText(
                                        language,
                                        nodeOptions.encounterAction === 'pass' ? 'pass' : 'accept',
                                      )
                                    : nodeActionLabel(language, selectedNode!.kind)}
                                </span>
                                {selectedNode?.kind === 'boss' && (
                                  <span
                                    id="boss-challenge-cost"
                                    className="boss-challenge-cost"
                                    aria-label={t('uses5EssenceAutomaticCombatWithYourCurrent')}
                                  >
                                    <Artwork
                                      asset="currency.essence"
                                      language={language}
                                      decorative
                                    />
                                    <strong>5</strong>
                                  </span>
                                )}
                              </button>
                            )}
                            <button
                              className="node-cancel-action"
                              aria-label={t(ready ? 'cancel' : 'close')}
                              title={t(ready ? 'cancel' : 'close')}
                              onClick={() => setSelected(null)}
                            >
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                        </dialog>
                      )}
                    </section>
                  )}
                  {view === 'shop' && content && (
                    <section>
                      {bazaarPlace === 'street' && (
                        <ShopHub language={language} onEnter={setBazaarPlace} />
                      )}
                      {bazaarPlace === 'confectionery' && (
                        <SweetshopScene
                          game={game}
                          content={content ?? undefined}
                          language={language}
                          ready={ready}
                          onStreet={() => setBazaarPlace('street')}
                          onPurchase={(request) =>
                            void controller.perform({ kind: 'purchase', request })
                          }
                          onOpen={(request) =>
                            void controller.perform({ kind: 'open-toad', request })
                          }
                          onBuyOpen={(request) =>
                            void controller.perform({ kind: 'buy-open-toad', request })
                          }
                          onPrepare={(origin) => openPreparation('beans', origin)}
                        />
                      )}
                      {(bazaarPlace === 'workshop' || bazaarPlace === 'vault') &&
                        content.commerce && (
                          <CommercePanel
                            key={bazaarPlace}
                            reduced={motion.reduced}
                            mode={bazaarPlace}
                            connected={online}
                            content={content.commerce}
                            preparationContent={content}
                            game={game}
                            receipt={state.receipt}
                            language={language}
                            ready={ready}
                            pending={!!state.pending}
                            error={state.error}
                            onForge={(request) =>
                              void controller.perform({ kind: 'forge-wand', request })
                            }
                            onVault={(request) =>
                              void controller.perform({ kind: 'open-vault', request })
                            }
                            onRecover={() => void controller.recover()}
                            onPrepare={(origin) => openPreparation('formation', origin)}
                            onStreet={() => setBazaarPlace('street')}
                            onMap={() => setView('map')}
                            onLanguage={setLanguage}
                          />
                        )}
                    </section>
                  )}
                  {view === 'collection' && content && (
                    <CollectionPanel
                      game={game}
                      catalog={content.catalog}
                      content={content}
                      language={language}
                      onAcquire={() => {
                        setBazaarPlace('confectionery');
                      }}
                      onPrepare={(origin) => openPreparation('formation', origin)}
                    />
                  )}
                  {view === 'battle' && battle && (
                    <BattlePanel
                      key={battle.id}
                      combat={battle}
                      preferredIntention={
                        game.exploration?.intention?.runId === battleReceipt?.request.runId
                          ? game.exploration?.intention?.choice
                          : undefined
                      }
                      resources={
                        <PlayerHud
                          state={state}
                          connected={online}
                          language={language}
                          onRefresh={() => void controller.refreshStatus()}
                        />
                      }
                      settings={
                        <GameSettings
                          language={language}
                          onLanguage={setLanguage}
                          reduced={motion.reduced}
                          ownReduced={motion.own}
                          systemReduced={motion.system}
                          onReduced={motion.change}
                        />
                      }
                      confirmedPresentation={
                        state.receipt?.kind === 'advance-node' &&
                        state.receipt.battle?.id === battle.id
                      }
                      game={game}
                      content={content}
                      language={language}
                      reduced={motion.reduced}
                      onBack={() => setView('map')}
                    />
                  )}
                  {view === 'battle' && !battle && (
                    <section>
                      <h2>{t('combatArena')}</h2>
                      <p>{t('noSavedBattle')}</p>
                      <button onClick={() => setView('map')}>{t('backToMap')}</button>
                    </section>
                  )}
                  {view === 'missions' && (
                    <JourneyCabinet
                      content={content ?? undefined}
                      game={game}
                      language={language}
                      onMap={() => setView('map')}
                      onCollection={() => setView('collection')}
                      onShop={() => setBazaarPlace('street')}
                      onVault={() => {
                        setView('shop');
                        setBazaarPlace('vault');
                      }}
                    />
                  )}
                </main>
                {preparing && content && (
                  <dialog
                    ref={preparationDialog}
                    className="preparation-dialog"
                    aria-label={prepText(language, 'preparation')}
                    onCancel={() => setPreparing(false)}
                  >
                    <GameSettings
                      language={language}
                      onLanguage={setLanguage}
                      reduced={motion.reduced}
                      ownReduced={motion.own}
                      systemReduced={motion.system}
                      onReduced={motion.change}
                    />
                    <ExpeditionPreparation
                      recovery={recovery}
                      game={game}
                      catalog={content.catalog}
                      content={content}
                      context={preparationContext}
                      combatChoices={combatChoices}
                      onCombatNode={openCombatPreparation}
                      onReturnToMap={() => {
                        setPreparing(false);
                        setView('map');
                      }}
                      language={language}
                      ready={ready}
                      onStart={(ids, challenge, bondFocus) => {
                        startExpedition(ids, challenge, bondFocus);
                      }}
                      onTeam={(request) => void controller.perform({ kind: 'set-team', request })}
                      onEquip={(request) =>
                        void controller.perform({ kind: 'equip-equipment', request })
                      }
                      onClose={() => setPreparing(false)}
                    />
                  </dialog>
                )}
                <nav ref={navigation} aria-label={t('mainNavigation')}>
                  {(
                    [
                      ['map', 'map'],
                      ['collection', 'chromodex'],
                      ['shop', 'bazaar'],
                      ['missions', 'missions'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      aria-current={view === key ? 'page' : undefined}
                      onClick={() => (key === 'shop' ? setBazaarPlace('street') : setView(key))}
                    >
                      <Artwork asset={`ui.${key}`} language={language} decorative />
                      <span>{t(label)}</span>
                    </button>
                  ))}
                </nav>
              </>
            )}
          </Fragment>
          {accountMode && (
            <AccountAccess
              language={language}
              returnFocus={accountOrigin.current}
              initialMode={accountMode}
              session={accountSession}
              playerId={game?.playerId ?? state.pending?.playerId}
              ownerForRequest={() =>
                controller.getSnapshot().game?.playerId ??
                controller.getSnapshot().pending?.playerId
              }
              pending={!!state.pending}
              connected={online}
              onClose={() => setAccountMode(null)}
              beforeIdentityChange={controller.beginIdentityChange}
              finishIdentityChange={async (outcome, samePlayerOnly, expectedPlayerId) => {
                const previousOwner =
                  controller.getSnapshot().game?.playerId ??
                  controller.getSnapshot().pending?.playerId;
                await controller.finishIdentityChange(outcome, samePlayerOnly, expectedPlayerId);
                const currentOwner = controller.getSnapshot().game?.playerId;
                if (
                  ['authenticated', 'signed-out'].includes(outcome) &&
                  previousOwner !== currentOwner
                )
                  setAccountContextRevision((revision) => revision + 1);
                if (outcome === 'authenticated' && controller.getSnapshot().error)
                  throw new AccountRequestError(
                    controller.getSnapshot().error ?? 'AUTH_UNAVAILABLE',
                  );
                if (
                  outcome === 'signed-out' ||
                  (outcome === 'authenticated' && previousOwner !== currentOwner)
                ) {
                  setSelected(null);
                  setPreparing(false);
                  setView('map');
                }
              }}
              onSession={(session) => {
                accountQuery.current++;
                setAccountSession(session);
                setAccountUnavailable(false);
              }}
              onAccessReset={async () => {
                await controller.load();
                await refreshAccount();
              }}
            />
          )}
        </div>
      </AccountSettingsContext.Provider>
    </ReadingScope>
  );
}
