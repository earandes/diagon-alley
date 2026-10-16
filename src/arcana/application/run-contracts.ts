import type { EncounterTradeResolution } from '../domain/exploration/encounter-trades';
import type { EncounterResolution } from '../domain/exploration/encounters';
import type { Combat } from '../domain/combat/engine';
import type { Reward } from '../domain/economy/rewards';
import type { Run } from '../domain/exploration/run';
export interface StartRunRequest {
  readonly zoneId: string;
  readonly campaignVersion: number;
  readonly copyIds: readonly string[];
  readonly challenge?: 'discovery' | 'tactical' | 'mastery';
}
export interface BeanAssignment {
  readonly unitId: string;
  readonly beanId: string;
}
export interface NodeOptions {
  readonly refugeAction?: 'heal' | 'focus';
  readonly pactAction?: 'recruit' | 'pass';
  readonly recruitId?: string;
  readonly replaceUnitId?: string;
  readonly encounterAction?: 'risk' | 'pass' | 'trade';
  readonly encounterChoiceId?: string;
  readonly encounterUnitId?: string;
}
export interface AdvanceNodeRequest extends NodeOptions {
  readonly runId: string;
  readonly nodeId: string;
  readonly campaignVersion: number;
  readonly assignments: readonly BeanAssignment[];
}
export interface StartRunReceipt {
  readonly id: string;
  readonly kind: 'start-run';
  readonly request: StartRunRequest;
  readonly run: Run;
}
export interface NodeReceipt {
  readonly id: string;
  readonly kind: 'advance-node';
  readonly request: AdvanceNodeRequest;
  readonly run: Run;
  readonly reward: Reward;
  readonly firstVictory: boolean | null;
  readonly battle: Combat | null;
  readonly encounter: {
    readonly seed: number;
    readonly choice: number;
    readonly resolution?: EncounterResolution;
    readonly trade?: EncounterTradeResolution;
  } | null;
}
