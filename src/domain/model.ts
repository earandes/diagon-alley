export type Language = 'es' | 'en';
export type Family = 'person' | 'object' | 'flavour';
export type RarityId = 'R01' | 'R02' | 'R03';
export type Localized = Record<Language, string>;
export interface Identity {
  id: string;
  family: Family;
  rarityId: RarityId;
  name: Localized;
  context: Localized;
  assetId: string;
}
export interface Catalog {
  version: number;
  shopId: 'weasley';
  identities: Identity[];
}
export interface WelcomeTable {
  version: number;
  catalogVersion: number;
  entries: { identityId: string; weight: number }[];
}
export interface Configuration {
  catalog: Catalog;
  table: WelcomeTable;
  assetVersion: number;
}
export interface OpeningRequest {
  runId: string;
  unitId: string;
  kind: 'welcome-frog';
  catalogVersion: number;
  tableVersion: number;
}
export interface Copy {
  id: string;
  identity: Identity;
  origin: 'gift' | 'opening' | 'test';
  sourceId: string;
  catalogVersion: number;
  assetVersion: number;
  shopId: 'weasley';
}
export interface Operation {
  id: string;
  request: OpeningRequest;
  identity: Identity;
  copyId: string;
  isNew: boolean;
  catalogVersion: number;
  tableVersion: number;
  assetVersion: number;
}
export interface Unit {
  id: string;
  kind: 'frog' | 'beans';
  status: 'available' | 'consumed';
  operationId?: string;
}
export interface DemoState {
  schemaVersion: 1;
  runId: string;
  revision: number;
  language: Language;
  reducedMotion: boolean;
  ambient: boolean;
  units: Unit[];
  copies: Copy[];
  operations: Operation[];
  seenOperationId: string | null;
}
export interface Token {
  generation: number;
  runId: string;
  revision: number;
}
export interface StoredDemo {
  generation: number;
  state: DemoState;
  active: Configuration;
  configurations: Configuration[];
}
export interface ExportedDemo {
  format: 'magic-i1';
  schemaVersion: 1;
  state: DemoState;
  configurations: Configuration[];
}
export type ErrorCode =
  | 'INVALID_CONFIG'
  | 'INVALID_IMPORT'
  | 'CONFLICT'
  | 'EXHAUSTED'
  | 'STALE_CONFIG'
  | 'STALE_STATE'
  | 'NO_NEW_CANDIDATES'
  | 'INVALID_RANDOM'
  | 'STORAGE'
  | 'UNKNOWN';
export class DemoError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
    this.name = 'DemoError';
  }
}
export const tokenOf = (s: StoredDemo): Token => ({
  generation: s.generation,
  runId: s.state.runId,
  revision: s.state.revision,
});
export const gifts = ['O01', 'O02', 'S01', 'S02'];
export const discoveryCount = (s: DemoState) => new Set(s.copies.map((c) => c.identity.id)).size;
export const copyCount = (s: DemoState, id: string) =>
  s.copies.filter((c) => c.identity.id === id).length;
export const frogAvailable = (s: DemoState) =>
  s.units.some((u) => u.kind === 'frog' && u.status === 'available');
