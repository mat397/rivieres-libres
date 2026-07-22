import { pageHero, maskLines, linkArrow, stat, ICON_ARROW } from "./_shared.mjs";

export default {
  out: "comprendre/climat-inondations.html",
  meta: {
    title: "Climat et inondations au Québec | Rivières Libres",
    description: "Changements climatiques, crues plus fréquentes, inondations de 2017 et 2019, et pourquoi les nouvelles cartes élargissent les zones inondables d'environ 30 %.",
    canonical: "https://rivieres-libres.example/comprendre/climat-inondations.html",
    active: "/comprendre/",
  },
  body: `${pageHero({
    kicker: "Comprendre",
    title: ["Climat et", "<em>inondations</em>"],
    lead: "Pourquoi les zones à risque changent, et pourquoi maintenant.",
    crumbs: [
      { href: "/index.html", label: "Accueil" },
      { href: "/comprendre/espace-de-liberte.html", label: "Comprendre" },
      { label: "Climat & inondations" },
    ],
  })}

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0" data-reveal>Un contexte qui change</h2>
          <p data-reveal>Les changements climatiques modifient le régime des cours d'eau québécois : crues plus fréquentes et plus intenses dans certains bassins, étiages plus marqués en période sèche. Cette variabilité accrue rend d'autant plus importante la place laissée à la rivière.</p>
        </div>

        <div class="callout callout--warning" data-reveal>
          <span class="callout__label">Rappel : 2017 et 2019</span>
          <p>Les inondations majeures de 2017 et 2019 ont coûté plus d'un milliard de dollars de fonds publics. Selon des analyses universitaires, elles ont touché respectivement environ <strong>293</strong> et <strong>240</strong> municipalités.</p>
          <p class="source">Sources : gouvernement du Québec (déclarations de juin 2025) ; analyses universitaires (UQAM, via The Conversation). Chiffres à citer précisément lors de la mise en ligne.</p>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <div class="stat-band" data-reveal-group>
          ${stat({
            value: "≈ 1",
            unit: "G$",
            label: "De fonds publics (inondations 2017 et 2019)",
            note: "Source : gouvernement du Québec, juin 2025.",
          })}
          ${stat({
            value: `<span data-count-to="293" data-count-prefix="≈ ">≈ 293</span>`,
            label: "Municipalités touchées en 2017",
            note: "Source : analyses universitaires (UQAM).",
          })}
          ${stat({
            value: `<span data-count-to="240" data-count-prefix="≈ ">≈ 240</span>`,
            label: "Municipalités touchées en 2019",
            note: "Source : analyses universitaires (UQAM).",
          })}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">${maskLines(["Pourquoi les zones s'élargissent"])}</h2>
          <div data-reveal-group>
            <p data-reveal>Les nouvelles cartes élargissent les zones inondables d'environ <strong>30 %</strong>. Comme l'a précisé le gouvernement, il ne s'agit pas de créer de nouvelles zones, mais d'<strong>identifier plus justement</strong> celles qui existent déjà.</p>
            <p class="source" data-reveal>Source : ministre de l'Environnement, juin 2025. Estimation gouvernementale annoncée, sujette à ajustement régional ; à présenter comme estimation.</p>
            <p data-reveal><a class="link-arrow" href="https://www.atlas-hydroclimatique.ca/" rel="noopener" target="_blank">Consulter l'Atlas hydroclimatique (horizons 2050 / 2080) ${ICON_ARROW}</a></p>
            <p data-reveal>${linkArrow("/cadre-reglementaire/cadre-2026.html", "Voir le cadre réglementaire 2026")}</p>
          </div>
        </div>
      </div>
    </section>`,
};
