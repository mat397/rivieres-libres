/* ==========================================================================
   tools/inject-token.mjs — Injecte le token Mapbox au DÉPLOIEMENT.

   Les fichiers .html commités contiennent le placeholder `__MAPBOX_TOKEN__`
   (jamais le vrai token — GitHub bloque, et c'est la bonne pratique). Ce script
   remplace le placeholder par le token réel, lu depuis :
     - la variable d'environnement MAPBOX_TOKEN (Vercel : Settings > Env Vars), ou
     - le fichier .env local (dév).

   Vercel le lance via le buildCommand (voir vercel.json). En local, lancer :
     node tools/build.mjs && node tools/inject-token.mjs
   NB : en local, ça écrit le token dans les .html — NE PAS committer après ça.
   Pour re-nettoyer : node tools/build.mjs (régénère avec le placeholder).
   ========================================================================== */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PLACEHOLDER = "__MAPBOX_TOKEN__";

/* Priorité : variable d'env (Vercel) puis .env (local). */
let token = process.env.MAPBOX_TOKEN || "";
if (!token) {
  try {
    const env = readFileSync(join(ROOT, ".env"), "utf8");
    const m = env.match(/^MAPBOX_TOKEN=(\S+)/m);
    token = m ? m[1] : "";
  } catch { /* pas de .env : token reste vide, la carte retombe sur le fond R2 */ }
}

if (!token) {
  console.log("inject-token : aucun token trouvé (env MAPBOX_TOKEN ni .env). " +
    "Les pages garderont le placeholder ; la carte utilisera le fond auto-hébergé.");
  process.exit(0);
}

/* Parcourt les .html à la racine et dans les sous-dossiers de contenu. */
const DIRS = ["", "carte-donnees", "comprendre", "cadre-reglementaire", "pour-vous", "agir", "ressources"];
let count = 0;
for (const d of DIRS) {
  const dir = join(ROOT, d);
  let files;
  try { files = readdirSync(dir); } catch { continue; }
  for (const f of files) {
    if (!f.endsWith(".html")) continue;
    const p = join(dir, f);
    const html = readFileSync(p, "utf8");
    if (html.indexOf(PLACEHOLDER) === -1) continue;
    writeFileSync(p, html.split(PLACEHOLDER).join(token), "utf8");
    count++;
  }
}
console.log(`inject-token : token Mapbox injecté dans ${count} page(s).`);
