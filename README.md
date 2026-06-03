# Rivières Libres

Portail d'information indépendant sur **l'espace de liberté des rivières** et les **zones inondables** au Québec — pour les citoyens, les municipalités et les professionnels.

Site **statique multipage** en HTML/CSS/JS vanilla, sans framework, en français (`fr-CA`), structuré pour ajouter l'anglais en V2. Conçu pour viser WCAG 2.1 AA.

> ⚠️ **Avertissement.** Les contenus, schémas et cartes ont une **valeur indicative** et **aucune portée légale**. Plusieurs chiffres sont des **estimations gouvernementales** ou des seuils **à valider sur le guide méthodologique officiel du MELCCFP avant mise en ligne** (voir « Précautions sur les données » ci-dessous).

---

## Démarrer en local

Le site est 100 % statique. Comme les chemins sont **absolus** (`/assets/...`, `/comprendre/...`), il faut le servir depuis la **racine** d'un serveur local — ne l'ouvrez pas via `file://`.

```bash
# Python 3
python -m http.server 8000
# ou Node
npx serve .
```

Puis ouvrez http://localhost:8000/.

---

## Structure

```
/
├── index.html                  # Accueil
├── 404.html
├── comprendre/                 # 5 pages — le cœur pédagogique
├── carte-donnees/              # carte (placeholder) + lire-les-cartes
├── cadre-reglementaire/        # cadre-2026 (+ gabarits V2)
├── pour-vous/                  # citoyens / municipalites-obv / professionnels
├── agir/  ressources/          # gabarits V2 « bientôt disponible »
├── a-propos.html
├── assets/
│   ├── css/styles.css          # tokens (direction éditoriale) + composants
│   └── js/main.js              # menu mobile, accordéons, sélecteur de zone, carte-placeholder
├── partials/                   # header.html / footer.html (référence)
├── tools/                      # générateur optionnel (voir ci-dessous)
├── sitemap.xml  robots.txt
```

Les pages HTML sont **versionnées et servables telles quelles** : le générateur n'est pas requis pour publier.

## Régénérer les pages (optionnel)

Pour éviter de dupliquer le header/footer à la main, les pages sont produites par un petit générateur Node (aucune dépendance) :

```bash
node tools/build.mjs
```

- Le **layout commun** (head, header, footer) vit dans `tools/build.mjs`.
- Le **contenu** de chaque page vit dans `tools/pages/*.mjs` (un fichier = une page, `export default { out, meta, body }`).
- Les **gabarits V2** « bientôt disponible » sont listés dans `tools/pages/_v2.mjs`.

### Ajouter une page

1. Créez `tools/pages/ma-page.mjs` sur le modèle des fichiers existants (utilisez `pageHead()` depuis `_shared.mjs`).
2. Lancez `node tools/build.mjs`.
3. Ajoutez l'entrée dans `sitemap.xml` et, au besoin, dans la nav (`NAV` dans `tools/build.mjs`) et le footer.

---

## Design system

Direction **éditoriale** (voir `brief-2-technique-claude-code.md` §2) :

- **Polices** : Fraunces (titres, serif) + Inter (corps), via Google Fonts.
- **Couleurs eau & rivière** : bleu profond `#0E3A52`, turquoise `#1E8AA0`, vert nature, sable.
- **Couleurs de risque officielles** (`--risk-*`) : **réservées à la légende et aux indicateurs de risque** — ne pas les détourner comme accents décoratifs.

Tous les tokens sont des variables CSS en haut de `assets/css/styles.css`.

## Brancher la vraie carte (V2)

La carte est un **placeholder stylé** (`map-embed`) avec un champ de recherche non fonctionnel. Points d'ancrage dans le code :

- `carte-donnees/carte.html` → commentaire `<!-- V2: intégrer Leaflet + couches WMS officielles MELCCFP/MRNF -->`.
- Prévoir Leaflet + couches WMS officielles (zones inondables / mobilité / milieux humides) et un géocodage d'adresse.

## Internationalisation (V2)

Le sélecteur **FR/EN** est présent dans le header mais **désactivé**. Pour ajouter l'anglais : isoler les chaînes, dupliquer l'arborescence sous `/en/` (ou injecter les traductions) et activer le sélecteur.

---

## Précautions sur les données (à respecter)

- **Toujours afficher la source** près des chiffres.
- **Élargissement ~30 %** et **25 000 → 35 000 logements** : estimations gouvernementales (juin 2025) — formuler comme estimations.
- **Seuils des classes de risque** (ex. « très élevée ») : **à valider sur le guide méthodologique officiel du MELCCFP** avant publication.
- **Impacts sur la valeur foncière** : rester qualitatif ; pas de pourcentages issus de sources commerciales sans réserve.
- **Avertissement légal** présent dans le footer de chaque page et sur la carte.

## Crédits

- Concept scientifique : Biron, Buffin-Bélanger, Larocque et al. (Concordia / Ouranos, 2013).
- Cadre réglementaire : MELCCFP / gouvernement du Québec.
- Photos : Unsplash (à remplacer/créditer formellement avant production).

## Déploiement (GitHub Pages)

Les chemins étant **absolus**, le site fonctionne tel quel sur un **domaine racine** (site `user/org` GitHub Pages, ou domaine personnalisé). Sur un **project site** (`user.github.io/repo/`), les chemins `/assets/...` ne se résolvent pas : utilisez un domaine personnalisé, un site `user.github.io`, ou adaptez avec une `<base>` / des chemins relatifs.

## Licence

Contenu sous licence libre, sources créditées. (Préciser la licence exacte avant publication.)
