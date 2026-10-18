-- Additive identity context; game ownership and economy continue to use player_id.
CREATE TABLE IF NOT EXISTS arcana_identities (
  identity_id text PRIMARY KEY,
  email_key text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  player_id text NOT NULL UNIQUE REFERENCES arcana_accounts(player_id),
  auth_version integer NOT NULL DEFAULT 1 CHECK (auth_version > 0),
  created_ms bigint NOT NULL
);
CREATE TABLE IF NOT EXISTS arcana_identity_challenges (
  token_hash text PRIMARY KEY,
  purpose text NOT NULL CHECK (purpose IN ('verify', 'reset')),
  email_key text NOT NULL,
  player_id text NOT NULL,
  guest_binding boolean NOT NULL,
  expires_ms bigint NOT NULL,
  used_ms bigint,
  created_ms bigint NOT NULL
);
CREATE INDEX IF NOT EXISTS arcana_identity_challenges_email ON arcana_identity_challenges(email_key);

CREATE TABLE IF NOT EXISTS arcana_identity_sessions (
  token_hash text PRIMARY KEY,
  player_id text NOT NULL REFERENCES arcana_accounts(player_id),
  auth_version integer NOT NULL CHECK(auth_version > 0),
  expires_ms bigint NOT NULL
);
