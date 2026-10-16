import type { NodeReceipt } from '../application/run-contracts';
import type { Run } from '../domain/exploration/run';

/** Only persisted before/after data, never reverse a percentage or recompute a saved effect. */
export function recordedNodeChanges(receipt: NodeReceipt, previous?: Run) {
  if (receipt.encounter?.trade) return receipt.encounter.trade.vitals;
  if (receipt.encounter?.resolution)
    return receipt.encounter.resolution.vitals.map((vital) => ({
      ...vital,
      beforeMana: undefined,
      afterMana: undefined,
    }));
  const kind = receipt.run.graph.nodes.find((node) => node.id === receipt.request.nodeId)?.kind;
  if (
    kind !== 'refuge' ||
    !previous ||
    previous.id !== receipt.run.id ||
    previous.visited.length + 1 !== receipt.run.visited.length ||
    previous.visited.some((id, i) => receipt.run.visited[i] !== id)
  )
    return [];
  return receipt.run.members.flatMap(({ unit }) => {
    const before = previous.members.find((member) => member.unit.id === unit.id)?.unit;
    return before
      ? [
          {
            unitId: unit.id,
            beforeHp: before.hp,
            afterHp: unit.hp,
            beforeMana: before.mana,
            afterMana: unit.mana,
          },
        ]
      : [];
  });
}

export function confirmedRecruit(receipt: NodeReceipt) {
  if (receipt.request.pactAction === 'pass') return undefined;
  const plan = receipt.run.campaignSnapshot?.nodes.find(
    (node) => node.nodeId === receipt.request.nodeId,
  );
  const recruitId =
    receipt.request.recruitId ?? (plan?.kind === 'pact' ? plan.recruit?.id : undefined);
  return receipt.run.members.find(
    (member) => member.source === 'temporary' && member.unit.id === recruitId,
  );
}
