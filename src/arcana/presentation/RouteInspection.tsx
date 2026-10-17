import { useEffect, useRef } from 'react';
import type { Language } from '../domain/collection/wizards';
import type { NodeKind } from '../domain/exploration/route';
import type { PublicRouteInspection, PublicRouteNode } from './route-inspection';
import { Artwork } from './Artwork';
import { ThreatBadge } from './TacticalBadge';
import { text, type MessageKey } from './translations';
import { mapText } from './map-messages';
import { mapSettingsText as message } from './map-settings-messages';
import './map-settings-a75.css';
export const nodeMessageKeys: Record<NodeKind, MessageKey> = {
  duel: 'arcaneDuel',
  refuge: 'alchemyRefuge',
  chest: 'lootChest',
  pact: 'magicPact',
  encounter: 'chanceEncounter',
  boss: 'zoneBoss',
};
export const routeNodeName = (node: PublicRouteNode, language: Language) =>
  message(language, 'nodeName', {
    name: text(language, nodeMessageKeys[node.kind]),
    ...node.position,
  });

/** This component has no command callback: every control only changes the inspected public node. */
export function RouteInspection({
  node,
  language,
  onInspect,
  onClose,
}: {
  node: PublicRouteInspection;
  language: Language;
  onInspect: (id: string) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    close = useRef<HTMLButtonElement>(null),
    heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    element.showModal();
    close.current?.focus();
    return () => {
      if (element.open) element.close();
    };
  }, []);
  useEffect(() => {
    heading.current?.focus();
  }, [node.id]);
  const relation = (nodes: readonly PublicRouteNode[]) =>
    nodes.map((related) => (
      <button key={related.id} type="button" onClick={() => onInspect(related.id)}>
        <Artwork asset={`node.${related.kind}`} language={language} decorative />
        <span>{routeNodeName(related, language)}</span>
      </button>
    ));
  return (
    <dialog
      ref={dialog}
      className="route-inspection"
      aria-label={message(language, 'inspection')}
      data-route-inspection={node.id}
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
    >
      <button ref={close} type="button" className="route-inspection-close" onClick={onClose}>
        {text(language, 'close')}
      </button>
      <header>
        <Artwork
          asset={`node.${node.kind}`}
          language={language}
          className="route-inspection-figure"
          decorative
        />
        <h2 ref={heading} tabIndex={-1} aria-label={routeNodeName(node, language)}>
          {text(language, nodeMessageKeys[node.kind])}
        </h2>
        <p>{message(language, 'position', { ...node.position })}</p>
        <strong>{text(language, node.state)}</strong>
      </header>
      {node.threat && <ThreatBadge threat={node.threat} language={language} />}
      <p>
        {text(
          language,
          node.kind === 'boss' || node.kind === 'duel'
            ? 'nodeCombatCost'
            : node.kind === 'refuge'
              ? 'nodeRefugeHint'
              : node.kind === 'pact'
                ? 'nodePactHint'
                : node.kind === 'chest'
                  ? 'nodeChestHint'
                  : 'nodeChanceHint',
        )}
      </p>
      {node.state !== 'available' && (
        <p>{message(language, node.state === 'visited' ? 'visitedHelp' : 'lockedHelp')}</p>
      )}
      <section className="route-inspection-relations" aria-label={message(language, 'from')}>
        <h3>{message(language, 'from')}</h3>
        {node.from.length ? relation(node.from) : <p>{mapText(language, 'origin')}</p>}
      </section>
      <section className="route-inspection-relations" aria-label={message(language, 'to')}>
        <h3>{message(language, 'to')}</h3>
        {node.to.length ? relation(node.to) : <p>{message(language, 'end')}</p>}
      </section>
      <small>{message(language, 'readOnly')}</small>
    </dialog>
  );
}
