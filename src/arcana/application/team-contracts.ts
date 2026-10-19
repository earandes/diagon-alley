import type { Team } from '../domain/collection/team';
import type { BondMode } from '../domain/combat/bonds';
import type { WizardDefinition } from '../domain/collection/wizards';
import type { EquipmentSlot } from '../domain/economy/equipment';
import type { Run } from '../domain/exploration/run';
export interface SetTeamRequest {
  readonly bondFocus?: BondMode;
  readonly copyIds: readonly string[];
}
export interface EquipEquipmentRequest {
  readonly copyId: string;
  readonly slot: EquipmentSlot;
  readonly equipmentId: string | null;
}
export interface StarterKitReceipt {
  readonly id: 'starter-kit';
  readonly kind: 'starter-kit';
  readonly catalogVersion: number;
  readonly copyId: string;
  readonly wizard: WizardDefinition;
  readonly equipmentIds: readonly string[];
}
export type TeamReceipt =
  | {
      readonly id: string;
      readonly kind: 'set-team';
      readonly request: SetTeamRequest;
      readonly team: Team;
      readonly run: Run | null;
    }
  | {
      readonly id: string;
      readonly kind: 'equip-equipment';
      readonly request: EquipEquipmentRequest;
      readonly team: Team;
      readonly run: Run | null;
    };
