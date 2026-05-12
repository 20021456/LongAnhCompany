-- Long Anh Corp — Postgres init script
-- Runs once when the container is first created.
-- Enables extensions needed by the app.

CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;     -- case-insensitive email column
CREATE EXTENSION IF NOT EXISTS unaccent;   -- VN full-text search (strip diacritics)
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- trigram fuzzy search (product names)
