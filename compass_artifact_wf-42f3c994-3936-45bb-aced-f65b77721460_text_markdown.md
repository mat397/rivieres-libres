# Brief de recherche — Architecture d'un portail de ressources sur les espaces de liberté des rivières et les zones inondables au Québec

## TL;DR
- Un portail standalone est pertinent et opportun : le Québec vit en 2026 sa plus grande refonte réglementaire et cartographique des milieux hydriques (cadre modernisé adopté le 12 juin 2025, en vigueur le 1er mars 2026), créant une forte demande d'information chez les trois publics cibles, mais aucune plateforme indépendante ne relie aujourd'hui vulgarisation, outils techniques et le concept scientifique d'« espace de liberté ».
- L'architecture optimale combine une entrée thématique (le contenu) ET une entrée par audience (citoyens / OBV-municipalités-MRC / professionnels), avec une carte interactive comme pièce maîtresse, un hub réglementaire tenu à jour et un centre de ressources documentaires.
- Le positionnement distinctif du portail doit être le pont entre le concept scientifique d'« espace de liberté » (Biron/Buffin-Bélanger/Larocque, 2013) et le nouveau cadre réglementaire de « zones de mobilité des cours d'eau », deux notions cousines mais distinctes qu'aucun site existant n'articule clairement.

## Key Findings

### 1. Le concept d'espace de liberté : un socle scientifique solide et québécois
L'« espace de liberté » est défini comme la somme de l'espace de mobilité (dynamique latérale du lit) et de l'espace d'inondabilité (récurrence de crues de différentes magnitudes), incluant les milieux humides riverains. Le travail fondateur est le rapport « Espace de liberté : un cadre de gestion intégrée pour la conservation des cours d'eau dans un contexte de changements climatiques » (Biron, Buffin-Bélanger, Larocque et al., Université Concordia/Ouranos, 2013, 167 p.), financé par le Fonds vert. La méthode est hydrogéomorphologique : analyse de photos aériennes historiques, modèles numériques d'altitude (LiDAR), observations terrain, mesures nappe/rivière et simulations numériques en climat futur.

