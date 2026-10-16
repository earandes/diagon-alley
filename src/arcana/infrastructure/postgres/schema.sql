CREATE TABLE IF NOT EXISTS arcana_accounts (
  player_id text PRIMARY KEY,
  revision bigint NOT NULL CHECK (revision BETWEEN 1 AND 9007199254740991)
);

CREATE TABLE IF NOT EXISTS arcana_inventory (
  player_id text PRIMARY KEY REFERENCES arcana_accounts(player_id) ON DELETE CASCADE,
  crowns bigint NOT NULL CHECK (crowns BETWEEN 0 AND 9007199254740991),
  gold_keys bigint NOT NULL DEFAULT 0 CHECK (gold_keys BETWEEN 0 AND 9007199254740991),
  essence_points smallint NOT NULL CHECK (essence_points BETWEEN 0 AND 50),
  essence_cursor bigint NOT NULL CHECK (essence_cursor BETWEEN 0 AND 9007199254740991)
);

-- Additive local migration: previously created inventories contain no keys.
ALTER TABLE arcana_inventory ADD COLUMN IF NOT EXISTS gold_keys bigint NOT NULL DEFAULT 0
  CHECK (gold_keys BETWEEN 0 AND 9007199254740991);

CREATE TABLE IF NOT EXISTS arcana_exploration (
  player_id text PRIMARY KEY REFERENCES arcana_accounts(player_id) ON DELETE CASCADE,
  run_id text,
  run_state jsonb,
  CHECK ((run_id IS NULL AND run_state IS NULL) OR (run_id IS NOT NULL AND run_state IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS arcana_victories (
  player_id text NOT NULL REFERENCES arcana_accounts(player_id) ON DELETE CASCADE,
  level_id text NOT NULL,
  campaign_version integer NOT NULL CHECK (campaign_version > 0),
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  PRIMARY KEY (player_id, level_id, campaign_version),
  UNIQUE (player_id, ordinal)
);
CREATE TABLE IF NOT EXISTS arcana_unlocked_zones (
  player_id text NOT NULL REFERENCES arcana_accounts(player_id) ON DELETE CASCADE,
  zone_id text NOT NULL,
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  PRIMARY KEY (player_id, zone_id),
  UNIQUE (player_id, ordinal)
);

CREATE TABLE IF NOT EXISTS arcana_product_units (
  player_id text NOT NULL REFERENCES arcana_accounts(player_id) ON DELETE CASCADE,
  unit_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('cacao-toad', 'random-beans')),
  status text NOT NULL CHECK (status IN ('available', 'consumed')),
  operation_id text,
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  PRIMARY KEY (player_id, unit_id),
  UNIQUE (player_id, ordinal),
  CHECK ((status = 'available' AND operation_id IS NULL) OR (status = 'consumed' AND operation_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS arcana_wizard_copies (
  player_id text NOT NULL REFERENCES arcana_accounts(player_id) ON DELETE CASCADE,
  copy_id text NOT NULL,
  wizard_id text NOT NULL,
  catalog_version integer NOT NULL CHECK (catalog_version > 0),
  wizard_snapshot jsonb NOT NULL,
  source_id text NOT NULL,
  origin text NOT NULL CHECK (origin IN ('starter', 'toad')),
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  PRIMARY KEY (player_id, copy_id),
  UNIQUE (player_id, ordinal)
);

CREATE TABLE IF NOT EXISTS arcana_operations (
  player_id text NOT NULL REFERENCES arcana_accounts(player_id) ON DELETE CASCADE,
  operation_id text NOT NULL,
  receipt jsonb NOT NULL,
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  PRIMARY KEY (player_id, operation_id),
  UNIQUE (player_id, ordinal)
);

CREATE TABLE IF NOT EXISTS arcana_equipment (
  player_id text NOT NULL REFERENCES arcana_accounts(player_id) ON DELETE CASCADE,
  equipment_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('wand', 'broom')),
  definition_version integer NOT NULL CHECK (definition_version > 0),
  equipment_snapshot jsonb NOT NULL,
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  PRIMARY KEY (player_id, equipment_id),
  UNIQUE (player_id, ordinal)
);
CREATE TABLE IF NOT EXISTS arcana_team_members (
  player_id text NOT NULL,
  copy_id text NOT NULL,
  ordinal integer NOT NULL CHECK (ordinal BETWEEN 0 AND 4),
  PRIMARY KEY (player_id, copy_id),
  UNIQUE (player_id, ordinal),
  FOREIGN KEY (player_id, copy_id) REFERENCES arcana_wizard_copies(player_id, copy_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS arcana_team_loadouts (
  player_id text NOT NULL,
  copy_id text NOT NULL,
  wand_id text,
  broom_id text,
  ordinal integer NOT NULL CHECK (ordinal >= 0),
  PRIMARY KEY (player_id, copy_id),
  UNIQUE (player_id, ordinal),
  UNIQUE (player_id, wand_id),
  UNIQUE (player_id, broom_id),
  FOREIGN KEY (player_id, copy_id) REFERENCES arcana_wizard_copies(player_id, copy_id) ON DELETE CASCADE,
  FOREIGN KEY (player_id, wand_id) REFERENCES arcana_equipment(player_id, equipment_id),
  FOREIGN KEY (player_id, broom_id) REFERENCES arcana_equipment(player_id, equipment_id)
);
