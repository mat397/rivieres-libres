/* ==========================================================================
   /api/cron-alertes — exécuté 1×/jour par Vercel Cron.
   1. Récupère l'état actuel des stations hydrométriques (GeoJSON MSP).
   2. Pour chaque surveillance active : trouve la station la plus proche.
   3. Si son état est « à risque » (Surveillance/Alerte) ET différent du dernier
      état notifié → envoie un courriel via Emailit + met à jour dernier_etat.
   4. Ne re-notifie pas tant que l'état ne change pas (anti-spam).

   Env : POSTGRES_URL (Neon), Emailit key, EMAILIT_FROM (adresse expéditeur).
   Protégé par CRON_SECRET (Vercel envoie ce header sur les crons).
   ========================================================================== */
import { neon } from "@neondatabase/serverless";
import { statutZone } from "./_bdzi.js";

var STATIONS_URL = "https://geoegl.msp.gouv.qc.ca/apis/mapserver-vigilance/ws/vigilance.fcgi?service=wfs&version=1.1.0&request=getfeature&typename=stations_igo2_public&outputformat=geojson&srsName=epsg:4326";
var RAYON_KM = 15;          // station considérée « proche » si < 15 km
var BASE_URL = process.env.PUBLIC_BASE_URL || "https://portail-zoneinondable-rho.vercel.app";

function getConn() {
  return process.env.POSTGRES_URL || process.env.STORAGE_URL || process.env.DATABASE_URL || "";
}
function distanceKm(lng1, lat1, lng2, lat2) {
  var R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
/* Un état est « à risque » s'il contient surveillance / alerte / vigilance. */
function estARisque(etat) {
  if (!etat) return false;
  var e = etat.toLowerCase();
  return e.indexOf("surveillance") !== -1 || e.indexOf("alerte") !== -1 || e.indexOf("vigilance") !== -1;
}

async function envoyerCourriel(email, station, dist, token) {
  var key = process.env.Emailitalto || process.env.EMAILIT_API_KEY;
  var from = process.env.EMAILIT_FROM || "alertes@altogeo.ca";
  if (!key) return false;
  var p = station.properties || {};
  var desab = BASE_URL + "/api/desabonnement?token=" + token;
  var html =
    '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#0E3A52">' +
    '<p style="font-family:Arial;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#1E8AA0;font-weight:bold">Rivières Libres — Alerte</p>' +
    "<h2>Vigilance sur un cours d'eau près de chez vous</h2>" +
    "<p>La station <strong>" + (p.plan_deau || "hydrométrique") + "</strong>, à environ " +
    dist.toFixed(0) + " km de l'adresse que vous surveillez, est en état :</p>" +
    '<p style="font-size:1.2rem;font-weight:bold;color:#D64545">' + (p.etat || "Vigilance") + "</p>" +
    (p.dern_valeur_niv != null ? "<p>Niveau actuel : " + p.dern_valeur_niv + " m</p>" : "") +
    (p.url_vigilance ? '<p><a href="' + p.url_vigilance + '">Voir la fiche officielle de la station</a></p>' : "") +
    '<p style="font-size:.82rem;color:#667;font-style:italic;margin-top:24px;border-top:1px solid #e0e6ea;padding-top:12px">' +
    "Information à valeur indicative, sans portée légale. En cas de danger, suivez les consignes des autorités. " +
    "Alerte offerte bénévolement par Alto Géomatique.<br>" +
    '<a href="' + desab + '">Se désabonner de ces alertes</a></p></div>';

  try {
    var r = await fetch("https://api.emailit.com/v2/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: from, to: email,
        subject: "Alerte vigilance — cours d'eau près de votre adresse",
        html: html
      })
    });
    return r.ok;
  } catch (e) { return false; }
}

/* Courriel dédié : la cartographie réglementaire de l'adresse a changé.
   `avant` / `apres` = libellés de statut ("" = hors zone). */
async function courrielReglementaire(email, adresse, avant, apres, token) {
  var key = process.env.Emailitalto || process.env.EMAILIT_API_KEY;
  var from = process.env.EMAILIT_FROM || "alertes@altogeo.ca";
  if (!key) return false;
  var desab = BASE_URL + "/api/desabonnement?token=" + token;
  var estEntre = !avant && apres;      // hors zone -> en zone
  var estSorti = avant && !apres;      // en zone -> hors zone
  var titre = estEntre ? "Votre adresse vient d'être cartographiée en zone inondable"
    : estSorti ? "Votre adresse n'est plus dans une zone inondable cartographiée"
    : "Le classement de votre adresse en zone inondable a changé";
  var phrase = estEntre
    ? "Une nouvelle cartographie gouvernementale place maintenant l'adresse que vous surveillez dans une zone inondable&nbsp;: <strong>" + apres + "</strong>."
    : estSorti
    ? "La cartographie a été révisée&nbsp;: l'adresse que vous surveillez ne figure plus dans une zone inondable (elle était classée «&nbsp;" + avant + "&nbsp;»)."
    : "Le classement réglementaire de l'adresse que vous surveillez est passé de «&nbsp;" + avant + "&nbsp;» à «&nbsp;" + apres + "&nbsp;».";
  var adr = adresse ? (" (" + adresse + ")") : "";
  var html =
    '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#0E3A52">' +
    '<p style="font-family:Arial;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#1E8AA0;font-weight:bold">Rivières Libres — Changement réglementaire</p>' +
    "<h2>" + titre + "</h2>" +
    "<p>" + phrase + adr + "</p>" +
    '<p style="font-size:.95rem">Ce changement peut avoir un impact sur la valeur, l\'assurance, ' +
    "le droit de construire ou de rénover, et les obligations lors d'une vente. " +
    "Nous vous recommandons de valider le statut exact et la réglementation applicable auprès de votre municipalité.</p>" +
    '<p><a href="' + BASE_URL + '/carte-donnees/carte-embed.html">Revoir votre secteur sur la carte</a></p>' +
    '<p style="font-size:.82rem;color:#667;font-style:italic;margin-top:24px;border-top:1px solid #e0e6ea;padding-top:12px">' +
    "Information à valeur indicative, sans portée légale. Source&nbsp;: Base de données des zones inondables (BDZI), gouvernement du Québec. " +
    "Alerte offerte bénévolement par Alto Géomatique.<br>" +
    '<a href="' + desab + '">Se désabonner de ces alertes</a></p></div>';
  try {
    var r = await fetch("https://api.emailit.com/v2/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ from: from, to: email, subject: titre, html: html })
    });
    return r.ok;
  } catch (e) { return false; }
}

