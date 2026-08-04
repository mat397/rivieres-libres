/* ==========================================================================
   Fonction serverless Vercel — /api/inscription
   Reçoit une inscription depuis le formulaire de la carte (courriel + adresse
   + consentement) et ajoute l'abonné à l'audience Emailit. La clé API reste
   côté serveur (variable d'environnement) : jamais exposée au navigateur.

   Variables d'environnement Vercel requises :
   - Emailitalto        : la clé API Emailit (secret_...)
   - EMAILIT_AUDIENCE   : l'id de l'audience (aud_...)
   ========================================================================== */

export default async function handler(req, res) {
  // CORS : la carte peut être intégrée en iframe sur un site tiers.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { return res.status(204).end(); }
  if (req.method !== "POST") { return res.status(405).json({ error: "Méthode non permise" }); }

  var key = process.env.Emailitalto || process.env.EMAILIT_API_KEY;
  var audience = process.env.EMAILIT_AUDIENCE;
  if (!key || !audience) {
    return res.status(500).json({ error: "Configuration serveur incomplète." });
  }

  // Lire le corps (Vercel le parse en JSON si Content-Type le permet).
  var body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  var email = (body.email || "").trim();
  var adresse = (body.adresse || "").trim();
  var consentement = body.consentement === true || body.consentement === "true";

  // Validation minimale du courriel.
  var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) { return res.status(400).json({ error: "Courriel invalide." }); }
  if (!consentement) { return res.status(400).json({ error: "Consentement requis." }); }

  // Consentement horodaté (preuve LCAP / Loi 25) — stocké en champ custom.
  var maintenant = new Date().toISOString();
  var ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "";

  try {
    var r = await fetch("https://api.emailit.com/v2/audiences/" + audience + "/subscribers", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        custom_fields: {
          adresse_recherchee: adresse,
          consentement_promo: "oui",
          consentement_date: maintenant,
          consentement_ip: ip,
          source: "carte-rivieres-libres"
        }
      })
    });

    // 201 = créé, 409 = déjà abonné (on considère ça comme un succès côté citoyen).
    if (r.status === 201 || r.status === 200 || r.status === 409) {
      return res.status(200).json({ ok: true });
    }
    var txt = await r.text();
    return res.status(502).json({ error: "Le service d'inscription a refusé la demande.", detail: txt.slice(0, 200) });
  } catch (e) {
    return res.status(502).json({ error: "Impossible de joindre le service d'inscription." });
  }
}
