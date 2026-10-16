export const EXPEDITION_CHALLENGES = ['discovery', 'tactical', 'mastery'] as const;
export type ExpeditionChallenge = (typeof EXPEDITION_CHALLENGES)[number];
