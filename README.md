# Rivières Libres

Portail d'information indépendant sur **l'espace de liberté des rivières** et les **zones inondables** au Québec, pour les citoyens, les municipalités et les professionnels.

Site **statique multipage** en HTML/CSS/JS vanilla, sans framework, en français (`fr-CA`), structuré pour ajouter l'anglais en V2. Conçu pour viser WCAG 2.1 AA.

> **Avertissement.** Les contenus, schémas et cartes ont une **valeur indicative** et **aucune portée légale**. Plusieurs chiffres sont des **estimations gouvernementales** ou des seuils **à valider sur le guide méthodologique officiel du MELCCFP avant mise en ligne** (voir « Précautions sur les données » ci-dessous).

---

## Démarrer en local

Le site est 100 % statique. Comme les chemins sont **absolus** (`/assets/...`, `/comprendre/...`), il faut le servir depuis la **racine** d'un serveur local : ne l'ouvrez pas via `file://`.

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
├── index.html                  # Accueil (généré, comme toutes les pages)
├── 404.html
├── comprendre/                 # 5 dossiers : le cœur pédagogique
├── carte-donnees/              # carte officielle MRNF (iframe) + lire-les-cartes
├── cadre-reglementaire/        # cadre-2026 (+ gabarits V2)
├── pour-vous/                  # citoyens / municipalites-obv / professionnels
├── agir/  ressources/          # gabarits V2 « bientôt disponible »
├── a-propos.html
├── assets/
│   ├── css/styles.css          # design system v2 : tokens + motion + composants
│   └── js/main.js              # moteur d'animation vanilla (IntersectionObserver)
├── partials/                   # header.html / footer.html (copies de référence)
├── tools/                      # générateur (source de vérité, voir ci-dessous)
├── sitemap.xml  robots.txt
```

## Régénérer les pages

Les `.html` commis sont du **rendu généré**. Le contenu s'édite dans `tools/pages/*.mjs`, puis :

```bash
node tools/build.mjs
```

- Le **layout commun** (head, nav caméléon fixe, menu mobile, footer avec avertissement légal) vit dans `tools/build.mjs`.
- Le **contenu** de chaque page vit dans `tools/pages/*.mjs` (un fichier = une page, `export default { out, meta, body }`).
- Les **composants partagés** (pageHero, maskLines, stat, indexRow, accordionItem, linkArrow, icônes) vivent dans `tools/pages/_shared.mjs`.
- Les **gabarits V2** « bientôt disponible » sont listés dans `tools/pages/_v2.mjs`.

### Ajouter une page

1. Créez `tools/pages/ma-page.mjs` sur le modèle des fichiers existants (utilisez `pageHero()` depuis `_shared.mjs`).
2. Lancez `node tools/build.mjs`.
3. Ajoutez l'entrée dans `sitemap.xml` et, au besoin, dans la nav (`NAV` dans `tools/build.mjs`) et le footer.

---

## Design system (v2)

Direction « grand reportage » : registre éditorial et scientifique, autorité calme.

- **Polices** : Fraunces (titres, serif, avec italiques) + Inter (corps), via Google Fonts.
- **Arc de thème délibéré** : tête de page « eau profonde » (bleu nuit) → corps clair (lecture) → appel final et footer sombres. La nav fixe est **caméléon** : elle lit le thème de la section survolée (`data-navtheme="dark"`).
- **Couleurs eau & rivière** : bleu profond `#0E3A52`, eau profonde `#0A2C3F`, abysse `#071E2A`, turquoise `#1E8AA0`, reflet `#7BD4E4` (accent sur fond sombre), liens `#14708A` (contraste AA).
- **Couleurs de risque officielles** (`--risk-*`) : **réservées à la légende et aux indicateurs de risque**, jamais en accent décoratif.
- **Formes verrouillées** : interactif = pilule ; contenants = 14 px ; médias = 22 px.
- **Mouvement** (motivé, jamais décoratif) : titres révélés ligne par ligne (`maskLines`), révélations au défilement (`data-reveal`), manifeste rempli mot à mot (`data-wordfill`, scroll-driven CSS avec repli JS), tracés SVG qui se dessinent (`.draw` + `pathLength`), compteurs sourcés, un seul bandeau défilant (accueil). Tout est neutralisé sous `prefers-reduced-motion` et **sans JS tout le contenu reste visible** (états masqués gated par `html.js`).
- **Interdits maintenus** : aucun tiret long dans la copie visible, pas de rangée de trois cartes identiques, étiquettes de section rationnées.

Tous les tokens sont des variables CSS en haut de `assets/css/styles.css`.

## La carte

`carte-donnees/carte.html` **embarque la carte officielle du gouvernement du Québec (MRNF)** en iframe (`https://zonesinondables.mrnf.gouv.qc.ca/`), avec lien de repli et légende officielle verrouillée. Les « Liens officiels » de la page restent des stubs `quebec.ca` à pointer vers les URL exactes avant mise en ligne.

## Internationalisation (V2)

Le sélecteur **FR/EN** est présent dans le header mais **désactivé**. Pour ajouter l'anglais : isoler les chaînes, dupliquer l'arborescence sous `/en/` (ou injecter les traductions) et activer le sélecteur.

---

## Précautions sur les données (à respecter)

- **Toujours afficher la source** près des chiffres.
- **Élargissement ~30 %** et **25 000 → 35 000 logements** : estimations gouvernementales (juin 2025), à formuler comme estimations.
- **Seuils des classes de risque** (ex. « très élevée ») : **à valider sur le guide méthodologique officiel du MELCCFP** avant publication.
- **Impacts sur la valeur foncière** : rester qualitatif ; pas de pourcentages issus de sources commerciales sans réserve.
- **Avertissement légal** présent dans le footer de chaque page et sur la carte.

## Crédits

- Concept scientifique : Biron, Buffin-Bélanger, Larocque et al. (Concordia / Ouranos, 2013).
- Cadre réglementaire : MELCCFP / gouvernement du Québec.
- Photos : Unsplash (à remplacer/créditer formellement avant production).

## Déploiement

- **Vercel** : `vercel.json` (`cleanUrls`, `trailingSlash: false`), `404.html` personnalisée.
- Les chemins étant **absolus**, le site fonctionne tel quel sur un **domaine racine**. Sur un *project site* GitHub Pages (`user.github.io/repo/`), les chemins `/assets/...` ne se résolvent pas : utilisez un domaine personnalisé, un site `user.github.io`, ou adaptez avec une `<base>` / des chemins relatifs.

## Licence

Contenu sous licence libre, sources créditées. (Préciser la licence exacte avant publication.)
