# Carte interactive « outil de réponse citoyen » — Design

Date : 2026-07-22
Portail : Rivières Libres (portail-zoneinondable)
Statut : design validé, implémentation V1 faite, phase 2 à exécuter

## Objectif

La carte est l'**outil de réponse du citoyen** : il tape ou géolocalise son adresse,
voit sa situation par rapport au risque, et repart en sachant quoi faire. Elle sert
l'objectif du portail (faire le pont science / réglementation, de façon crédible et
**non alarmiste**) pour le public prioritaire : le citoyen anxieux (« ma propriété
est-elle concernée ? »).

La carte remplace l'ancienne iframe MRNF par une carte que le portail contrôle, ce
qui permet d'ajouter des couches, un verdict contextuel et une orientation vers
l'action. La carte officielle du gouvernement reste liée en complément.

## Contrainte non négociable (site civique)

Les données sont **indicatives, sans portée légale**. Toute information affichée à
propos d'un terrain est cadrée par un avertissement, et renvoie systématiquement à la
municipalité / aux outils officiels. Aucune affirmation catégorique sur le statut
réglementaire d'une propriété.

## Architecture technique

- **Moteur** : MapLibre GL JS (open source, sans clé ni token). Chargé sur la seule
  page carte via `headExtra` dans `tools/pages/carte.mjs`.
- **Logique** : `assets/js/carte.js` (vanilla, autonome, respecte reduced-motion).
- **Aucune dépendance à Mapbox.** Aucun token exposé.

### Trois familles de couches (par nature de donnée)

| Famille | Exemples | Hébergement | Poids client |
|---|---|---|---|
| WMS raster officiel | zones inondables, milieux humides, municipalités | serveurs gouv. Québec | à la demande (~0) |
| PMTiles (vecteur, gros volume) | référentiel des bâtiments du Québec | Cloudflare R2 (nous) | à la demande par tuile |
| GeoJSON (vecteur, petit volume) | espace de liberté calculé (futur) | repo / site | quelques Ko-Mo |

### Ordre d'empilement des couches (crucial)

De bas en haut :
1. Fond de carte clair (CARTO Positron, tuiles raster gratuites)
2. **Zones inondables** (WMS, rouge translucide)
3. Milieux humides potentiels (WMS, vert) — optionnel
4. Municipalités / MRC (WMS, contours) — optionnel
5. **Bâtiments** (PMTiles) — PAR-DESSUS les zones inondables, pour que le citoyen
   voie si son bâtiment tombe dans le rouge
6. Marqueur d'adresse recherchée (au sommet)

## Couches — sources vérifiées (2026-07, toutes CC-BY 4.0)

| Couche | Endpoint / source | Nom couche | Statut |
|---|---|---|---|
| Zones inondables (grille) | `servicesvecto3.mern.gouv.qc.ca/geoserver/GrilleInfoZI_Pub/wms` | `GrilleInfoZI` | WMS ✅ |
| Milieux humides potentiels | `geo.environnement.gouv.qc.ca/donnees/services/Biodiversite/MH_potentiels/MapServer/WMSServer` | `Milieux_humides_potentiels11904` | WMS ✅ |
| Municipalités / MRC | `servicescarto.mrnf.gouv.qc.ca/pes/services/Territoire/SDA_WMS/MapServer/WMSServer` | `3` (muni), `4` (MRC), `5` (région) | WMS ✅ |
| Bâtiments (référentiel) | GPKG local `D:\GIS\Base de donnees\GOUV_QC\Infrastructure et occupation\Batiment (referentiel)\RefBati_GPKG.zip` | `Referentiel_batiment` | 1,7 Go, EPSG:32198, à tuiler |
| Zones de mobilité | pas d'endpoint public stable (nouvelle génération, déploiement progressif) | — | reporté phase 3 |

## Fonctionnalités

### V1 (faite) — le parcours citoyen minimal

1. **Recherche d'adresse** + marqueur (géocodage Nominatim, biaisé Québec). Fait.
2. **Géolocalisation « autour de moi »** (bouton, API navigateur). À finir.
3. **Couches activables** : zones inondables ON par défaut, milieux humides et
   municipalités en option. Fait (à affiner : ordre, opacités).
