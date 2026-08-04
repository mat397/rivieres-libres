/* Page « tremplin » de partage social. Quand un citoyen partage son résultat
   d'adresse, le lien pointe ici (/api/partage?lat=&lng=&adresse=&zone=&statut=).

   - Les robots sociaux (Facebook, LinkedIn, X) lisent les balises Open Graph du
     <head> : l'image vient de /api/og (générée à la volée pour cette adresse).
   - Les humains sont redirigés vers la carte, centrée sur l'adresse.

   On sert du HTML brut : les crawlers ne suivent pas de redirection avant de
   lire les meta, donc l'aperçu social se construit correctement. */

const BASE = process.env.PUBLIC_BASE_URL || "https://portail-zoneinondable-rho.vercel.app";

function esc(s) {
  return (s || "")
    .toString()
    .slice(0, 120)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export default function handler(req, res) {
  const url = new URL(req.url, BASE);
  const p = url.searchParams;
  const lat = p.get("lat") || "";
  const lng = p.get("lng") || "";
  const adresse = esc(p.get("adresse"));
  const zone = p.get("zone") || "";
  const statut = esc(p.get("statut"));

  // Image OG dynamique.
  const ogParams = new URLSearchParams();
  if (lat) ogParams.set("lat", lat);
  if (lng) ogParams.set("lng", lng);
  if (adresse) ogParams.set("adresse", adresse);
  if (zone) ogParams.set("zone", zone);
  if (statut) ogParams.set("statut", statut);
  const ogImage = BASE + "/api/og?" + ogParams.toString();

  // Destination humaine : la carte, centrée sur l'adresse.
  const carte = "/carte-donnees/carte-embed.html" +
    (lat && lng ? "?lat=" + encodeURIComponent(lat) + "&lng=" + encodeURIComponent(lng) : "");

  const titre = statut
    ? statut + (adresse ? " — " + adresse : "")
    : "Cette adresse est-elle en zone inondable ?";
  const desc = "Vérifiez gratuitement si une adresse du Québec est en zone inondable ou de mobilité des cours d'eau. Carte interactive Rivières Libres.";

  const html = `<!doctype html>
<html lang="fr-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titre}</title>
<meta name="description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${BASE}${carte}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${titre}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${ogImage}">
<meta http-equiv="refresh" content="0; url=${carte}">
<link rel="canonical" href="${BASE}${carte}">
</head>
<body style="font-family:system-ui,sans-serif;background:#0E3A52;color:#fff;text-align:center;padding:3rem 1rem">
<p>Redirection vers la carte…</p>
<p><a href="${carte}" style="color:#7BD4E4">Ouvrir la carte</a></p>
<script>location.replace(${JSON.stringify(carte)});</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.status(200).send(html);
}
