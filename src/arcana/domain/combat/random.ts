export interface RandomTickets {
  ticket(maxExclusive: number): number;
}

export interface CombatRandomFactory {
  fromSeed(seed: number): RandomTickets;
}
