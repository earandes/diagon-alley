import type { EncounterResolution } from '../domain/exploration/encounters';
import type { Combat } from '../domain/combat/engine';
import type { Reward } from '../domain/economy/rewards';
import type { Run } from '../domain/exploration/run';
export interface StartRunRequest {
  readonly zoneId: string;
  readonly campaignVersion: number;
  readonly copyIds: readonly string[];
}
export interface BeanAssignment {
  readonly unitId: string;
  readonly beanId: string;
}
export interface NodeOptions {
  readonly refugeAction?: 'heal' | 'focus';
  readonly pactAction?: 'recruit' | 'pass';
  readonly replaceUnitId?: string;
  readonly encounterAction?: 'risk' | 'pass';
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
  } | null;
}
