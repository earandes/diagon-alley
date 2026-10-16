import { ArcanaError } from '../errors';
import type { RandomTickets } from './random';

export type BeanFlavour = 'mint' | 'pepper' | 'earth' | 'soap';
export interface BeanEffect {
  readonly flavour: BeanFlavour;
  readonly turnsRemaining: number;
  readonly firstSpellPending: boolean;
}
export interface BeanCarrier {
  readonly hp: number;
  readonly maxHp: number;
  readonly effect: BeanEffect | null;
}
export interface BeanTable {
  readonly version: number;
  readonly entries: readonly { readonly flavour: BeanFlavour; readonly weight: number }[];
}
export const BEAN_FLAVOURS: readonly BeanFlavour[] = Object.freeze([
  'mint',
  'pepper',
  'earth',
  'soap',
]);

function validateCarrier(carrier: BeanCarrier): void {
  const effect = carrier.effect;
  if (
    !Number.isFinite(carrier.hp) ||
    !Number.isFinite(carrier.maxHp) ||
    carrier.maxHp <= 0 ||
    carrier.hp < 0 ||
    carrier.hp > carrier.maxHp ||
    (effect &&
      (!BEAN_FLAVOURS.includes(effect.flavour) ||
        !Number.isInteger(effect.turnsRemaining) ||
        effect.turnsRemaining < 0 ||
        effect.turnsRemaining > 2 ||
        typeof effect.firstSpellPending !== 'boolean' ||
        (!['earth', 'pepper'].includes(effect.flavour) && effect.turnsRemaining !== 0) ||
        (effect.flavour === 'pepper' && effect.turnsRemaining > 1) ||
        (effect.flavour !== 'soap' && effect.firstSpellPending)))
  )
    throw new ArcanaError('INVALID_COMBATANT');
}

function snapshot(carrier: BeanCarrier): BeanCarrier {
  return Object.freeze({
    ...carrier,
    effect: carrier.effect && Object.freeze({ ...carrier.effect }),
  });
}

export function activateBean(carrier: BeanCarrier, flavour: BeanFlavour): BeanCarrier {
  validateCarrier(carrier);
  if (!BEAN_FLAVOURS.includes(flavour)) throw new ArcanaError('INVALID_BEAN_TABLE');
  if (carrier.effect) throw new ArcanaError('BEAN_ALREADY_ACTIVE');
  return snapshot({
    ...carrier,
    hp:
      flavour === 'mint' ? Math.min(carrier.maxHp, carrier.hp + carrier.maxHp * 0.25) : carrier.hp,
    effect: {
      flavour,
      turnsRemaining: flavour === 'earth' ? 2 : flavour === 'pepper' ? 1 : 0,
      firstSpellPending: flavour === 'soap',
    },
  });
}

export function initiativeWithBean(carrier: BeanCarrier, baseInitiative: number): number {
  validateCarrier(carrier);
  if (!Number.isFinite(baseInitiative) || baseInitiative < 0)
    throw new ArcanaError('INVALID_INITIATIVE');
  return carrier.effect?.flavour === 'earth' && carrier.effect.turnsRemaining > 0
    ? baseInitiative * 0.85
    : baseInitiative;
}

export function spellWithBean(
  carrier: BeanCarrier,
  baseDamage: number,
): {
  readonly carrier: BeanCarrier;
  readonly damage: number;
  readonly missed: boolean;
} {
  validateCarrier(carrier);
  if (!Number.isFinite(baseDamage) || baseDamage < 0) throw new ArcanaError('INVALID_DAMAGE');
  const pending = carrier.effect?.firstSpellPending;
  const missed = !!pending && carrier.effect?.flavour === 'soap';
  const damage = missed
    ? 0
    : carrier.effect?.flavour === 'pepper' && carrier.effect.turnsRemaining > 0
      ? baseDamage * 1.3
      : baseDamage;
  if (!Number.isFinite(damage)) throw new ArcanaError('INVALID_DAMAGE');
  return Object.freeze({
    carrier: snapshot({
      ...carrier,
      effect: carrier.effect && { ...carrier.effect, firstSpellPending: false },
    }),
    damage,
    missed,
  });
}

export function finishTurn(carrier: BeanCarrier): BeanCarrier {
  validateCarrier(carrier);
  return snapshot({
    ...carrier,
    effect: carrier.effect && {
      ...carrier.effect,
      turnsRemaining: Math.max(0, carrier.effect.turnsRemaining - 1),
    },
  });
}

export function validateBeanTable(table: BeanTable): number {
  if (
    !Number.isSafeInteger(table.version) ||
    table.version < 1 ||
    !Array.isArray(table.entries) ||
    !table.entries.length ||
    new Set(table.entries.map((entry) => entry.flavour)).size !== table.entries.length ||
    table.entries.some(
      (entry) =>
        !BEAN_FLAVOURS.includes(entry.flavour) ||
        !Number.isSafeInteger(entry.weight) ||
        entry.weight < 1,
    )
  )
    throw new ArcanaError('INVALID_BEAN_TABLE');
  const total = table.entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (!Number.isSafeInteger(total) || total > 0x100000000)
    throw new ArcanaError('INVALID_BEAN_TABLE');
  return total;
}

export function drawBean(table: BeanTable, random: RandomTickets): BeanFlavour {
  const total = validateBeanTable(table);
  const ticket = random.ticket(total);
  if (!Number.isSafeInteger(ticket) || ticket < 0 || ticket >= total)
    throw new ArcanaError('INVALID_RANDOM_TICKET');
  let cumulative = 0;
  for (const entry of table.entries) {
    cumulative += entry.weight;
    if (ticket < cumulative) return entry.flavour;
  }
  throw new ArcanaError('INVALID_BEAN_TABLE');
}
