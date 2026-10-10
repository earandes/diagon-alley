import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import catalog from '../content/catalog.json';
import table from '../content/welcome-table.json';
import {
  DemoError,
  copyCount,
  discoveryCount,
  frogAvailable,
  tokenOf,
  type DemoState,
  type ErrorCode,
  type ExportedDemo,
  type Language,
  type StoredDemo,
  type Token,
} from '../domain/model';
import { parseExport } from '../domain/validation';
import { DemoStore, openingRequest } from '../infrastructure/demo-store';
import {
  copiesText,
  errorText,
  familyName,
  percent,
  progressText,
  translate,
} from '../i18n/messages';
import {
  IllustratedAlley,
  IllustratedFrogBox,
  ProductArtwork,
  ShopBackdrop,
  type ShopProductId,
} from './VisualArt';
import { Shop } from './Shop';
import { Album } from './Album';
import { IdentityDetails, Rarity } from './IdentityDetails';
type View =
  | 'alley'
  | 'shop'
  | 'product'
  | 'detail'
  | 'reveal'
  | 'result'
  | 'album'
  | 'card'
  | 'settings';
const store = new DemoStore();
const initialLanguage: Language = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
const configInput = { catalog, table, assetVersion: 1 };
const errorCode = (e: unknown): ErrorCode => (e instanceof DemoError ? e.code : 'STORAGE');
export function App() {
  const [stored, setStored] = useState<StoredDemo | null>(null),
    [language, setLanguage] = useState<Language>(initialLanguage),
    [view, setView] = useState<View>('alley');
  const [error, setError] = useState<ErrorCode | null>(null),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false),
    [visible, setVisible] = useState(!document.hidden),
    [sceneVisible, setSceneVisible] = useState(true),
    [systemReduced, setSystemReduced] = useState(
      matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  const [selected, setSelected] = useState<string | null>(null),
    [json, setJson] = useState('');
  const [confirmation, setConfirmation] = useState<{
    kind: 'reset' | 'import';
    data: ExportedDemo | null;
    token: Token;
  } | null>(null);
  const [productListOpen, setProductListOpen] = useState(false);
  const [product, setProduct] = useState<ShopProductId>('beans');
  const [productOriginId, setProductOriginId] = useState('consult-beans');
  const [announcement, setAnnouncement] = useState('');
  const acceptedSnapshot = useRef<StoredDemo | null>(null);
  const preferredLanguage = useRef(initialLanguage);
  const pendingLanguage = useRef<Language | null>(null);
  const notificationChannel = useRef<BroadcastChannel | null>(null);
  const albumOrigin = useRef<{ view: View; focus: string }>({
    view: 'alley',
    focus: 'alley-album',
  });
  const busyRef = useRef(false),
    attempt = useRef<{
      key: string;
      request: ReturnType<typeof openingRequest>;
      token: Token;
    } | null>(null),
    announced = useRef<string | null>(null),
    detailRequest = useRef<ReturnType<typeof openingRequest> | null>(null),
    main = useRef<HTMLElement>(null),
    scene = useRef<HTMLElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    dialogOrigin = useRef<HTMLElement | null>(null),
    pendingFocus = useRef<string | null>(null),
    alleyOrigin = useRef('enter-shop'),
    productOrigin = useRef('consult-frog'),
    settingsOrigin = useRef<View>('alley'),
    scrollPositions = useRef<Partial<Record<View, number>>>({});
  const t = (key: Parameters<typeof translate>[1]) => translate(language, key);
  const reduced = systemReduced || !!stored?.state.reducedMotion;
  const accept = useCallback((s: StoredDemo) => {
    const current = acceptedSnapshot.current;
    // A slow focus/read response must not roll back a more recent commit.
    if (
      current &&
      (s.generation < current.generation ||
        (s.generation === current.generation && s.state.revision < current.state.revision))
    )
      return;
    acceptedSnapshot.current = s;
    setStored(s);
    preferredLanguage.current = s.state.language;
    setLanguage(s.state.language);
  }, []);
  const go = useCallback(
    (next: View, focus: string | null = null) => {
      scrollPositions.current[view] = window.scrollY;
      pendingFocus.current = focus;
      setView(next);
      setError(null);
      setNotice('');
    },
    [view],
  );
  const recover = useCallback(
    async (first = false) => {
      setError(null);
      try {
        let s: StoredDemo;
        try {
          s = await store.start(configInput, preferredLanguage.current);
        } catch (e) {
          if (errorCode(e) !== 'INVALID_CONFIG' && errorCode(e) !== 'CONFLICT') throw e;
          try {
            s = await store.read();
          } catch {
            throw e;
          }
          setError(errorCode(e));
        }
        // A choice made while start() awaited storage wins over the initial browser hint.
        while (pendingLanguage.current && pendingLanguage.current !== s.state.language) {
          s = await store.preferences({ language: pendingLanguage.current }, tokenOf(s));
        }
        pendingLanguage.current = null;
        accept(s);
        if (s.state.operations.length && s.state.seenOperationId !== s.state.operations[0].id) {
          setView('result');
          setNotice(translate(s.state.language, 'recovered'));
        } else if (!first) setNotice(translate(s.state.language, 'recovered'));
      } catch (e) {
        setError(errorCode(e));
      }
    },
    [accept],
  );
  useEffect(() => {
    void recover(true);
  }, [recover]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = translate(language, 'brand') + ' · ' + translate(language, 'alley');
  }, [language]);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)'),
      change = () => setSystemReduced(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    const refresh = async () => {
      if (busyRef.current || document.hidden) return;
      try {
        const s = await store.read();
        accept(s);
        if (s.state.operations.length && s.state.seenOperationId !== s.state.operations[0].id) {
          setView('result');
        }
      } catch (e) {
        setError(errorCode(e));
      }
    };
    const visibility = () => {
      setVisible(!document.hidden);
      void refresh();
    };
    const channel = new BroadcastChannel('magic-i1-changes');
    notificationChannel.current = channel;
    channel.onmessage = () => void refresh();
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      notificationChannel.current = null;
      channel.close();
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [accept]);
  useEffect(() => {
    if (!scene.current) return;
    const observer = new IntersectionObserver(([entry]) => setSceneVisible(entry.isIntersecting));
    observer.observe(scene.current);
    return () => observer.disconnect();
  }, [view, stored !== null]);
  useEffect(() => {
    const focus = pendingFocus.current;
    pendingFocus.current = null;
    requestAnimationFrame(() => {
      const target = focus
        ? document.getElementById(focus)
        : [...(main.current?.querySelectorAll<HTMLElement>('h1') ?? [])].find(
            (heading) => !heading.closest('[hidden]'),
          );
      target?.focus({ preventScroll: true });
      window.scrollTo({
        top: focus ? (scrollPositions.current[view] ?? 0) : 0,
        behavior: 'instant',
      });
    });
  }, [view]);
  const operation = stored?.state.operations[0];
  useEffect(() => {
    if (view !== 'result' || !operation || !stored) return;
    if (announced.current !== operation.id) {
      announced.current = operation.id;
      setAnnouncement(
        language === 'es'
          ? `Descubrimiento guardado: ${operation.identity.name.es}. ${copiesText('es', copyCount(stored.state, operation.identity.id))}.`
          : `Discovery saved: ${operation.identity.name.en}. ${copiesText('en', copyCount(stored.state, operation.identity.id))}.`,
      );
    }
    if (stored.state.seenOperationId !== operation.id)
      void store
        .seen(operation.id, tokenOf(stored))
        .then(accept)
        .catch((e) => setError(errorCode(e)));
  }, [view, operation, stored, language, accept]);
  useEffect(() => {
    if (view !== 'reveal') return;
    if (reduced) {
      setView('result');
      return;
    }
    const timer = window.setTimeout(() => setView('result'), 1600);
    return () => clearTimeout(timer);
  }, [view, reduced]);
  useEffect(() => {
    if (confirmation) {
      dialogOrigin.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else if (dialog.current?.open) {
      dialog.current.close();
      dialogOrigin.current?.focus();
    }
  }, [confirmation]);
  function notify() {
    notificationChannel.current?.postMessage('refresh');
  }
  async function preferences(
    values: Partial<Pick<DemoState, 'language' | 'reducedMotion' | 'ambient'>>,
  ) {
    if (!stored) return;
    try {
      const next = await store.preferences(values, tokenOf(stored));
      accept(next);
      if (values.language) setAnnouncement('');
      notify();
    } catch (e) {
      setError(errorCode(e));
    }
  }
  async function inspect(origin = 'consult-frog') {
    if (!stored) return;
    try {
      const latest = await store.read();
      accept(latest);
      detailRequest.current = openingRequest(latest);
      attempt.current = null;
      productOrigin.current = origin;
      go('detail');
    } catch (e) {
      setError(errorCode(e));
    }
  }
  async function open() {
    if (!stored || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    setNotice('');
    const currentAttempt = attempt.current ?? {
      key: crypto.randomUUID(),
      request: detailRequest.current ?? openingRequest(stored),
      token: tokenOf(stored),
    };
    attempt.current = currentAttempt;
    try {
      const next = await store.open(
        currentAttempt.key,
        currentAttempt.request,
        currentAttempt.token,
      );
      accept(next);
      notify();
      go(reduced ? 'result' : 'reveal');
    } catch (e) {
      const code = errorCode(e);
      setError(code);
      try {
        const latest = await store.read();
        accept(latest);
        if (latest.state.operations.length) {
          go('result');
          setNotice(t('recovered'));
        } else if (code === 'STALE_CONFIG' || code === 'STALE_STATE') {
          detailRequest.current = openingRequest(latest);
          attempt.current = null;
          setNotice(t('configUpdate'));
        }
      } catch {
        setError('UNKNOWN');
      }
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  async function exportGame() {
    try {
      const data = await store.export(),
        url = URL.createObjectURL(new Blob([data], { type: 'application/json' })),
        a = document.createElement('a');
      a.href = url;
      a.download = 'coleccion-magica-i1.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(t('exported'));
    } catch (e) {
      setError(errorCode(e));
    }
  }
  async function reviewImport(input = json) {
    if (!stored) return;
    try {
      const data = parseExport(input);
      const latest = await store.read();
      accept(latest);
      setConfirmation({ kind: 'import', data, token: tokenOf(latest) });
      setError(null);
    } catch {
      setError('INVALID_IMPORT');
    }
  }
  async function importFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 262144) {
      setError('INVALID_IMPORT');
      return;
    }
    try {
      await reviewImport(await file.text());
    } catch {
      setError('INVALID_IMPORT');
    }
    e.target.value = '';
  }
  async function reset() {
    try {
      const s = await store.read();
      accept(s);
      setConfirmation({ kind: 'reset', data: null, token: tokenOf(s) });
    } catch (e) {
      setError(errorCode(e));
    }
  }
  async function replace() {
    if (!confirmation || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      const next = await store.replace(confirmation.data, confirmation.token);
      accept(next);
      notify();
      attempt.current = null;
      announced.current = null;
      setAnnouncement('');
      setJson('');
      setConfirmation(null);
      go(next.state.operations.length ? 'result' : 'alley');
      setNotice(
        translate(next.state.language, confirmation.kind === 'reset' ? 'resetDone' : 'imported'),
      );
    } catch (e) {
      setConfirmation(null);
      setError(errorCode(e));
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  function openAlbum(origin: string) {
    albumOrigin.current = { view, focus: origin };
    go('album');
  }
  const state = stored?.state;
  const displayIdentities =
    stored?.active.catalog.identities.map(
      (i) => state?.copies.find((c) => c.identity.id === i.id)?.identity ?? i,
    ) ?? [];
  const card = displayIdentities.find((i) => i.id === selected);
  const ambientActive = visible && sceneVisible && !reduced && !!state?.ambient;
  return (
    <div
      className={
        'app visual-v2 view-' +
        view +
        ' ' +
        (reduced ? 'reduced ' : '') +
        (!ambientActive ? 'ambient-paused' : '')
      }
    >
      {['shop', 'detail', 'product', 'reveal', 'result'].includes(view) && (
        <div className="room-underlay">
          <ShopBackdrop />
        </div>
      )}
      <header className="topbar">
        <span className="brand">
          <span aria-hidden="true">✦</span> {t('brand')}
        </span>
        <div className="top-controls">
          <label className="sr-only" htmlFor="language">
            {t('language')}
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => {
              const choice = e.target.value as Language;
              if (stored) void preferences({ language: choice });
              else {
                pendingLanguage.current = choice;
                preferredLanguage.current = choice;
                setLanguage(choice);
              }
            }}
            disabled={busy}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
          <button
            className="icon-button"
            id="open-settings"
            aria-label={t('settings')}
            disabled={busy || view === 'reveal'}
            onClick={() => {
              settingsOrigin.current = view;
              go('settings');
            }}
          >
            <span aria-hidden="true">⚙</span>
          </button>
        </div>
      </header>
      <p className="storage-note">
        <span aria-hidden="true">◇</span> {stored ? t('local') : t('loading')}
      </p>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <main ref={main} aria-busy={busy}>
        {error && (
          <section role="alert" className="feedback error">
            <p>{errorText(language, error)}</p>
            <button onClick={() => void recover()} disabled={busy}>
              {t('retry')}
            </button>
          </section>
        )}
        {notice && (
          <p className="feedback" role="status">
            {notice}
          </p>
        )}
        {!stored && !error && <p className="loading">{t('loading')}</p>}
        {state && stored && (
          <>
            {view === 'alley' && (
              <>
                <div className="page-heading">
                  <p className="eyebrow">{t('eyebrow')}</p>
                  <h1 tabIndex={-1}>{t('alley')}</h1>
                  <p>{t('alleyIntro')}</p>
                </div>
                <figure className="alley-scene" ref={scene}>
                  <IllustratedAlley />
                  <span className="facade-name" aria-hidden="true">
                    Weasley
                  </span>
                  <button
                    id="enter-shop"
                    className="scene-enter primary"
                    onClick={() => {
                      alleyOrigin.current = 'enter-shop';
                      go('shop');
                    }}
                  >
                    {t('enter')} <span aria-hidden="true">→</span>
                  </button>
                </figure>
                <div className="art-footer">
                  <p className="art-caption">{t('placeholder')}</p>
                  <button
                    className="text-button"
                    onClick={() => void preferences({ ambient: !state.ambient })}
                  >
                    {state.ambient ? t('pauseAmbient') : t('resumeAmbient')}
                  </button>
                </div>
                <button
                  id="alley-album"
                  className="collection-link"
                  onClick={() => openAlbum('alley-album')}
                >
                  <span aria-hidden="true">▤</span> {t('toAlbum')}
                </button>
                <section className="shop-list">
                  <h2>{t('list')}</h2>
                  <p>{t('listIntro')}</p>
                  <button
                    id="list-shop"
                    className="shop-row"
                    onClick={() => {
                      alleyOrigin.current = 'list-shop';
                      go('shop');
                    }}
                  >
                    <span>
                      <strong>Weasley</strong>
                      <small>{t('available')}</small>
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>
                </section>
              </>
            )}
            {view === 'shop' && (
              <>
                <button
                  className="text-button back"
                  onClick={() => go('alley', alleyOrigin.current)}
                >
                  ← {t('backAlley')}
                </button>
                <div className="page-heading">
                  <p className="eyebrow">{t('available')}</p>
                  <h1 tabIndex={-1}>Weasley</h1>
                  <p>{t('shopChoose')}</p>
                </div>
                <Shop
                  onAlbum={() => openAlbum('shop-album')}
                  listOpen={productListOpen}
                  onListToggle={setProductListOpen}
                  state={state}
                  language={language}
                  identities={displayIdentities}
                  onFrog={(origin) => void inspect(origin)}
                  onInspect={(id, origin) => {
                    setProduct(id);
                    setProductOriginId(origin);
                    go('product');
                  }}
                />
              </>
            )}
            {view === 'product' && (
              <section className="product-detail">
                <button
                  id="product-back"
                  className="text-button back"
                  onClick={() => go('shop', productOriginId)}
                >
                  ← {t('backShop')}
                </button>
                <h1 tabIndex={-1}>
                  {product === 'beans'
                    ? t('beans')
                    : displayIdentities.find((i) => i.id === product)!.name[language]}
                </h1>
                {product === 'beans' ? (
                  <>
                    <ProductArtwork id="beans" />
                    <p className="art-caption">{t('placeholder')}</p>
                    <p className="guarantee">{t('beansDetail')}</p>
                  </>
                ) : (
                  <>
                    <div className="keepsake-card">
                      <IdentityDetails
                        identity={displayIdentities.find((i) => i.id === product)!}
                        state={state}
                        language={language}
                      />
                    </div>
                    <p className="guarantee">{t('inventionDetail')}</p>
                  </>
                )}
                <p className="fine-print">{t('consultNoSpend')}</p>
              </section>
            )}
            {view === 'detail' && (
              <>
                <button
                  className="text-button back"
                  disabled={busy}
                  onClick={() => go('shop', productOrigin.current)}
                >
                  ← {t('backShop')}
                </button>
                <div className="page-heading">
                  <p className="eyebrow">{t('welcome')}</p>
                  <h1 tabIndex={-1}>{t('frog')}</h1>
                </div>
                <IllustratedFrogBox />
                <p className="art-caption">{t('placeholder')}</p>
                <p className="guarantee">{t('newGuarantee')}</p>
                <p className="stock">
                  {t('stock')}: {frogAvailable(state) ? '1' : '0'}
                </p>
                <button
                  className="primary use-frog"
                  disabled={busy || !!error || !frogAvailable(state)}
                  onClick={() => void open()}
                >
                  {busy ? t('saving') : t('use')}
                </button>
                <p className="fine-print centered">{t('useInfo')}</p>
                {busy && <p role="status">{t('waiting')}</p>}
                {!frogAvailable(state) && (
                  <>
                    <p>{t('exhausted')}</p>
                    <button onClick={() => go('result')}>{t('viewResult')}</button>
                  </>
                )}
                <section className="odds">
                  <h2>{t('possible')}</h2>
                  <p className="version-note">
                    {t('table')} · v{stored.active.table.version} / {t('version')}{' '}
                    {stored.active.catalog.version}
                  </p>
                  <ul>
                    {stored.active.table.entries.map((e) => {
                      const i = stored.active.catalog.identities.find(
                        (i) => i.id === e.identityId,
                      )!;
                      return (
                        <li key={i.id}>
                          <div>
                            <strong>{i.name[language]}</strong>
                            <small>
                              {familyName(language, i.family)} ·{' '}
                              <Rarity identity={i} language={language} />
                            </small>
                          </div>
                          <span className="probability">
                            {percent(
                              language,
                              e.weight /
                                stored.active.table.entries.reduce((n, e) => n + e.weight, 0),
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="fine-print">{t('adaptation')}</p>
                </section>
              </>
            )}
            {view === 'reveal' && operation && (
              <section className="opening-view">
                <p className="eyebrow">{t('welcome')}</p>
                <h1 tabIndex={-1}>{t('opening')}</h1>
                <IllustratedFrogBox animate identity={operation.identity} />
                <p className="art-caption">{t('placeholder')}</p>
                <button className="primary" onClick={() => go('result')}>
                  {t('skip')}
                </button>
                <p className="fine-print">{t('local')}</p>
              </section>
            )}
            {view === 'result' && operation && (
              <section className="result-view">
                <p className="eyebrow">{operation.isNew ? t('new') : t('repeated')}</p>
                <h1 tabIndex={-1}>{t('result')}</h1>
                <div className="keepsake-card result-keepsake">
                  <IllustratedFrogBox settled identity={operation.identity} />
                  <IdentityDetails
                    identity={operation.identity}
                    state={state}
                    language={language}
                  />
                </div>
                <button
                  id="result-album"
                  className="primary"
                  onClick={() => openAlbum('result-album')}
                >
                  {t('toAlbum')} <span aria-hidden="true">→</span>
                </button>
                <button className="text-button" onClick={() => go('alley', alleyOrigin.current)}>
                  {t('backAlley')}
                </button>
              </section>
            )}
            {
              <div hidden={view !== 'album'}>
                <button
                  id="album-back"
                  className="text-button back"
                  onClick={() => go(albumOrigin.current.view, albumOrigin.current.focus)}
                >
                  ← {t('back')}
                </button>
                <Album
                  active={view === 'album'}
                  state={state}
                  language={language}
                  identities={displayIdentities}
                  onInspect={(id) => {
                    setSelected(id);
                    go('card');
                  }}
                />
                <button
                  id="album-to-alley"
                  className="text-button back"
                  onClick={() => go('alley', alleyOrigin.current)}
                >
                  {t('backAlley')}
                </button>
              </div>
            }
            {view === 'card' && card && (
              <>
                <button
                  className="text-button back"
                  onClick={() => go('album', 'identity-' + card.id)}
                >
                  ← {t('album')}
                </button>
                <h1 className="sr-only" tabIndex={-1}>
                  {t('details')}
                </h1>
                <div className="keepsake-card result-keepsake">
                  <IdentityDetails identity={card} state={state} language={language} />
                  {!copyCount(state, card.id) && <p>{t('pending')}</p>}
                </div>
              </>
            )}
            {view === 'settings' && (
              <>
                <button
                  className="text-button back"
                  onClick={() => go(settingsOrigin.current, 'open-settings')}
                >
                  ← {t('back')}
                </button>
                <div className="page-heading">
                  <h1 tabIndex={-1}>{t('settings')}</h1>
                </div>
                <section className="settings-section">
                  <h2>{t('local')}</h2>
                  <p>{t('localDetail')}</p>
                  <p className="fine-print">
                    {t('newRun')}: <span className="run-id">{state.runId}</span>
                  </p>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={state.reducedMotion}
                      onChange={(e) => void preferences({ reducedMotion: e.target.checked })}
                    />
                    {t('motion')}
                  </label>
                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={state.ambient}
                      onChange={(e) => void preferences({ ambient: e.target.checked })}
                    />
                    {t('ambient')}
                  </label>
                  <p className="fine-print">{t('noAudio')}</p>
                  <button onClick={() => void exportGame()}>{t('export')}</button>
                </section>
                <section className="settings-section">
                  <h2>{t('import')}</h2>
                  <label className="file-label">
                    {t('importFile')}
                    <input
                      type="file"
                      accept="application/json,.json"
                      onChange={(e) => void importFile(e)}
                    />
                  </label>
                  <label>
                    {t('paste')}
                    <textarea
                      value={json}
                      onChange={(e) => setJson(e.target.value)}
                      spellCheck={false}
                    />
                  </label>
                  <button disabled={!json.trim()} onClick={() => void reviewImport()}>
                    {t('previewImport')}
                  </button>
                </section>
                <section className="settings-section">
                  <button className="danger" onClick={() => void reset()}>
                    {t('reset')}
                  </button>
                  <p>{t('resetCaution')}</p>
                </section>
              </>
            )}
          </>
        )}
      </main>
      <footer className="demo-note">{t('demo')}</footer>
      <dialog
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault();
          if (!busy) setConfirmation(null);
        }}
        aria-labelledby="confirm-title"
      >
        <h2 id="confirm-title">
          {confirmation?.kind === 'reset' ? t('confirmReset') : t('confirmImport')}
        </h2>
        <p>{confirmation?.kind === 'reset' ? t('resetInfo') : t('importInfo')}</p>
        {confirmation?.data && (
          <p>{progressText(language, discoveryCount(confirmation.data.state))}</p>
        )}
        <div className="dialog-actions">
          <button autoFocus disabled={busy} onClick={() => setConfirmation(null)}>
            {t('cancel')}
          </button>
          <button className="primary" disabled={busy} onClick={() => void replace()}>
            {busy ? t('saving') : t('confirm')}
          </button>
        </div>
      </dialog>
    </div>
  );
}
