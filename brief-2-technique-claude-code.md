# Brief 2 — Brief technique pour Claude Code
## Build du site « Rivières Libres » (HTML/CSS/JS)

> Spec destinée à Claude Code. Objectif : produire un site statique multipage, responsive, accessible, en français (prêt pour FR/EN), à partir du contenu ci-dessous. Le contenu rédactionnel fourni est du **brouillon prêt à intégrer** — l'affiner mais en garder le sens et les sources.

---

## 1. Contraintes techniques

- **Stack :** HTML5 sémantique + CSS moderne (variables CSS, Flexbox/Grid) + JavaScript vanilla. **Aucun framework** requis pour le MVP. Pas de build step obligatoire.
- **Multipage statique** : un fichier HTML par page, CSS et JS partagés.
- **Responsive** : mobile-first, breakpoints à 640px / 1024px / 1280px.
- **Accessibilité : viser WCAG 2.1 AA.** Landmarks ARIA, navigation clavier, focus visibles, contrastes conformes, `alt` sur toutes les images, schémas accompagnés d'un texte alternatif.
- **Performance** : images en `loading="lazy"`, formats modernes (WebP/AVIF avec fallback), polices préchargées.
- **SEO** : balises `<title>`/`<meta description>` par page, Open Graph, données structurées `Organization` + `WebSite`, `lang="fr-CA"`, URLs propres.
- **i18n-ready** : structurer pour ajouter l'anglais en V2 (textes isolables, attribut `lang`, sélecteur prévu dans le header même si inactif).
- **Pas de localStorage/sessionStorage** dans des artifacts rendus côté client si testés dans un environnement contraint; pour le site réel, OK.
- **Avertissement légal** obligatoire dans le footer (valeur indicative, pas de portée légale).

### Structure de fichiers proposée
```
/
├── index.html
├── comprendre/
│   ├── espace-de-liberte.html
│   ├── mobilite-inondabilite.html
│   ├── climat-inondations.html
│   ├── pourquoi-espace.html
│   └── glossaire-faq.html
├── carte-donnees/
│   ├── carte.html
│   ├── lire-les-cartes.html
│   └── donnees-methodes.html
├── cadre-reglementaire/
│   ├── cadre-2026.html
│   ├── ancienne-nouvelle-carto.html
│   └── permis-par-zone.html
├── agir/
│   ├── solutions-nature.html
│   ├── amenagement-resilient.html
│   └── financements.html
├── pour-vous/
│   ├── citoyens.html
│   ├── municipalites-obv.html
│   └── professionnels.html
├── ressources/
│   ├── bibliotheque.html
│   ├── etudes-de-cas.html
│   └── repertoire-acteurs.html
├── a-propos.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   ├── img/
│   └── fonts/
└── partials/  (header.html / footer.html à inliner ou injecter via JS)
```

**MVP à construire en priorité :** `index.html`, les 5 pages `comprendre/`, `carte-donnees/carte.html` + `lire-les-cartes.html`, `cadre-reglementaire/cadre-2026.html`, les 3 pages `pour-vous/`, `a-propos.html`. Le reste = pages d'attente structurées.

---

## 2. Design system (tokens CSS)

```css
:root {
  /* Couleurs — eau & rivière */
  --color-deep:    #0E3A52;  /* bleu profond — header, titres */
  --color-river:   #1E8AA0;  /* turquoise — liens, accents */
  --color-river-2: #4FB3C4;  /* turquoise clair — hover */
  --color-nature:  #5E8C3F;  /* vert — solutions nature */
  --color-sand:    #DBB36A;  /* sable/ocre — plaine inondable */

  /* Neutres */
  --color-ink:     #1A2226;  /* texte principal */
  --color-slate:   #5C6B73;  /* texte secondaire */
  --color-mist:    #EEF3F5;  /* fonds de section */
  --color-paper:   #FFFFFF;
  --color-border:  #D6E0E4;

  /* Code de risque officiel (légende carte — NE PAS détourner ailleurs) */
  --risk-faible:      #F2D14E;  /* jaune */
  --risk-moderee:     #E8923A;  /* orange */
  --risk-elevee:      #D64545;  /* rouge */
  --risk-tres-elevee: #9B2C2C;  /* rouge foncé */
  --risk-residuel:    #7A8FA6;  /* gris-bleu hachuré */

  /* Typographie */
  --font-display: "Fraunces", Georgia, serif;   /* titres — caractère éditorial */
  --font-body:    "Inter", system-ui, sans-serif;
  --fs-base: 1.0625rem;  /* ~17px */
  --lh-body: 1.65;

  /* Espacement (échelle 4px) */
  --space-1: .25rem; --space-2: .5rem; --space-3: 1rem;
  --space-4: 1.5rem; --space-5: 2rem; --space-6: 3rem; --space-8: 5rem;

  /* Rayons & ombres */
  --radius: 12px;
  --shadow: 0 4px 16px rgba(14,58,82,.08);
  --maxw: 1180px;
}
```