export default async function handler(req, res) {
  /* Sécurité : Vercel Cron envoie l'en-tête Authorization: Bearer <CRON_SECRET>. */
  var secret = process.env.CRON_SECRET;
  if (secret) {
    var auth = req.headers["authorization"] || "";
    if (auth !== "Bearer " + secret) { return res.status(401).json({ error: "Non autorisé" }); }
  }

  var conn = getConn();
  if (!conn) { return res.status(500).json({ error: "Base non configurée" }); }

  try {
    // 1) Stations
    var sr = await fetch(STATIONS_URL);
    var geo = sr.ok ? await sr.json() : null;
    var stations = (geo && geo.features) ? geo.features.filter(function (f) { return f.geometry && f.geometry.type === "Point"; }) : [];
    if (!stations.length) { return res.status(200).json({ ok: true, note: "aucune station" }); }

    // 2) Surveillances actives
    var sql = neon(conn);
    /* Colonnes de l'alerte réglementaire : créées au besoin (le cron peut tourner
       avant toute nouvelle inscription qui les aurait ajoutées). Idempotent. */
    await sql`ALTER TABLE surveillances ADD COLUMN IF NOT EXISTS dernier_statut_zone TEXT DEFAULT NULL`;
    await sql`ALTER TABLE surveillances ADD COLUMN IF NOT EXISTS statut_notifie_le TIMESTAMPTZ`;
    var rows = await sql`SELECT id, email, adresse, lat, lng, dernier_etat, dernier_statut_zone, token FROM surveillances WHERE actif = TRUE`;

    var envois = 0;
    for (var i = 0; i < rows.length; i++) {
      var s = rows[i];
      // Station la plus proche
      var best = null, bestD = Infinity;
      for (var j = 0; j < stations.length; j++) {
        var c = stations[j].geometry.coordinates;
        var d = distanceKm(s.lng, s.lat, c[0], c[1]);
        if (d < bestD) { bestD = d; best = stations[j]; }
      }
      if (!best || bestD > RAYON_KM) continue;
      var etat = (best.properties || {}).etat || "";

      // Notifier seulement si à risque ET état différent du dernier notifié
      if (estARisque(etat) && etat !== s.dernier_etat) {
        var sent = await envoyerCourriel(s.email, best, bestD, s.token);
        if (sent) { envois++; }
        await sql`UPDATE surveillances SET dernier_etat = ${etat}, notifie_le = NOW() WHERE id = ${s.id}`;
      } else if (!estARisque(etat) && s.dernier_etat) {
        // Retour à la normale : on réinitialise pour pouvoir ré-alerter plus tard.
        await sql`UPDATE surveillances SET dernier_etat = '' WHERE id = ${s.id}`;
      }
    }

    // 3) Alertes RÉGLEMENTAIRES : la cartographie BDZI de l'adresse a-t-elle
    //    changé depuis le dernier relevé ? On limite le nombre d'appels au
    //    service gouvernemental par exécution (courtoisie + éviter les timeouts).
    var MAX_BDZI = 40;
    var envoisReg = 0, verifs = 0;
    for (var k = 0; k < rows.length && verifs < MAX_BDZI; k++) {
      var r0 = rows[k];
      var ref = (r0.dernier_statut_zone == null) ? null : (r0.dernier_statut_zone || "");
      var actuel;
      try { actuel = (await statutZone(r0.lng, r0.lat)).statut || ""; }
      catch (e) { continue; } // service indispo : on réessaiera au prochain cron
      verifs++;

      if (ref === null) {
        // Pas encore de référence (inscription faite alors que le service était
        // down) : on l'établit sans notifier.
        await sql`UPDATE surveillances SET dernier_statut_zone = ${actuel} WHERE id = ${r0.id}`;
        continue;
      }
      if (actuel !== ref) {
        var sentR = await courrielReglementaire(r0.email, r0.adresse, ref, actuel, r0.token);
        if (sentR) { envoisReg++; }
        await sql`UPDATE surveillances SET dernier_statut_zone = ${actuel}, statut_notifie_le = NOW() WHERE id = ${r0.id}`;
      }
    }

    return res.status(200).json({
      ok: true, surveillances: rows.length,
      alertes_crue: envois, alertes_reglementaires: envoisReg, verifs_bdzi: verifs
    });
  } catch (e) {
    return res.status(502).json({ error: "Échec du traitement des alertes", detail: String(e).slice(0, 200) });
  }
}