Le cadre distingue trois niveaux d'inondabilité (N1 très fréquente/forts courants, N2 fréquente/faible courant, N3 peu fréquente), deux niveaux de mobilité (M1 court terme 50 ans, M2 amplitude des méandres), puis une cartographie simplifiée à deux zones : **L1** (espace minimal, sans aménagement) et **L2** (espace fonctionnel, à protéger). Cas d'application : rivières de la Roche et Yamaska Sud-Est (Montérégie), Matane (Gaspésie), puis Neigette et Mitis (Bas-Saint-Laurent), Coaticook (Estrie, prix Inspiration MMQ 2019) et quatre cours d'eau de la MRC d'Argenteuil (du Nord, Saint-André, de l'Ouest, ruisseau des Vases). L'analyse avantages-coûts du rapport Biron et al. 2013 conclut que « des gains nets variant entre 0,7 et 3,7 millions de dollars sont estimés sur une période de 50 ans » (soit un ratio avantages/coûts de 1,5:1 à 4,8:1 pour les rivières de la Roche, Yamaska Sud-Est et Matane), malgré la compensation aux agriculteurs.

### 2. Le cadre réglementaire 2026 : la nouvelle référence à vulgariser
Le cadre réglementaire modernisé en milieux hydriques, adopté le 12 juin 2025 et en vigueur depuis le 1er mars 2026, remplace le régime transitoire de 2022. Il est composé de plusieurs règlements, dont le Règlement sur les ouvrages de protection contre les inondations (ROPI), le Règlement sur l'encadrement d'activités sous la responsabilité des municipalités (RMUN), le Règlement sur les activités dans des milieux humides, hydriques et sensibles (RAMHHS), et des ajustements au REAFIE. Il s'appuie sur un Guide méthodologique officiel du MELCCFP (volet technique et scientifique, volet cartographie réglementaire, annexes).

Le changement cartographique majeur : on passe de l'ancien système à deux zones (grand courant 0-20 ans / faible courant 20-100 ans) à une nouvelle génération à **quatre classes d'intensité** (faible/jaune, modérée/orange, élevée/rouge, très élevée/rouge foncé) plus une cinquième catégorie, la **zone protégée à risque résiduel** (derrière un ouvrage de protection reconnu). Selon les définitions gouvernementales du MELCCFP (relayées par Radio-Canada et La Presse), la classe « très élevée » correspond à un risque de plus de 70 % d'être inondé au moins une fois sur un horizon de 25 ans, avec une profondeur d'eau pouvant dépasser 60 cm. S'ajoutent les **zones de mobilité des cours d'eau** (court terme 50 ans, long terme).

L'ampleur du changement a été chiffrée par le ministre de l'Environnement Benoit Charette en conférence de presse le 12 juin 2025 (rapporté par La Presse) : « On est actuellement à plus ou moins 25 000 [logements situés en zones inondables] et ce nombre augmenterait de 30 %, on serait donc à 35 000 résidences. » La cartographie est produite dans le cadre du projet INFO-Crue (MELCCFP, depuis 2018, avec Ouranos), avec délégation à la CMM (via son Bureau des inondations et de la résilience climatique, BIRC, à l'œuvre depuis 2017) et à des MRC mandataires comme Vaudreuil-Soulanges. Les premières cartes publiées au 1er mars 2026 devraient couvrir environ 75 % de la population.

Contexte déclencheur : les inondations de 2017 et 2019. Selon le ministre Charette (12 juin 2025), elles ont coûté « plus d'un milliard de dollars de fonds publics, investis notamment [en] indemnisations ». Les analyses universitaires (B. Deschamps, UQAM, via The Conversation) précisent qu'elles ont affecté respectivement 293 et 240 municipalités, le gouvernement ayant déboursé près d'un milliard $ et les assureurs privés environ 500 M$. La zone protégée à risque résiduel répond directement à des cas comme Sainte-Marthe-sur-le-Lac : selon le ministre Charette, Québec a répertorié 32 ouvrages de protection contre les inondations (OPI) et, sans la reconnaissance de la digue, « environ 2000 des 8500 résidences » de cette municipalité auraient été classées en zone inondable.

### 3. Un écosystème d'acteurs et d'outils riche mais fragmenté
Acteurs gouvernementaux : MELCCFP (cadre réglementaire, INFO-Crue, guide méthodologique), MAMH (bureaux de projets-Inondations, PRAFI), MRNF (diffusion géospatiale), MSP (sécurité civile, aide aux sinistrés). Acteurs de gouvernance : les 40 organismes de bassins versants (OBV) reconnus, coordonnés par le ROBVQ (créé en novembre 2001, interlocuteur privilégié du MELCCFP pour la gestion intégrée de l'eau par bassin versant depuis le redécoupage de 2009), la CMM/BIRC, la CMQ, les MRC et municipalités. Acteurs scientifiques : Ouranos, RIISQ, INRS, et universités (Concordia, UQAM, UQAR, Sherbrooke), CERIU, RQES.

Outils géospatiaux existants : Carte interactive des zones inondables et de mobilité des cours d'eau (MRNF), Géo-Inondations, Atlas de l'eau, Atlas hydroclimatique (CEHQ, horizons 2050/2080), Données Québec (Géobase du réseau hydrographique du Québec, grille de présence possible, données LiDAR/MNT), et la plateforme inondations.uqam.ca (RIISQ) qui cartographie outils, connaissances et expertises. Côté vulgarisation : la Trousse d'information pour les citoyens et le napperon explicatif d'interprétation des cartes du MELCCFP.

### 4. Benchmarks : la France comme modèle d'articulation contenu/carte
En France, Géorisques (MTECT/BRGM) est le portail national de référence sur les risques, avec carte interactive, dossiers experts et données téléchargeables (TRI, PPRi, AZI). L'Agence de l'eau Rhône Méditerranée Corse promeut l'« espace de bon fonctionnement » (EBF) des rivières — l'équivalent conceptuel français de l'espace de liberté — avec guides, financements (50 % de subvention type) et l'application grand public « Qualité Rivière ». Vigicrues fournit la prévision des crues en temps réel. Ces modèles montrent la valeur d'un site de référence unique articulant aléa, enjeux et solutions, et l'intérêt de séparer clairement contenu réglementaire, données et pédagogie.

### 5. Architecture de l'information : double entrée audience/thème
Les bonnes pratiques convergent : structurer selon la logique de l'utilisateur (et non de l'émetteur), partir de personas, éviter les silos, offrir une navigation à double entrée. Pour un public mixte, la solution éprouvée est une navigation principale thématique doublée de portes d'entrée par audience dès la page d'accueil, chacune menant à des parcours adaptés.

## Details

### Distinction clé à expliciter dans le portail
Le portail doit clarifier la relation entre deux notions souvent confondues :
- **Espace de liberté** : concept scientifique/de gestion intégrée (volontaire, hydrogéomorphologique), visant à laisser la rivière évoluer ; échelle de bassin/tronçon ; promu par les chercheurs et OBV.
- **Zone de mobilité des cours d'eau** : notion désormais réglementaire (cadre 2026), opposable, cartographiée par le gouvernement, avec classes d'intensité et règles d'aménagement.

C'est précisément ce pont qui justifie un portail standalone : aucune plateforme existante ne fait le lien pédagogique entre le concept et son entrée dans le droit.

### Acteurs scientifiques (précisions)
Le **RIISQ (Réseau Inondations InterSectoriel du Québec)**, créé en 2019 et financé par les Fonds de recherche du Québec (FRQ), est un réseau inter-établissements regroupant des chercheurs de nombreuses universités québécoises. Sa mission officielle (riisq.ca) est de « contribuer à la réduction des risques d'inondations et de leurs conséquences en facilitant la résilience des organisations, des communautés et des individus vulnérables, et en favorisant les maillages entre la société civile et les universités ». Il couvre cinq axes (risques ; gestion des territoires/gouvernance ; impacts biopsychosociaux et coûts ; réduction des vulnérabilités ; gestion/communication des risques) et produit la plateforme inondations.uqam.ca, une bibliographie, des webinaires et un livre collectif. L'**INRS (Centre Eau Terre Environnement)** abrite, selon l'institut, la plus forte concentration d'expertise scientifique académique en eau au Canada, avec un programme Hydrologie (prévision de crues et d'embâcles, hydraulique environnementale, modèle HYDROTEL) et des chercheurs comme Alain Mailhot et Karem Chokmani impliqués dans la cartographie des zones inondables. Les deux organismes collaborent étroitement (l'INRS a hébergé des activités du RIISQ).

### Enjeux propriétaires et municipalités
Pour les riverains : dépréciation foncière (l'analyse d'impact réglementaire du MELCCFP retient environ 4 % pour un immeuble nouvellement classé en zone très élevée ; des sources commerciales — courtiers et assureurs — avancent 1-4 % pour un nouveau classement et jusqu'à 11-22 % en zone à risque élevé, chiffres à traiter avec prudence), difficultés d'assurabilité et de financement hypothécaire, restrictions de travaux selon la classe (interdiction de nouvelles constructions en zone très élevée, reconstruction conditionnelle en zones élevée/modérée, travaux d'adaptation permis). Pour les municipalités/MRC : responsabilité des permis, possibilité de plans de gestion, encadrement des OPI (étude de performance), accès aux financements (PRAFI volets aménagements résilients et relocalisation, enveloppe de 345 M$ ; Plan de protection du territoire face aux inondations doté de 479 M$ ; PGDEP pour les eaux pluviales, 20 M$ 2025-2027).

### Proposition d'architecture de pages

**Page d'accueil** : message clair, accès à la carte interactive, trois portes d'entrée par audience, actualités (cartographie publiée progressivement).

**Section A — Comprendre (vulgarisation, tous publics)**
- Qu'est-ce que l'espace de liberté d'une rivière ?
- Mobilité et inondabilité des cours d'eau (hydrogéomorphologie vulgarisée)
- Changements climatiques et risques d'inondation au Québec
- Pourquoi laisser de l'espace aux rivières (services écologiques, milieux humides)
- Glossaire et FAQ

**Section B — Carte et données (outils)**
- Carte interactive (zones inondables, zones de mobilité, espace de liberté)
- Comment lire les cartes (classes d'intensité, napperon)
- Données ouvertes, LiDAR, MNT, méthodes et guide méthodologique
- Liens vers Géo-Inondations, Atlas hydroclimatique, inondations.uqam.ca

**Section C — Cadre réglementaire**
- Le cadre modernisé 2026 (ROPI, RMUN, RAMHHS)
- Ancienne vs nouvelle génération de cartographie
- Travaux permis/interdits par zone

**Section D — Agir / Solutions**
- Solutions fondées sur la nature, renaturalisation, génie végétal
- Aménagement résilient, adaptation, relocalisation
- Financements disponibles

**Section E — Espaces par audience**
- Citoyens/riverains ; OBV-municipalités-MRC ; professionnels

**Section F — Ressources et acteurs** : bibliothèque documentaire, études de cas, répertoire d'acteurs.

### Sections par public cible
- **Grand public/citoyens** : « Ma propriété est-elle concernée ? », impacts (valeur, assurance, permis), travaux d'adaptation, vulgarisation, FAQ.
- **OBV/municipalités/MRC** : cadre réglementaire opérationnel, plans de gestion, financements (PRAFI), études de cas (Coaticook, Argenteuil), accompagnement (bureaux de projets, BIRC), données pour l'aménagement.
- **Professionnels (biologistes, ingénieurs)** : guide méthodologique, méthodes hydrogéomorphologiques, données géospatiales brutes, littérature scientifique, normes des OPI.

## Recommandations
1. **Adopter une architecture à double entrée** (thématique + audience) avec la carte interactive en pièce maîtresse dès l'accueil. Bâtir l'arborescence avant le design, à partir de personas des trois publics.
2. **Faire du pont concept/réglementation le positionnement éditorial central** : c'est l'angle distinctif que ne couvre aucun site existant.
3. **Ne pas redévelopper les outils gouvernementaux** (carte officielle, Atlas) : les intégrer/lier et concentrer la valeur ajoutée sur la pédagogie, la curation et les études de cas québécoises.
4. **Hiérarchiser le contenu réglementaire en couches** (résumé grand public → détail professionnel) pour servir les trois publics sans surcharge cognitive.
5. **Prévoir une gouvernance de mise à jour** vu la publication progressive des cartes de nouvelle génération (2026 et années suivantes).

Seuils qui changeraient ces recommandations : si le gouvernement lançait son propre portail grand public intégré (au-delà de Québec.ca), le positionnement devrait pivoter vers la niche « espace de liberté/solutions fondées sur la nature » plutôt que la réglementation.

## Caveats
- Plusieurs chiffres d'impact foncier (1-4 %, 11-22 %) proviennent de sources commerciales (courtiers/assureurs) et doivent être traités avec prudence ; l'analyse d'impact du MELCCFP retient ~4 % pour un immeuble basculant en classe très élevée.
- L'élargissement de ~30 % des zones et le nombre de logements (~25 000 → 35 000) sont des estimations gouvernementales annoncées par le ministre Charette le 12 juin 2025, sujettes à ajustement à mesure que les cartes régionales sont finalisées (la CMM a d'ailleurs assoupli certains critères en 2025).
- La définition de la zone « très élevée » (>70 % sur 25 ans, >60 cm) est tirée de relais médiatiques des paramètres du MELCCFP ; certaines sources secondaires mentionnent un seuil de profondeur de 30 cm, à vérifier sur le guide méthodologique officiel.
- L'année de création du RIISQ (2019) est reprise de sources secondaires et mériterait confirmation sur la source primaire (riisq.ca).