4. **Panneau « prochaines étapes »** affiché après une recherche : les 3 gestes
   citoyens (vérifier / confirmer municipalité / adapter), lien municipalité, lien
   page adaptation. À faire.
5. **Avertissement légal permanent** visible sur la carte (pas seulement en pied de
   page). À faire.

### Phase 2 — profondeur et précision

6. **Bâtiments du Québec (référentiel provincial) en PMTiles**, par-dessus les zones
   inondables. Emprise : **Québec méridional habité** (pas toute la province).
   Hébergé sur Cloudflare R2.
7. **Verdict spatial prudent** : test point-dans-polygone côté client, formulation
   ultra-prudente (« votre secteur touche une zone cartographiée » / « ne semble pas
   en toucher »), avertissement à chaque affichage. Exige une couche vecteur locale.
8. **Résumé partageable / imprimable** (adresse, couches actives, date, avertissement).
9. **Explications au clic** sur une couche (ex. ce qu'est un « milieu humide
   potentiel »).

### Phase 3+ — quand la donnée / le besoin existe

10. Zones de mobilité des cours d'eau (quand le MRNF publie un endpoint stable).
11. Fond satellite optionnel.
12. Marqueurs de cas réels (Coaticook, Matane…).

## Chaîne de traitement des bâtiments (phase 2)

Outils : Docker (déjà actif), image `klokantech/tippecanoe` (v1.24.1, testée), GDAL
(via QGIS ou l'image). On ne sert jamais le GPKG brut.

1. **Extraire** `RefBati_GPKG.zip` (634 Mo → GPKG 1,7 Go) dans un scratch temporaire.
2. **Découper + reprojeter** avec `ogr2ogr` : emprise Québec méridional habité (bbox
   ou jointure sur les régions administratives sud), reprojection EPSG:32198 → 4326,
   sortie GeoJSONSeq ou GPKG allégé. Ne garder que les attributs utiles.
3. **Tuiler** avec tippecanoe (Docker) : générer `batiments-sud.pmtiles` avec des
   niveaux de zoom adaptés (les bâtiments n'apparaissent qu'à partir d'un zoom moyen,
   ex. z12+), simplification légère, drop des micro-polygones aux petits zooms.
4. **Héberger** le `.pmtiles` sur **Cloudflare R2** (gratuit jusqu'à 10 Go, sert les
   PMTiles avec Range requests). Le portail référence son URL publique.
5. **Intégrer** : couche MapLibre `type: vector` via le protocole `pmtiles://`,
   insérée au-dessus des zones inondables.

### Décision d'hébergement

Le `.pmtiles` **ne va pas dans le repo Git** (GitHub refuse > 100 Mo ; Vercel a des
limites de déploiement). Il vit dans un **bucket Cloudflare R2**. C'est une pièce
d'infrastructure assumée, en échange de la précision du référentiel provincial (plus
complet et à jour que les empreintes OSM d'un fond gratuit).

## Attribution / crédits (obligatoire)

- Données : MRNF, MELCCFP (données ouvertes, CC-BY 4.0), attribution dans le contrôle
  d'attribution MapLibre.
- Carte : « réalisée par Alto Géomatique » + logo (badge bas-droite) + lien altogeo.ca.
- Lien vers la carte gouvernementale officielle conservé en complément.

## Hors périmètre (YAGNI)

- Outils de mesure, export de données, dessin : usage « pro », pas le parcours citoyen.
- Comparateur avant/après, multi-fenêtres : complexité sans valeur pour la V1.
- Zones de mobilité tant qu'il n'y a pas d'endpoint public stable.

## Risques

- **WMS gouvernementaux cross-origin** : si un serveur bloque les requêtes depuis le
  navigateur (CORS/referer), la couche reste blanche. Parade : vérifier au navigateur ;
  au besoin, proxy léger ou repli sur la donnée locale tuilée.
- **Poids / temps de génération des bâtiments** : le tuilage du sud reste volumineux ;
  prévoir le disque scratch (~3-4 Go) et un temps de traitement non négligeable.
- **Prudence légale du verdict spatial** : formulation à faire relire ; toujours
  accompagnée de l'avertissement et du renvoi à la municipalité.