- Polices via Google Fonts (Fraunces + Inter) avec `preconnect` et `display=swap`. Pairing swappable.
- Boutons : primaire (fond `--color-river`, texte blanc), secondaire (contour `--color-deep`). États hover/focus visibles.
- Style général : éditorial, aéré, beaucoup de blanc, photos de rivières en pleine largeur, schémas vectoriels propres. Éviter le look « brochure gouvernementale » ; viser crédible mais vivant.

---

## 3. Composants à coder (réutilisables)

1. **`site-header`** : logo (texte « Rivières Libres » + glyphe rivière SVG), nav 4 items, bouton « Vérifier une adresse », sélecteur FR/EN. Sticky. Menu hamburger sous 1024px.
2. **`site-footer`** : mission, liens par section, avertissement légal, crédits sources, contact.
3. **`audience-cards`** : 3 cartes (Citoyens / Municipalités-MRC-OBV / Professionnels).
4. **`concept-diagram`** : schéma SVG « mobilité + inondabilité = espace de liberté ».
5. **`comparison-table`** : tableau responsive (devient empilé en mobile).
6. **`accordion`** : FAQ, règlements, travaux permis. Accessible (`aria-expanded`, clavier).
7. **`case-card`** : aperçu d'étude de cas (image, titre, lieu, résumé, lien).
8. **`callout`** : encadré contextuel (info / contexte / avertissement) avec variantes de couleur.
9. **`legend`** : légende des classes de risque (réutilise les tokens `--risk-*`).
10. **`map-embed`** : conteneur carte. MVP = placeholder stylé (image + overlay + champ de recherche non fonctionnel) avec commentaire `<!-- TODO: intégrer service WMS/carte officielle -->`. Prévoir Leaflet en V2.
11. **`breadcrumb`**, **`zone-selector`** (sélecteur de classe → affiche les règles via JS).

---

## 4. Contenu par page (brouillon à intégrer)

> Tous les chiffres ci-dessous sont sourcés mais doivent porter une mention de source visible. Voir §5 Précautions.

### index.html
- **Hero** — Titre : « Les rivières ont besoin d'espace. » Sous-titre : « Comprendre l'espace de liberté des rivières et les zones inondables au Québec — pour les citoyens, les municipalités et les professionnels. » Boutons : *Vérifier une adresse* (→ carte) / *Comprendre le concept* (→ espace-de-liberte).
- **Audience cards** — 3 cartes (libellés + une phrase chacune, liens vers pages audience).
- **Le concept en 30 secondes** — Court paragraphe + `concept-diagram`. « Une rivière n'est pas figée comme une route. Elle se déplace latéralement et déborde naturellement. L'espace de liberté, c'est la place dont elle a besoin pour le faire en sécurité : la somme de son espace de mobilité et de son espace d'inondabilité. » Lien « En savoir plus ».
- **Pourquoi maintenant** — `callout` contexte : « Depuis le 1ᵉʳ mars 2026, un nouveau cadre réglementaire encadre les zones inondables et les zones de mobilité des cours d'eau au Québec. De nouvelles cartes, publiées progressivement, redéfinissent les secteurs à risque. » (Source : MELCCFP / gouvernement du Québec.)
- **Aperçu carte** — `map-embed` réduit + CTA.
- **Solutions en vedette** — 3 `case-card` : Coaticook, MRC d'Argenteuil, rivière Matane.
- **Ressources récentes** — 3 placeholders.
- **CTA fin** — infolettre + contact.

