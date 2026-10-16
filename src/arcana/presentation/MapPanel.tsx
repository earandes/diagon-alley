import { regionAppearance } from './content-packs/active';
import { Artwork } from './Artwork';
import { ThreatBadge, tacticalText } from './TacticalBadge';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Run } from '../domain/exploration/run';
import type { Language } from '../domain/collection/wizards';
import type { NodeKind } from '../domain/exploration/route';
import { routeOptions } from '../application/client/read-models';
import { fitMapLayout } from './scenes/map-layout';
import { SceneCanvas } from './scenes/SceneCanvas';
import { text, type MessageKey } from './translations';
import './map-a60.css';
import { mapText } from './map-messages';
const nodeLabels: Record<NodeKind, MessageKey> = {
  duel: 'arcaneDuel',
  refuge: 'alchemyRefuge',
  chest: 'lootChest',
  pact: 'magicPact',
  encounter: 'chanceEncounter',
  boss: 'zoneBoss',
};
export function MapPanel({
  run,
  ready,
  language,
  onSelect,
}: {
  run: Run;
  ready: boolean;
  language: Language;
  onSelect: (id: string, origin: HTMLButtonElement) => void;
}) {
  const [list, setList] = useState(false),
    scroll = useRef<HTMLDivElement>(null),
    [size, setSize] = useState({ width: 390, height: 600 }),
    layout = useMemo(() => fitMapLayout(run.graph, size.width, size.height), [run.graph, size]),
    available = useMemo(() => routeOptions(run, run.graph), [run]);
  const horizontal = size.width > size.height * 1.3 || (size.height < 440 && size.width >= 368);
  const firstLayer = layout.nodes.filter((point) => point.node.row === 0);
  const firstPoint = firstLayer[0];
  const origin = {
    x: horizontal ? 26 : firstLayer.reduce((sum, point) => sum + point.x, 0) / firstLayer.length,
    y: horizontal
      ? Math.min(size.height - 22, (firstPoint?.y ?? size.height / 2) + 56)
      : size.height - 24,
  };
  const incomingChoices = layout.edges.filter(
    (edge) => available.includes(edge.to.id) && edge.from.id === run.visited.at(-1),
  );
  const originLabel = mapText(language, 'origin');
  const leader = run.members.find((member) => member.source === 'owned') ?? run.members[0];
  useLayoutEffect(() => {
    const host = scroll.current;
    if (!host || list) return;
    const measure = () => {
      const width = Math.round(host.clientWidth),
        height = Math.round(host.clientHeight);
      if (width >= 132 && height >= 132)
        setSize((previous) =>
          previous.width === width && previous.height === height ? previous : { width, height },
        );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    measure();
    return () => observer.disconnect();
  }, [list]);
  const button = (id: string, kind: NodeKind) => {
    const plan = run.campaignSnapshot?.nodes.find((candidate) => candidate.nodeId === id);
    const threat = plan?.kind === 'duel' ? plan.threat : undefined;
    const label = text(language, nodeLabels[kind]);
    return (
      <button
        key={id}
        className="map-event-medallion"
        title={
          threat
            ? `${label} · ${tacticalText(language, threat === 'fire' ? 'fireThreat' : 'vanguard')}`
            : label
        }
        data-node={id}
        data-node-kind={kind}
        data-node-state={
          run.visited.includes(id) ? 'visited' : available.includes(id) ? 'available' : 'locked'
        }
        disabled={!ready || !available.includes(id)}
        onClick={(event) => onSelect(id, event.currentTarget)}
      >
        <span className="node-asset" aria-hidden="true">
          <Artwork asset={`node.${kind}`} language={language} className="node-icon" decorative />
        </span>
        {threat && <ThreatBadge threat={threat} language={language} compact />}
        {run.visited.includes(id) && (
          <span className="node-visited-mark" aria-hidden="true">
            ✓
          </span>
        )}
        {available.includes(id) && (
          <span className="node-ready-mark" aria-hidden="true">
            ▴
          </span>
        )}
        <strong className="node-label">{text(language, nodeLabels[kind])}</strong>
        <small className="visually-hidden">
          {text(
            language,
            run.visited.includes(id) ? 'visited' : available.includes(id) ? 'available' : 'locked',
          )}
        </small>
        {available.includes(id) && (
          <small className="node-effect visually-hidden">
            {text(
              language,
              kind === 'duel' || kind === 'boss'
                ? 'nodeCombatCost'
                : kind === 'refuge'
                  ? 'nodeRefugeHint'
                  : kind === 'pact'
                    ? 'nodePactHint'
                    : kind === 'chest'
                      ? 'nodeChestHint'
                      : 'nodeChanceHint',
            )}
          </small>
        )}
      </button>
    );
  };
  return (
    <>
      <button
        className="map-view-toggle"
        aria-label={text(language, list ? 'viewMap' : 'viewNodeList')}
        title={text(language, list ? 'viewMap' : 'viewNodeList')}
        onClick={() => setList((v) => !v)}
      >
        <Artwork asset={list ? 'ui.map' : 'ui.missions'} language={language} decorative />
        <span className="visually-hidden">{text(language, list ? 'viewMap' : 'viewNodeList')}</span>
      </button>
      {list ? (
        <div className="route-list">
          {[...run.graph.nodes].reverse().map((n) => button(n.id, n.kind))}
        </div>
      ) : (
        <div className="map-scroll" ref={scroll}>
          <div
            className="branch-map"
            data-region={run.zoneId}
            data-map-axis={horizontal ? 'horizontal' : 'vertical'}
            style={{ height: layout.height }}
          >
            <Artwork
              asset={regionAppearance(run.zoneId, language).mapAsset}
              language={language}
              className="region-map-art"
              decorative
              eager
            />
            <div className="region-map-shade" aria-hidden="true" />
            <SceneCanvas
              data={{ kind: 'map', layout, visited: run.visited, available }}
              language={language}
            />
            <svg
              className="map-origin-trail"
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              {incomingChoices.map(({ from, to }) => (
                <g key={`${from.id}:${to.id}`}>
                  <path
                    className="map-choice-trail-bed"
                    d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                  />
                  <path
                    className="map-choice-trail"
                    d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                  />
                </g>
              ))}
              {firstLayer.map((point) => (
                <path key={point.id} d={`M ${origin.x} ${origin.y} L ${point.x} ${point.y}`} />
              ))}
            </svg>
            <div
              className="map-origin"
              data-map-origin="true"
              title={originLabel}
              style={{ left: `${(origin.x / layout.width) * 100}%`, top: origin.y }}
            >
              <Artwork
                asset={`character.${leader.unit.wizardId}.portrait`}
                language={language}
                className="map-origin-portrait"
                eager
                decorative
              />
              <span className="map-origin-footprint" aria-hidden="true">
                ⌂
              </span>
              <span className="map-origin-label">{originLabel}</span>
            </div>
            {layout.nodes.map((point) => (
              <div
                key={point.id}
                className="map-node"
                style={{ left: `${(point.x / layout.width) * 100}%`, top: point.y }}
              >
                {button(point.id, point.node.kind)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
