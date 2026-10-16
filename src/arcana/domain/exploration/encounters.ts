import { ArcanaError } from '../errors';
import { unitSnapshot } from '../combat/engine';
import { NO_REWARD, validateReward, type Reward } from '../economy/rewards';
import { healRun, type RunMember } from './run';
import type { EncounterChoice, EncounterEffect, EncounterNarrative } from './nodes';

export interface EncounterResolution {
  readonly effect: EncounterEffect;
  readonly narrative?: EncounterNarrative;
  readonly vitals: readonly {
    readonly unitId: string;
    readonly beforeHp: number;
    readonly afterHp: number;
  }[];
}
/** Project only versioned public narrative and validated mechanics, never authority metadata. */
export function encounterChoiceSnapshot(value: unknown): EncounterChoice {
  const choice = value as EncounterChoice;
  if (!choice || !Number.isSafeInteger(choice.weight) || choice.weight <= 0 || !choice.effect)
    throw new ArcanaError('INVALID_CAMPAIGN');
  let effect: EncounterEffect;
  if (choice.effect.kind === 'reward') {
    validateReward(choice.effect.reward);
    const reward = choice.effect.reward;
    effect = Object.freeze({
      kind: 'reward',
      reward: Object.freeze({
        crowns: reward.crowns,
        goldKeys: reward.goldKeys,
        products: Object.freeze([...reward.products]),
      }),
    });
  } else {
    if (
      !['heal', 'damage'].includes(choice.effect.kind) ||
      !Number.isFinite(choice.effect.fraction) ||
      choice.effect.fraction < 0 ||
      choice.effect.fraction > 1
    )
      throw new ArcanaError('INVALID_CAMPAIGN');
    effect = Object.freeze({ kind: choice.effect.kind, fraction: choice.effect.fraction });
  }
  const narrative = choice.narrative;
  if (
    narrative !== undefined &&
    (!narrative ||
      !Number.isSafeInteger(narrative.version) ||
      narrative.version < 1 ||
      !narrative.text ||
      ['es', 'en'].some((language) => {
        const message = narrative.text[language as 'es' | 'en'];
        return typeof message !== 'string' || !message.trim() || message.length > 2000;
      }))
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  return Object.freeze({
    weight: choice.weight,
    effect,
    ...(narrative === undefined
      ? {}
      : {
          narrative: Object.freeze({
            version: narrative.version,
            text: Object.freeze({ es: narrative.text.es, en: narrative.text.en }),
          }),
        }),
  });
}
export function resolveEncounter(members: readonly RunMember[], choice: EncounterChoice) {
  const snapshot = encounterChoiceSnapshot(choice),
    effect = snapshot.effect;
  const next =
    effect.kind === 'heal'
      ? healRun(members, effect.fraction)
      : effect.kind === 'damage'
        ? members.map((member) => ({
            ...member,
            unit: {
              ...member.unit,
              hp: Math.max(0, member.unit.hp - member.unit.maxHp * effect.fraction),
            },
          }))
        : members;
  const frozen = Object.freeze(
    next.map((member) => Object.freeze({ source: member.source, unit: unitSnapshot(member.unit) })),
  );
  const resolution: EncounterResolution = Object.freeze({
    effect,
    ...(snapshot.narrative ? { narrative: snapshot.narrative } : {}),
    vitals: Object.freeze(
      members.map((member, index) =>
        Object.freeze({
          unitId: member.unit.id,
          beforeHp: member.unit.hp,
          afterHp: frozen[index].unit.hp,
        }),
      ),
    ),
  });
  return Object.freeze({
    members: frozen,
    reward: effect.kind === 'reward' ? effect.reward : NO_REWARD,
    resolution,
  });
}
/** Verify persisted diagnostics through the same effect service, including JSONB key-order independence. */
export function encounterResolutionSnapshot(
  value: unknown,
  members: readonly RunMember[],
  reward: Reward,
): EncounterResolution {
  const resolution = value as EncounterResolution;
  if (
    !resolution ||
    !Array.isArray(resolution.vitals) ||
    resolution.vitals.length !== members.length
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  const before = members.map((member, index) => {
    const vital = resolution.vitals[index];
    if (
      !vital ||
      vital.unitId !== member.unit.id ||
      !Number.isFinite(vital.beforeHp) ||
      vital.beforeHp < 0 ||
      vital.beforeHp > member.unit.maxHp ||
      vital.afterHp !== member.unit.hp
    )
      throw new ArcanaError('INVALID_CAMPAIGN');
    return { ...member, unit: { ...member.unit, hp: vital.beforeHp } };
  });
  const resolved = resolveEncounter(before, {
    weight: 1,
    effect: resolution.effect,
    ...(resolution.narrative === undefined ? {} : { narrative: resolution.narrative }),
  });
  if (
    resolved.members.some((member, index) => member.unit.hp !== members[index].unit.hp) ||
    resolved.reward.crowns !== reward.crowns ||
    resolved.reward.goldKeys !== reward.goldKeys ||
    resolved.reward.products.length !== reward.products.length ||
    resolved.reward.products.some((product, index) => product !== reward.products[index])
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  return resolved.resolution;
}