### comprendre/espace-de-liberte.html
- **Intro** — « Pendant longtemps, on a géré les rivières comme des canaux à dompter : enrochement, murets, redressement. L'approche de l'espace de liberté propose l'inverse — redonner à la rivière la place d'évoluer. »
- **`concept-diagram`** + légende des 3 composantes : espace de mobilité (déplacement latéral du lit), espace d'inondabilité (zone des crues), milieux humides riverains (éponges naturelles).
- **Bloc différenciateur — `comparison-table`** « Espace de liberté vs zone de mobilité » :
  | | Espace de liberté | Zone de mobilité des cours d'eau |
  |---|---|---|
  | Nature | Concept scientifique / de gestion | Notion réglementaire |
  | Portée | Volontaire, gestion intégrée | Opposable, encadrée par règlement |
  | Délimitation | Hydrogéomorphologique (chercheurs, OBV) | Cartographie gouvernementale officielle |
  | Échelle | Tronçon / bassin versant | Parcelle / territoire municipal |
  | Depuis | Travaux de 2013 (Concordia/Ouranos) | Cadre en vigueur le 1ᵉʳ mars 2026 |
- **Origines au Québec** — `callout` : approche développée par Pascale Biron (Concordia), Thomas Buffin-Bélanger (UQAR) et Marie Larocque (UQAM), rapport Concordia/Ouranos 2013.
- **L1 / L2** — « L1 : l'espace minimal vital de la rivière, où aucun aménagement ne devrait avoir lieu. L2 : l'espace fonctionnel plus large, à protéger pour que la dynamique naturelle opère, aujourd'hui et en climat futur. »

### comprendre/mobilite-inondabilite.html
- **Espace de mobilité** — déplacement latéral, méandres, érosion ; idéalement visuel avant/après.
- **Espace d'inondabilité** — récurrence des crues, plaine inondable, milieux humides comme zones tampons.
- **Méthode (vulgarisée)** — « On délimite ces espaces en croisant des photos aériennes historiques, des relevés LiDAR, des modèles numériques de terrain et des simulations de crues en climat futur. » Lien vers Données & méthodes.
- **Mini-glossaire** — accordéon : hydrogéomorphologie, récurrence, étiage, embâcle.

### comprendre/climat-inondations.html
- **Contexte** — crues plus fréquentes, étiages plus marqués sous l'effet des changements climatiques.
- **Rappel 2017 & 2019** — `callout` factuel : inondations majeures ayant coûté plus d'un milliard de dollars de fonds publics; 2017 et 2019 ont touché respectivement ~293 et ~240 municipalités. (Sources : gouvernement du Québec / analyses universitaires — à citer.)
- **Projections** — lien vers l'Atlas hydroclimatique (horizons 2050 / 2080).
- **Pourquoi les zones s'élargissent** — « Les nouvelles cartes élargissent les zones inondables d'environ 30 %. Comme l'a précisé le gouvernement, il ne s'agit pas de créer de nouvelles zones, mais d'identifier plus justement celles qui existent déjà. » (Source : ministre de l'Environnement, juin 2025 — voir précautions §5.)

### comprendre/pourquoi-espace.html
- **Services écologiques** — biodiversité, qualité de l'eau, recharge des nappes, habitats.
- **Sécurité & économie** — « Sur 50 ans, protéger l'espace de liberté s'avère rentable : les études québécoises estiment un ratio avantages/coûts de 1,5:1 à 4,8:1 selon les rivières. » (Source : Biron et al., 2013.)
- **`comparison-table`** — « Dompter » (enrochement, murets, réparations répétées) vs « génie vert » (renaturalisation, milieux humides).

