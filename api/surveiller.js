/* ==========================================================================
   /api/surveiller — inscription à une alerte pour une adresse.
   Stocke (courriel + coordonnées + adresse + jeton) dans Postgres (Neon).
   La table est créée au besoin (idempotent).

   Variables d'env (fournies par l'intégration Neon/Vercel, préfixe STORAGE) :
   - STORAGE_URL  (ou POSTGRES_URL / DATABASE_URL selon le préfixe choisi)
   ========================================================================== */
import { neon } from "@neondatabase/serverless";

function getConn() {
  return process.env.STORAGE_URL || process.env.STORAGE_POSTGRES_URL ||
         process.env.POSTGRES_URL || process.env.DATABASE_URL || "";
}

/* Jeton aléatoire pour la désinscription (sans dépendance). */
function makeToken() {
  var s = "";
  var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 32; i++) { s += chars[Math.floor(Math.random() * chars.length)]; }
  return s;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { return res.status(204).end(); }
  if (req.method !== "POST") { return res.status(405).json({ error: "Méthode non permise" }); }

  var conn = getConn();
  if (!conn) { return res.status(500).json({ error: "Base de données non configurée." }); }

  var body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  var email = (body.email || "").trim().toLowerCase();
  var adresse = (body.adresse || "").trim();
  var lat = parseFloat(body.lat), lng = parseFloat(body.lng);
  var consentement = body.consentement === true || body.consentement === "true";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { return res.status(400).json({ error: "Courriel invalide." }); }
  if (isNaN(lat) || isNaN(lng)) { return res.status(400).json({ error: "Position manquante." }); }
  if (!consentement) { return res.status(400).json({ error: "Consentement requis." }); }

  var ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "";
  var token = makeToken();

  try {
    var sql = neon(conn);
    /* Table créée au besoin (idempotent). */
    await sql`CREATE TABLE IF NOT EXISTS surveillances (
      id SERIAL PRIMARY KEY, email TEXT NOT NULL, adresse TEXT,
      lat DOUBLE PRECISION NOT NULL, lng DOUBLE PRECISION NOT NULL,
      dernier_etat TEXT DEFAULT '', token TEXT NOT NULL,
      actif BOOLEAN NOT NULL DEFAULT TRUE, consentement_ip TEXT,
      cree_le TIMESTAMPTZ NOT NULL DEFAULT NOW(), notifie_le TIMESTAMPTZ)`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS surveillances_email_pos ON surveillances (email, lat, lng)`;

    /* Upsert : réactive si déjà présent, insère sinon. */
    await sql`
      INSERT INTO surveillances (email, adresse, lat, lng, token, consentement_ip, actif)
      VALUES (${email}, ${adresse}, ${lat}, ${lng}, ${token}, ${ip}, TRUE)
      ON CONFLICT (email, lat, lng)
      DO UPDATE SET actif = TRUE, adresse = ${adresse}`;

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: "Impossible d'enregistrer la surveillance.", detail: String(e).slice(0, 200) });
  }
}
