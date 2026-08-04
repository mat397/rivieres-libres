/* ==========================================================================
   /api/desabonnement?token=... — désactive une surveillance d'alerte.
   Appelé depuis le lien présent dans chaque courriel d'alerte (conformité
   loi 25 / LCAP : désinscription simple, en un clic).
   ========================================================================== */
import { neon } from "@neondatabase/serverless";

function getConn() {
  return process.env.POSTGRES_URL || process.env.STORAGE_URL || process.env.DATABASE_URL || "";
}

function page(titre, message) {
  return "<!doctype html><html lang=\"fr-CA\"><head><meta charset=\"utf-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
    "<title>" + titre + "</title>" +
    "<style>body{font-family:system-ui,Arial,sans-serif;max-width:520px;margin:60px auto;padding:0 24px;color:#0E3A52;line-height:1.6;text-align:center}" +
    "h1{color:#1E8AA0;font-size:1.3rem}a{color:#14708A}</style></head><body>" +
    "<h1>Rivières Libres</h1><p>" + message + "</p>" +
    '<p><a href="https://portail-zoneinondable-rho.vercel.app/">Retour au site</a></p></body></html>';
}

export default async function handler(req, res) {
  var token = (req.query && req.query.token) ? String(req.query.token) : "";
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (!token) { return res.status(400).send(page("Lien invalide", "Ce lien de désinscription est invalide.")); }

  var conn = getConn();
  if (!conn) { return res.status(500).send(page("Erreur", "Service temporairement indisponible.")); }

  try {
    var sql = neon(conn);
    var r = await sql`UPDATE surveillances SET actif = FALSE WHERE token = ${token} RETURNING email`;
    if (r && r.length) {
      return res.status(200).send(page("Désinscription confirmée",
        "Vous ne recevrez plus d'alertes pour cette adresse. Merci d'avoir utilisé Rivières Libres."));
    }
    return res.status(200).send(page("Déjà désinscrit",
      "Cette surveillance est déjà désactivée ou introuvable."));
  } catch (e) {
    return res.status(502).send(page("Erreur", "La désinscription a échoué. Réessayez plus tard."));
  }
}
