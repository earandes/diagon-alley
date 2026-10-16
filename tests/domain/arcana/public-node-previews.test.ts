import { expect, it } from 'vitest';
import {
  projectPublicContent,
  publicContentSnapshot,
} from '../../../src/arcana/application/public-content';
import { trialConfiguration } from '../../../src/arcana/infrastructure/content/trial-configuration';
it('publishes immutable previews from real plans, strips nested authority metadata and supports old public payloads', () => {
  const { opening, campaign } = trialConfiguration();
  const nodes = campaign.nodes.map((n) => ({ ...n, privateCallback: () => 42 }));
  const value = projectPublicContent(opening, { ...campaign, nodes });
  expect(value.campaign.nodes).toHaveLength(16);
  expect(JSON.stringify(value)).not.toContain('privateCallback');
  for (const plan of value.campaign.nodes!) {
    expect(Object.isFrozen(plan)).toBe(true);
    if (plan.kind === 'pact') expect(Object.isFrozen(plan.recruit)).toBe(true);
  }
  expect(
    publicContentSnapshot({
      ...value,
      campaign: {
        version: campaign.version,
        zoneId: campaign.zoneId,
        nextZoneId: campaign.nextZoneId,
        graph: campaign.graph,
      },
    }).campaign.nodes,
  ).toBeUndefined();
  const corrupted = structuredClone(value);
  (corrupted.campaign.nodes![0] as { kind: string }).kind = 'boss';
  expect(() => publicContentSnapshot(corrupted)).toThrow();
});
