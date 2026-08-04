-- ==========================================================================
-- Schéma de la base des alertes « Rivières Libres »
-- À exécuter une fois dans la base Neon/Postgres (via l'éditeur SQL Neon,
-- ou automatiquement par /api/surveiller au premier appel).
-- ==========================================================================

CREATE TABLE IF NOT EXISTS surveillances (
  id               SERIAL PRIMARY KEY,
  email            TEXT NOT NULL,
  adresse          TEXT,
  lat              DOUBLE PRECISION NOT NULL,
  lng              DOUBLE PRECISION NOT NULL,
  -- Dernier état de vigilance notifié (pour ne pas re-alerter en boucle).
  dernier_etat     TEXT DEFAULT '',
  -- Jeton de désinscription (lien dans chaque courriel — conformité loi 25).
  token            TEXT NOT NULL,
  actif            BOOLEAN NOT NULL DEFAULT TRUE,
  consentement_ip  TEXT,
  cree_le          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notifie_le       TIMESTAMPTZ
);

-- Un même courriel ne surveille pas deux fois exactement la même position.
CREATE UNIQUE INDEX IF NOT EXISTS surveillances_email_pos
  ON surveillances (email, lat, lng);

CREATE INDEX IF NOT EXISTS surveillances_actif ON surveillances (actif);