### comprendre/glossaire-faq.html
- **Recherche** + **glossaire A-Z** (accordéons) + **FAQ par audience** (3 groupes d'accordéons).
- Termes minimaux : espace de liberté, espace de mobilité, espace d'inondabilité, zone de mobilité des cours d'eau, zone de grand courant, classes d'intensité, zone protégée à risque résiduel, récurrence, embâcle, OPI, hydrogéomorphologie.

### carte-donnees/carte.html
- **`map-embed` plein écran** (placeholder MVP) avec champ de recherche d'adresse, panneau de couches (zones inondables / zones de mobilité / espace de liberté / milieux humides), `legend`, et avertissement.
- **Panneau latéral** simulé : à la sélection, résumé + liens « Que faire ? » / « Travaux permis ».
- **Liens officiels** — carte gouvernementale des zones inondables et de mobilité, Géo-Inondations, Atlas de l'eau.
- Commentaire technique : `<!-- V2: intégrer Leaflet + couches WMS officielles MELCCFP/MRNF -->`.

### carte-donnees/lire-les-cartes.html
- **Classes d'intensité** — `legend` détaillée : faible, modérée, élevée, très élevée + zone protégée à risque résiduel. Décrire chaque classe en une phrase. (Vérifier les seuils exacts sur le guide méthodologique avant publication — voir §5.)
- **`comparison-table`** ancienne → nouvelle génération (0-20 ans / 20-100 ans → 4 classes).
- **Limites** — `callout` avertissement : valeur indicative, limites officielles auprès de la municipalité.

### cadre-reglementaire/cadre-2026.html
- **Vue d'ensemble** — « Adopté le 12 juin 2025, le cadre réglementaire modernisé en milieux hydriques est en vigueur depuis le 1ᵉʳ mars 2026. Il remplace le régime transitoire instauré en 2022. »
- **Les règlements** — 3 `callout`/cartes : ROPI (ouvrages de protection contre les inondations), RMUN (activités sous responsabilité municipale), RAMHHS (activités en milieux humides, hydriques et sensibles).
- **Qui fait quoi** — liste : MELCCFP (cadre, INFO-Crue, guide méthodologique), MAMH, CMM/BIRC, CMQ, MRC, municipalités.
- **Calendrier** — publication progressive des cartes de nouvelle génération depuis mars 2026.

### pour-vous/citoyens.html
- Bloc « Ma propriété est-elle concernée ? » (CTA carte) ; « Ce que ça change » (valeur, assurabilité, permis) ; « Travaux d'adaptation possibles » ; FAQ citoyens ; « Qui contacter ».

### pour-vous/municipalites-obv.html
- Cadre réglementaire opérationnel ; plans de gestion & délégation de cartographie ; financements (PRAFI, bureaux de projets-Inondations) ; études de cas (Coaticook, Argenteuil) ; données pour l'aménagement.

### pour-vous/professionnels.html
- Guide méthodologique & méthodes hydrogéomorphologiques ; données géospatiales (Données Québec, GRHQ, LiDAR) ; littérature scientifique ; normes des OPI.

### a-propos.html
- Mission, porteurs, sources & partenaires (MELCCFP, Ouranos, RIISQ, ROBVQ, universités), contact, infolettre, avertissement.

### Pages V2 (créer en gabarit « bientôt disponible » structuré)
`donnees-methodes.html`, `ancienne-nouvelle-carto.html`, `permis-par-zone.html`, les 3 pages `agir/`, les 3 pages `ressources/`.

---

## 5. Précautions sur les données (à respecter dans le contenu)
- **Toujours afficher la source** près des chiffres (logo/texte court + lien).
- **Élargissement ~30 % et ~25 000 → 35 000 logements** : estimations gouvernementales annoncées en juin 2025, sujettes à ajustement régional. Formuler comme estimation, pas comme fait définitif.
- **Seuils des classes de risque** (ex. « très élevée » = >70 % sur 25 ans, profondeur >60 cm) : tirés de relais médiatiques; **à valider sur le guide méthodologique officiel du MELCCFP avant mise en ligne**. En attendant, formuler prudemment.
- **Impacts sur la valeur foncière** : ne pas avancer de pourcentages précis issus de sources commerciales sans réserve; rester qualitatif ou citer l'analyse d'impact réglementaire officielle.
- **Avertissement légal** : présent sur la carte et dans le footer de chaque page.

---

## 6. Livrable attendu de Claude Code
1. Le squelette complet (toutes les pages du MVP + gabarits V2).
2. `styles.css` avec les tokens ci-dessus et tous les composants.
3. `main.js` : menu mobile, accordéons accessibles, sélecteur de zone, comportements de la carte-placeholder.
4. Contenu intégré (brouillon ci-dessus, affiné mais fidèle).
5. Images : placeholders sémantiques avec `alt` descriptifs (à remplacer par des photos sous licence libre / propres au projet).
6. README court : structure, comment ajouter une page, où brancher la vraie carte (Leaflet + WMS) et l'anglais en V2.
