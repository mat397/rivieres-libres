import { pageHero, maskLines, linkArrow, accordionItem } from "./_shared.mjs";

export default {
  out: "comprendre/mobilite-inondabilite.html",
  meta: {
    title: "Mobilité et inondabilité des rivières | Rivières Libres",
    description: "Espace de mobilité (déplacement latéral du lit) et espace d'inondabilité (récurrence des crues) : les deux dynamiques qui composent l'espace de liberté.",
    canonical: "https://rivieres-libres.example/comprendre/mobilite-inondabilite.html",
    active: "/comprendre/",
  },
  body: `${pageHero({
    kicker: "Comprendre",
    title: ["Mobilité &amp;", "<em>inondabilité</em>"],
    lead: "Les deux dynamiques naturelles qui composent l'espace de liberté, et comment on les trace sur le terrain.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/comprendre/espace-de-liberte.html", label: "Comprendre" },
      { label: "Mobilité &amp; inondabilité" },
    ],
  })}

    <!-- ===== LES DEUX DYNAMIQUES ===== -->
    <section class="section">
      <div class="container">
        <h2 class="mt-0">${maskLines(["La rivière bouge,", "la rivière déborde"])}</h2>
        <div class="grid grid--2 grid--gap-lg" data-reveal-group>
          <div data-reveal>
            <h3 class="mt-0">L'espace de mobilité</h3>
            <p>Une rivière déplace son lit avec le temps : elle érode une berge, dépose des sédiments sur l'autre, forme et abandonne des méandres. L'espace de mobilité est la bande de terrain dans laquelle ce déplacement latéral se produit. L'ignorer, c'est construire là où la rivière finira par passer.</p>
          </div>
          <div data-reveal>
            <h3 class="mt-0">L'espace d'inondabilité</h3>
            <p>C'est la zone occupée par les crues selon leur récurrence : plus une crue est rare, plus elle s'étend loin. La plaine inondable et les milieux humides riverains agissent comme des zones tampons qui absorbent une partie de l'eau et atténuent les pointes de crue en aval.</p>
          </div>
        </div>
        <div class="callout callout--context" data-reveal>
          <span class="callout__label">Deux mots à ne pas confondre</span>
          <p>L'espace de mobilité décrit ici est une composante de l'espace de liberté, un concept scientifique d'application volontaire. La <strong>zone de mobilité des cours d'eau</strong> du cadre 2026 est autre chose : une notion réglementaire, opposable, issue de la cartographie gouvernementale officielle.</p>
          <p class="mt-0">${linkArrow("/comprendre/espace-de-liberte.html", "Comparer les deux notions")}</p>
        </div>
      </div>
    </section>

    <!-- ===== DÉLIMITATION ===== -->
    <section class="section section--mist">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <h2 class="mt-0" data-reveal>Comment on délimite ces espaces</h2>
          <div data-reveal-group>
            <p data-reveal>On croise des <strong>photos aériennes historiques</strong>, des relevés <strong>LiDAR</strong>, des <strong>modèles numériques de terrain</strong> et des <strong>simulations de crues en climat futur</strong> pour reconstituer le comportement de la rivière dans le temps et anticiper son évolution.</p>
            <p data-reveal>${linkArrow("/pour-vous/professionnels.html", "Données &amp; méthodes pour les professionnels")}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== MINI-GLOSSAIRE ===== -->
    <section class="section">
      <div class="container">
        <h2 class="mt-0" data-reveal>Mini-glossaire</h2>
        <p class="section__intro" data-reveal>Quatre termes essentiels pour suivre la conversation.</p>
        <div class="accordion" data-reveal>
          ${accordionItem({
            id: "g-hgm",
            question: "Hydrogéomorphologie",
            answerHtml: "Étude des formes du lit et des berges d'un cours d'eau et de leur évolution, à la base de la délimitation de l'espace de liberté.",
          })}
          ${accordionItem({
            id: "g-rec",
            question: "Récurrence",
            answerHtml: "Fréquence statistique d'une crue d'une ampleur donnée. Par exemple, une « crue de récurrence 100 ans » a environ 1 % de probabilité de survenir chaque année.",
          })}
          ${accordionItem({
            id: "g-eti",
            question: "Étiage",
            answerHtml: "Niveau le plus bas d'un cours d'eau, généralement en période sèche. Les étiages plus marqués sont l'un des effets attendus des changements climatiques.",
          })}
          ${accordionItem({
            id: "g-emb",
            question: "Embâcle",
            answerHtml: "Accumulation de glace ou de débris qui obstrue un cours d'eau et peut provoquer une inondation brutale en amont.",
          })}
        </div>
        <p style="margin-top:var(--space-4)" data-reveal>${linkArrow("/comprendre/glossaire-faq.html", "Voir le glossaire complet")}</p>
      </div>
    </section>`,
};
