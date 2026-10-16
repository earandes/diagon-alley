export interface SessionGrant {
  readonly token: string;
  readonly expiresAt: number;
}
export interface Sessions {
  issue(playerId: string, ttlMs: number): Promise<SessionGrant>;
  resolve(token: string): Promise<string | null>;
  revoke(token: string): Promise<void>;
}
export interface RequestLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly retryAfterMs: number;
}
export interface RequestLimits {
  consume(subject: string, maximum: number, windowMs: number): Promise<RequestLimitResult>;
}
export interface AuthorityClock {
  now(): Promise<number>;
}
