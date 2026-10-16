import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';
import type { RunMember } from './run';

export interface EncounterTradeOption {
  readonly id: string;
  readonly scope: 'unit' | 'team';
  readonly restore: 'hp' | 'mana';
  readonly fraction: number;
  readonly costFraction: number;
}
export interface EncounterOffer {
  readonly id: string;
  readonly npcId: string;
  readonly kind: 'healer' | 'scholar';
  readonly options: readonly EncounterTradeOption[];
}
export interface TradeVital {
  readonly unitId: string;
  readonly beforeHp: number;
  readonly afterHp: number;
  readonly beforeMana: number;
  readonly afterMana: number;
}
export interface EncounterTradeResolution {
  readonly offer: EncounterOffer;
  readonly choiceId: string;
  readonly unitId?: string;
  readonly vitals: readonly TradeVital[];
}
export function encounterOfferSnapshot(value: unknown): EncounterOffer {
  const offer = value as EncounterOffer;
  if (
    !offer ||
    !validDomainId(offer.id) ||
    !validDomainId(offer.npcId) ||
    !['healer', 'scholar'].includes(offer.kind) ||
    !Array.isArray(offer.options) ||
    offer.options.length !== 2 ||
    new Set(offer.options.map((o) => o.id)).size !== 2
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  const options = offer.options.map((option) => {
    if (
      !option ||
      !validDomainId(option.id) ||
      !['unit', 'team'].includes(option.scope) ||
      !['hp', 'mana'].includes(option.restore) ||
      option.restore !== (offer.kind === 'healer' ? 'hp' : 'mana') ||
      [option.fraction, option.costFraction].some((n) => !Number.isFinite(n) || n <= 0 || n > 1)
    )
      throw new ArcanaError('INVALID_CAMPAIGN');
    return Object.freeze({
      id: option.id,
      scope: option.scope,
      restore: option.restore,
      fraction: option.fraction,
      costFraction: option.costFraction,
    });
  });
  return Object.freeze({
    id: offer.id,
    npcId: offer.npcId,
    kind: offer.kind,
    options: Object.freeze(options),
  });
}
/** Pure shared projection. A failed trade returns the original condition and never charges. */
export function previewEncounterTrade(
  members: readonly RunMember[],
  raw: EncounterOffer,
  choiceId?: string,
  unitId?: string,
) {
  const offer = encounterOfferSnapshot(raw),
    option = offer.options.find((o) => o.id === choiceId);
  const result = (
    next: readonly RunMember[],
    reason?: 'choose-option' | 'choose-unit' | 'insufficient-condition' | 'no-benefit',
  ) =>
    Object.freeze({
      eligible: !reason,
      ...(reason ? { reason } : {}),
      members: next,
      vitals: Object.freeze(
        members.map((m, i) =>
          Object.freeze({
            unitId: m.unit.id,
            beforeHp: m.unit.hp,
            afterHp: next[i].unit.hp,
            beforeMana: m.unit.mana,
            afterMana: next[i].unit.mana,
          }),
        ),
      ),
    });
  if (!option) return result(members, 'choose-option');
  if (option.scope === 'unit' && !members.some((m) => m.unit.id === unitId && m.unit.hp > 0))
    return result(members, 'choose-unit');
  if (option.scope === 'team' && unitId !== undefined) return result(members, 'choose-unit');
  let changed = false,
    insufficient = false;
  const next = members.map((member) => {
    const u = member.unit;
    if (u.hp <= 0 || (option.scope === 'unit' && u.id !== unitId)) return member;
    const restore = option.restore,
      cost = restore === 'hp' ? 'mana' : 'hp';
    const maximum = restore === 'hp' ? u.maxHp : u.maxMana,
      costMaximum = cost === 'hp' ? u.maxHp : u.maxMana;
    const after = Math.min(maximum, u[restore] + maximum * option.fraction);
    // Group trades do not charge a member who receives no benefit.
    if (after === u[restore]) return member;
    const remaining = u[cost] - costMaximum * option.costFraction;
    if (remaining < 0 || (cost === 'hp' && remaining <= 0)) {
      insufficient = true;
      return member;
    }
    changed = true;
    return { ...member, unit: { ...u, [restore]: after, [cost]: remaining } };
  });
  if (insufficient) return result(members, 'insufficient-condition');
  if (!changed) return result(members, 'no-benefit');
  return result(
    Object.freeze(next.map((m) => Object.freeze({ ...m, unit: Object.freeze({ ...m.unit }) }))),
  );
}
/** Reconstruct before condition and verify persisted effects without repeating the operation. */
export function encounterTradeSnapshot(
  value: unknown,
  members: readonly RunMember[],
): EncounterTradeResolution {
  const trade = value as EncounterTradeResolution;
  if (!trade || !Array.isArray(trade.vitals) || trade.vitals.length !== members.length)
    throw new ArcanaError('INVALID_CAMPAIGN');
  const offer = encounterOfferSnapshot(trade.offer);
  const before = members.map((m, i) => {
    const v = trade.vitals[i];
    if (
      !v ||
      v.unitId !== m.unit.id ||
      v.afterHp !== m.unit.hp ||
      v.afterMana !== m.unit.mana ||
      !Number.isFinite(v.beforeHp) ||
      v.beforeHp < 0 ||
      v.beforeHp > m.unit.maxHp ||
      !Number.isFinite(v.beforeMana) ||
      v.beforeMana < 0 ||
      v.beforeMana > m.unit.maxMana
    )
      throw new ArcanaError('INVALID_CAMPAIGN');
    return { ...m, unit: { ...m.unit, hp: v.beforeHp, mana: v.beforeMana } };
  });
  const projected = previewEncounterTrade(before, offer, trade.choiceId, trade.unitId);
  if (
    !projected.eligible ||
    projected.members.some(
      (m, i) => m.unit.hp !== members[i].unit.hp || m.unit.mana !== members[i].unit.mana,
    )
  )
    throw new ArcanaError('INVALID_CAMPAIGN');
  return Object.freeze({
    offer,
    choiceId: trade.choiceId,
    ...(trade.unitId ? { unitId: trade.unitId } : {}),
    vitals: projected.vitals,
  });
}
