/* ==========================================================================
   Interrogation du statut « zone inondable » d'un point via le service Esri
   REST du gouvernement (Base de données des zones inondables, BDZI).

   On demande au service quels polygones BDZI intersectent le point donné.
   Retourne le statut réglementaire (« Zone de grand courant », etc.) ou null.

   Sert à deux choses :
   - capturer le statut au moment où un citoyen surveille son adresse ;
   - le recomparer périodiquement (cron) pour détecter un changement de
     cartographie et l'alerter.
   ========================================================================== */

const BDZI_LAYER =
  "https://www.servicesgeo.enviroweb.gouv.qc.ca/donnees/rest/services/Public/Themes_publics/MapServer/22/query";

/* Ordre de gravité (pour choisir le statut « le plus grave » si un point
   tombe dans plusieurs polygones). Plus l'indice est grand, plus c'est grave. */
const GRAVITE = {
  "Zone de grand courant": 4,   // 0-20 ans
  "Zone de crue 0-100 ans": 3,
  "Zone de faible courant": 2,  // 20-100 ans
  "Autre zone inondable": 1
};

/* Retourne { enZone: bool, statut: string|"", rapport: string } pour un point.
   `statut` = "" si hors de toute zone cartographiée BDZI.
   En cas d'erreur réseau, lève une exception (l'appelant décide quoi faire). */
export async function statutZone(lng, lat) {
  const params = new URLSearchParams({
    geometry: `${lng},${lat}`,
    geometryType: "esriGeometryPoint",
    inSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    outFields: "Description,Nm_rapport",
    returnGeometry: "false",
    f: "json"
  });

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 12000);
  let data;
  try {
    const r = await fetch(`${BDZI_LAYER}?${params.toString()}`, { signal: ctrl.signal });
    if (!r.ok) throw new Error("BDZI HTTP " + r.status);
    data = await r.json();
  } finally {
    clearTimeout(t);
  }

  const feats = (data && data.features) || [];
  if (!feats.length) return { enZone: false, statut: "", rapport: "" };

  // Choisir le polygone le plus grave.
  let best = null, bestG = -1;
  for (const f of feats) {
    const desc = (f.attributes && f.attributes.Description) || "";
    const g = GRAVITE[desc] || 0;
    if (g > bestG) { bestG = g; best = f; }
  }
  const a = (best && best.attributes) || {};
  return {
    enZone: true,
    statut: a.Description || "Zone inondable",
    rapport: a.Nm_rapport || ""
  };
}

/* Clé stable pour comparer deux relevés (détecter un changement). On compare le
   statut ; "" = hors zone. Un passage "" -> "Zone de grand courant" ou tout
   changement de libellé déclenche une alerte. */
export function cleStatut(s) {
  return (s && s.statut) ? s.statut : "";
}
