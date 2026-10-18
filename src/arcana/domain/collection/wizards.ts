import type { RandomTickets } from '../combat/random';
import { ArcanaError } from '../errors';
import { validDomainId } from '../identifiers';

import type { Rarity } from './rarity';
import { traitsSnapshot, type WizardTraits } from './traits';
export type Language = 'es' | 'en';
export type StarCount = 1 | 2 | 3 | 4 | 5;
export type Localized = Readonly<Record<Language, string>>;
export interface WizardStats {
  readonly maxHp: number;
  readonly maxMana: number;
  readonly power: number;
  readonly speed: number;
}
export interface WizardDefinition {
  readonly traits?: WizardTraits;
  readonly id: string;
  readonly rarity: Rarity;
  /** Absent in historical snapshots; never infer a prior rating from current content. */
  readonly stars?: StarCount;
  /** Instance-only cosmetic provenance. Catalog entries remain undecorated. Legacy is normal. */
  readonly finish?: { readonly id: 'enchanted'; readonly version: 1 };
  readonly name: Localized;
  readonly context: Localized;
  readonly stats: WizardStats;
}
export interface WizardCatalog {
  readonly version: number;
  readonly wizards: readonly WizardDefinition[];
}
export interface OwnedWizard {
  readonly copyId: string;
  readonly wizard: WizardDefinition;
  readonly catalogVersion: number;
  readonly sourceId: string;
  readonly origin: 'starter' | 'toad';
}
export interface ToadTable {
  readonly version: number;
  readonly catalogVersion: number;
  readonly finish?: { readonly version: 1; readonly enchanted: number; readonly total: number };
  readonly entries: readonly { readonly wizardId: string; readonly weight: number }[];
}

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);
const version = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
const text = (value: unknown): value is string =>
  typeof value === 'string' && !!value.trim() && value.length <= 2000;
const localized = (value: unknown) => record(value) && text(value.es) && text(value.en);
const stat = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

export function validateCatalog(value: unknown): asserts value is WizardCatalog {
  if (
    !record(value) ||
    !version(value.version) ||
    !Array.isArray(value.wizards) ||
    !value.wizards.length ||
    value.wizards.length > 1000
  )
    throw new ArcanaError('INVALID_CATALOG');
  const ids = new Set<string>();
  for (const wizard of value.wizards) {
    if (
      !record(wizard) ||
      !validDomainId(wizard.id) ||
      ids.has(wizard.id) ||
      typeof wizard.rarity !== 'string' ||
      !['common', 'unusual', 'epic', 'arcane-legendary'].includes(wizard.rarity) ||
      (wizard.stars !== undefined &&
        (!Number.isInteger(wizard.stars) ||
          typeof wizard.stars !== 'number' ||
          wizard.stars < 1 ||
          wizard.stars > 5)) ||
      (wizard.finish !== undefined &&
        (!record(wizard.finish) ||
          wizard.finish.id !== 'enchanted' ||
          wizard.finish.version !== 1)) ||
      !localized(wizard.name) ||
      !localized(wizard.context) ||
      !record(wizard.stats) ||
      !stat(wizard.stats.maxHp) ||
      wizard.stats.maxHp <= 0 ||
      !stat(wizard.stats.maxMana) ||
      !stat(wizard.stats.power) ||
      !stat(wizard.stats.speed)
    )
      throw new ArcanaError('INVALID_CATALOG');
    ids.add(wizard.id);
    if (wizard.traits !== undefined) traitsSnapshot(wizard.traits as WizardTraits);
  }
}

