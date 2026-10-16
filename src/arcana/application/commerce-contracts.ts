import type { ForgeWandRequest, OpenVaultRequest } from '../domain/economy/commerce';
import type { Equipment } from '../domain/economy/equipment';
import type { Reward } from '../domain/economy/rewards';
export interface ForgeReceipt {
  readonly id: string;
  readonly kind: 'forge-wand';
  readonly request: ForgeWandRequest;
  readonly spentCrowns: number;
  readonly equipment: Equipment;
}
export interface VaultReceipt {
  readonly id: string;
  readonly kind: 'open-vault';
  readonly request: OpenVaultRequest;
  readonly spentKeys: 1;
  readonly entryId: string;
  readonly reward: Reward;
  readonly equipment: readonly Equipment[];
}
