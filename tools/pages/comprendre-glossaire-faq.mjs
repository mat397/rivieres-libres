import { pageHero, maskLines, accordionItem, linkArrow } from "./_shared.mjs";

/* Entrée de glossaire : terme + définition en liste aérée.
   L'ancre `id` d'origine est conservée sur le bloc (liens profonds). */
const term = (id, label, def) => `          <div id="${id}" data-reveal>
            <dt style="font-family:var(--font-display);font-weight:600;font-size:1.15rem;color:var(--color-deep);margin:0 0 var(--space-2)">${label}</dt>
            <dd style="margin:0">${def}</dd>
          </div>`;

/* Question de FAQ : accordéon accessible, réponse en un paragraphe. */
const faq = (id, question, answer) =>
  accordionItem({ id, question, answerHtml: `<p style="margin:0">${answer}</p>` });

export default {
  out: "comprendre/glossaire-faq.html",
  meta: {
    title: "Glossaire et FAQ | Rivières Libres",
    description: "Glossaire de l'espace de liberté, de la zone de mobilité et du cadre 2026, avec des réponses directes pour citoyens, municipalités et professionnels.",
    canonical: "https://rivieres-libres.example/comprendre/glossaire-faq.html",
    active: "/comprendre/",
  },
  body: `${pageHero({
    kicker: "Comprendre",
    title: ["Des mots justes,", "des réponses <em>claires</em>."],
    lead: "Le vocabulaire pour se repérer dans les cartes et le cadre 2026, puis des réponses directes selon votre profil.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/comprendre/espace-de-liberte.html", label: "Comprendre" },
      { label: "Glossaire &amp; FAQ" },
    ],
  })}

    <!-- ===== GLOSSAIRE ===== -->
    <section class="section">
      <div class="container">
        <h2>${maskLines(["Onze termes à connaître"])}</h2>
        <p class="section__intro" data-reveal>La science et le règlement n'emploient pas toujours les mêmes mots. Voici ceux qui reviennent partout sur ce portail, du concept d'espace de liberté aux notions du cadre 2026.</p>
        <dl class="grid grid--2 grid--gap-lg" style="margin:0" data-reveal-group>
${term("t-edl", "Espace de liberté", "Concept scientifique réunissant l'espace de mobilité et l'espace d'inondabilité d'une rivière, milieux humides riverains compris. Une démarche volontaire et hydrogéomorphologique.")}
${term("t-em", "Espace de mobilité", "Zone dans laquelle le lit de la rivière se déplace latéralement (méandres, érosion, dépôts).")}
${term("t-ei", "Espace d'inondabilité", "Zone occupée par les crues selon leur récurrence ; inclut la plaine inondable et les milieux humides.")}
${term("t-zmce", "Zone de mobilité des cours d'eau", "Notion réglementaire du cadre 2026, cartographiée par le gouvernement et opposable (court terme 50 ans, long terme).")}
${term("t-zgc", "Zone de grand courant", "Dans l'ancien système, secteur de la plaine inondable correspondant aux crues fréquentes, de récurrence 0 à 20 ans.")}
${term("t-classes", "Classes d'intensité", "Nouveau système à quatre classes (faible, modérée, élevée, très élevée) remplaçant l'ancien découpage en deux zones.")}
${term("t-residuel", "Zone protégée à risque résiduel", "Secteur situé derrière un ouvrage de protection contre les inondations (OPI) reconnu : risque réduit, mais subsistant.")}
${term("t-rec", "Récurrence", "Fréquence statistique d'une crue d'une ampleur donnée.")}
${term("t-emb", "Embâcle", "Obstruction d'un cours d'eau par de la glace ou des débris, pouvant causer une inondation en amont.")}
${term("t-opi", "OPI", "Ouvrage de protection contre les inondations (digue, muret) reconnu par le gouvernement.")}
${term("t-hgm", "Hydrogéomorphologie", "Étude des formes et de l'évolution du lit et des berges d'un cours d'eau.")}
        </dl>
        <p style="margin-top:var(--space-6)" data-reveal>${linkArrow("/comprendre/mobilite-inondabilite.html", "Distinguer mobilité et inondabilité")}</p>
      </div>
    </section>

    <!-- ===== FAQ PAR PROFIL ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2>${maskLines(["Des réponses par profil"])}</h2>

        <h3 data-reveal>Citoyens</h3>
        <div class="accordion" style="margin:0 0 var(--space-6)" data-reveal>
${faq("f-c1", "Comment savoir si ma propriété est en zone inondable ?", `Consultez la <a href="/carte-donnees/carte.html">carte officielle du gouvernement du Québec</a> et, surtout, votre municipalité, qui détient le statut réglementaire applicable à votre terrain. La carte de ce portail est indicative, sans portée légale.`)}
${faq("f-c2", "Les nouvelles cartes changent-elles la valeur de ma maison ?", "Le classement peut influencer l'assurabilité et les permis. Nous restons prudents sur les chiffres : référez-vous à l'analyse d'impact réglementaire officielle plutôt qu'à des estimations commerciales.")}
${faq("f-c3", "Puis-je encore faire des travaux ?", "Cela dépend de la classe de risque et du règlement applicable. Certains travaux d'adaptation restent possibles ; vérifiez auprès de votre municipalité.")}
        </div>

        <h3 data-reveal>Municipalités, MRC &amp; OBV</h3>
        <div class="accordion" style="margin:0 0 var(--space-6)" data-reveal>
${faq("f-m1", "Qui produit les cartes ?", "La cartographie est produite dans le cadre du projet INFO-Crue (MELCCFP, avec Ouranos), avec délégation à la CMM (BIRC) et à des MRC mandataires.")}
${faq("f-m2", "Quels financements pour l'adaptation ?", `Des programmes comme le PRAFI et les bureaux de projets-Inondations (MAMH) soutiennent la gestion des risques. Voir <a href="/pour-vous/municipalites-obv.html">l'espace municipalités</a>.`)}
        </div>

        <h3 data-reveal>Professionnels</h3>
        <div class="accordion" data-reveal>
${faq("f-p1", "Où trouver le guide méthodologique ?", `Le guide méthodologique officiel du MELCCFP (volets technique/scientifique et cartographie réglementaire) est la référence. Voir <a href="/pour-vous/professionnels.html">l'espace professionnels</a>.`)}
${faq("f-p2", "Quelles données géospatiales sont disponibles ?", "Données Québec (GRHQ, LiDAR/MNT), Géo-Inondations, Atlas de l'eau et Atlas hydroclimatique.")}
        </div>
      </div>
    </section>`,
};