export function validateToadTable(
  catalog: WizardCatalog,
  value: unknown,
): asserts value is ToadTable {
  validateCatalog(catalog);
  if (
    !record(value) ||
    !version(value.version) ||
    value.catalogVersion !== catalog.version ||
    !Array.isArray(value.entries) ||
    !value.entries.length ||
    value.entries.length > catalog.wizards.length
  )
    throw new ArcanaError('INVALID_TOAD_TABLE');
  const ids = new Set<string>();
  let total = 0;
  if (
    value.finish !== undefined &&
    (!record(value.finish) ||
      value.finish.version !== 1 ||
      !version(value.finish.total) ||
      value.finish.total > 0x100000000 ||
      !Number.isSafeInteger(value.finish.enchanted) ||
      typeof value.finish.enchanted !== 'number' ||
      value.finish.enchanted < 1 ||
      value.finish.enchanted >= value.finish.total)
  )
    throw new ArcanaError('INVALID_TOAD_TABLE');
  if (catalog.wizards.some((w) => w.finish !== undefined))
    throw new ArcanaError('INVALID_TOAD_TABLE');
  for (const entry of value.entries) {
    if (
      !record(entry) ||
      !validDomainId(entry.wizardId) ||
      ids.has(entry.wizardId) ||
      !catalog.wizards.some((wizard) => wizard.id === entry.wizardId) ||
      !version(entry.weight)
    )
      throw new ArcanaError('INVALID_TOAD_TABLE');
    ids.add(entry.wizardId);
    total += entry.weight;
  }
  if (!Number.isSafeInteger(total) || total > 0x100000000)
    throw new ArcanaError('INVALID_TOAD_TABLE');
}

export function wizardSnapshot(wizard: WizardDefinition): WizardDefinition {
  return Object.freeze({
    id: wizard.id,
    rarity: wizard.rarity,
    ...(wizard.stars === undefined ? {} : { stars: wizard.stars }),
    ...(wizard.finish === undefined
      ? {}
      : { finish: Object.freeze({ id: wizard.finish.id, version: wizard.finish.version }) }),
    ...(wizard.traits ? { traits: traitsSnapshot(wizard.traits) } : {}),
    name: Object.freeze({ es: wizard.name.es, en: wizard.name.en }),
    context: Object.freeze({ es: wizard.context.es, en: wizard.context.en }),
    stats: Object.freeze({
      maxHp: wizard.stats.maxHp,
      maxMana: wizard.stats.maxMana,
      power: wizard.stats.power,
      speed: wizard.stats.speed,
    }),
  });
}

export function acquireWizard(
  copies: readonly OwnedWizard[],
  copyId: string,
  wizard: WizardDefinition,
  catalogVersion: number,
  sourceId: string,
  origin: OwnedWizard['origin'],
): readonly OwnedWizard[] {
  validateCatalog({ version: catalogVersion, wizards: [wizard] });
  if (!validDomainId(copyId) || !validDomainId(sourceId) || !['starter', 'toad'].includes(origin))
    throw new ArcanaError('INVALID_COPY');
  if (copies.some((copy) => copy.copyId === copyId)) throw new ArcanaError('DUPLICATE_COPY');
  return Object.freeze([
    ...copies,
    Object.freeze({ copyId, wizard: wizardSnapshot(wizard), catalogVersion, sourceId, origin }),
  ]);
}

export function countDiscoveries(copies: readonly OwnedWizard[]): number {
  return new Set(copies.map((copy) => copy.wizard.id)).size;
}

export function drawWizard(
  catalog: WizardCatalog,
  table: ToadTable,
  random: RandomTickets,
): WizardDefinition {
  validateToadTable(catalog, table);
  const total = table.entries.reduce((sum, entry) => sum + entry.weight, 0);
  const ticket = random.ticket(total);
  if (!Number.isSafeInteger(ticket) || ticket < 0 || ticket >= total)
    throw new ArcanaError('INVALID_RANDOM_TICKET');
  let cumulative = 0;
  for (const entry of table.entries) {
    cumulative += entry.weight;
    if (ticket < cumulative) {
      const wizard = catalog.wizards.find((wizard) => wizard.id === entry.wizardId)!;
      if (!table.finish) return wizardSnapshot(wizard);
      const finish = random.ticket(table.finish.total);
      if (!Number.isSafeInteger(finish) || finish < 0 || finish >= table.finish.total)
        throw new ArcanaError('INVALID_RANDOM_TICKET');
      return wizardSnapshot({
        ...wizard,
        ...(finish < table.finish.enchanted
          ? { finish: { id: 'enchanted' as const, version: table.finish.version } }
          : {}),
      });
    }
  }
  throw new ArcanaError('INVALID_TOAD_TABLE');
}
