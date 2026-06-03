import { pageHead } from "./_shared.mjs";

const term = (id, label, def) => `          <div class="accordion__item">
            <h3 style="margin:0"><button class="accordion__trigger" aria-expanded="false" aria-controls="${id}">${label}<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button></h3>
            <div class="accordion__panel" id="${id}" hidden><div class="accordion__panel-inner">${def}</div></div>
          </div>`;

export default {
  out: "comprendre/glossaire-faq.html",
  meta: {
    title: "Glossaire et FAQ | Rivières Libres",
    description: "Glossaire des termes clés (espace de liberté, zone de mobilité, zone de grand courant, risque résiduel…) et foire aux questions par audience.",
    canonical: "https://rivieres-libres.example/comprendre/glossaire-faq.html",
    active: "/comprendre/",
  },
  body: `${pageHead(
    "Comprendre",
    "Glossaire &amp; FAQ",
    "Les mots clés pour s'y retrouver, et des réponses par profil.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/comprendre/espace-de-liberte.html", label: "Comprendre" }, { label: "Glossaire & FAQ" }]
  )}

    <section class="section">
      <div class="container">
        <h2 class="mt-0">Glossaire A–Z</h2>
        <div class="accordion">
${term("t-edl", "Espace de liberté", "Concept scientifique réunissant l'espace de mobilité et l'espace d'inondabilité d'une rivière, milieux humides riverains compris. Volontaire et hydrogéomorphologique.")}
${term("t-em", "Espace de mobilité", "Zone dans laquelle le lit de la rivière se déplace latéralement (méandres, érosion, dépôts).")}
${term("t-ei", "Espace d'inondabilité", "Zone occupée par les crues selon leur récurrence ; inclut la plaine inondable et les milieux humides.")}
${term("t-zmce", "Zone de mobilité des cours d'eau", "Notion réglementaire du cadre 2026, cartographiée par le gouvernement et opposable (court terme 50 ans, long terme).")}
${term("t-zgc", "Zone de grand courant", "Dans l'ancien système, secteur de la plaine inondable correspondant aux crues fréquentes (récurrence 0–20 ans).")}
${term("t-classes", "Classes d'intensité", "Nouveau système à quatre classes (faible, modérée, élevée, très élevée) remplaçant l'ancien découpage en deux zones.")}
${term("t-residuel", "Zone protégée à risque résiduel", "Secteur derrière un ouvrage de protection contre les inondations (OPI) reconnu : risque réduit mais subsistant.")}
${term("t-rec", "Récurrence", "Fréquence statistique d'une crue d'une ampleur donnée.")}
${term("t-emb", "Embâcle", "Obstruction d'un cours d'eau par de la glace ou des débris, pouvant causer une inondation en amont.")}
${term("t-opi", "OPI", "Ouvrage de protection contre les inondations (digue, muret) reconnu par le gouvernement.")}
${term("t-hgm", "Hydrogéomorphologie", "Étude des formes et de l'évolution du lit et des berges d'un cours d'eau.")}
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">FAQ par audience</h2>

        <h3>Citoyens</h3>
        <div class="accordion" style="margin-bottom:var(--space-5)">
${term("f-c1", "Comment savoir si ma propriété est en zone inondable ?", "Consultez la carte officielle du gouvernement du Québec et, surtout, votre municipalité, qui détient le statut réglementaire applicable à votre terrain. La carte de ce portail est indicative.")}
${term("f-c2", "Les nouvelles cartes changent-elles la valeur de ma maison ?", "Le classement peut influencer l'assurabilité et les permis. Nous restons prudents sur les chiffres : référez-vous à l'analyse d'impact réglementaire officielle plutôt qu'à des estimations commerciales.")}
${term("f-c3", "Puis-je encore faire des travaux ?", "Cela dépend de la classe de risque et du règlement applicable. Certains travaux d'adaptation restent possibles ; vérifiez auprès de votre municipalité.")}
        </div>

        <h3>Municipalités, MRC &amp; OBV</h3>
        <div class="accordion" style="margin-bottom:var(--space-5)">
${term("f-m1", "Qui produit les cartes ?", "La cartographie est produite dans le cadre du projet INFO-Crue (MELCCFP, avec Ouranos), avec délégation à la CMM (BIRC) et à des MRC mandataires.")}
${term("f-m2", "Quels financements pour l'adaptation ?", "Des programmes comme le PRAFI et les bureaux de projets-Inondations (MAMH) soutiennent la gestion des risques. Voir l'espace municipalités.")}
        </div>

        <h3>Professionnels</h3>
        <div class="accordion">
${term("f-p1", "Où trouver le guide méthodologique ?", "Le guide méthodologique officiel du MELCCFP (volets technique/scientifique et cartographie réglementaire) est la référence. Voir l'espace professionnels.")}
${term("f-p2", "Quelles données géospatiales sont disponibles ?", "Données Québec (GRHQ, LiDAR/MNT), Géo-Inondations, Atlas de l'eau et Atlas hydroclimatique.")}
        </div>
      </div>
    </section>`,
};
