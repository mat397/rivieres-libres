import { pageHead } from "./_shared.mjs";

export default {
  out: "cadre-reglementaire/cadre-2026.html",
  meta: {
    title: "Le cadre réglementaire 2026 | Rivières Libres",
    description: "Le cadre réglementaire modernisé en milieux hydriques, adopté le 12 juin 2025 et en vigueur depuis le 1er mars 2026 : ROPI, RMUN, RAMHHS, et qui fait quoi.",
    canonical: "https://rivieres-libres.example/cadre-reglementaire/cadre-2026.html",
    active: "/cadre-reglementaire/",
  },
  body: `${pageHead(
    "Cadre réglementaire",
    "Le cadre 2026",
    "Adopté le 12 juin 2025, en vigueur depuis le 1ᵉʳ mars 2026.",
    [{ href: "/index.html", label: "Accueil" }, { href: "/cadre-reglementaire/cadre-2026.html", label: "Cadre réglementaire" }, { label: "Cadre 2026" }]
  )}

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">Vue d'ensemble</h2>
          <p>Le cadre réglementaire modernisé en milieux hydriques a été adopté le <strong>12 juin 2025</strong> et est en vigueur depuis le <strong>1ᵉʳ mars 2026</strong>. Il remplace le régime transitoire instauré en 2022 et s'appuie sur un guide méthodologique officiel du MELCCFP.</p>
          <p class="source">Source : MELCCFP / gouvernement du Québec.</p>
        </div>

        <div class="callout callout--context">
          <span class="callout__label">L'ampleur du changement</span>
          <p class="mt-0">Selon les annonces gouvernementales de juin 2025, le nombre de logements situés en zones inondables passerait d'environ <strong>25 000 à 35 000</strong> (hausse d'environ 30 %). Il s'agit d'une estimation gouvernementale, sujette à ajustement régional.</p>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">Les règlements clés</h2>
        <div class="grid grid--3" style="margin-top:var(--space-4)">
          <div class="card">
            <span class="tag">ROPI</span>
            <h3 class="mt-0">Ouvrages de protection</h3>
            <p class="mt-0">Règlement sur les ouvrages de protection contre les inondations : encadre les digues et autres OPI reconnus.</p>
          </div>
          <div class="card">
            <span class="tag">RMUN</span>
            <h3 class="mt-0">Responsabilité municipale</h3>
            <p class="mt-0">Règlement sur l'encadrement d'activités sous la responsabilité des municipalités.</p>
          </div>
          <div class="card">
            <span class="tag">RAMHHS</span>
            <h3 class="mt-0">Milieux humides &amp; hydriques</h3>
            <p class="mt-0">Règlement sur les activités dans des milieux humides, hydriques et sensibles.</p>
          </div>
        </div>
        <p class="source" style="margin-top:var(--space-3)">Des ajustements au REAFIE complètent le dispositif. Source : MELCCFP.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">Qui fait quoi</h2>
          <ul>
            <li><strong>MELCCFP</strong> — cadre réglementaire, projet INFO-Crue, guide méthodologique.</li>
            <li><strong>MAMH</strong> — bureaux de projets-Inondations, programme PRAFI.</li>
            <li><strong>CMM / BIRC</strong> — Bureau des inondations et de la résilience climatique (à l'œuvre depuis 2017).</li>
            <li><strong>CMQ, MRC, municipalités</strong> — application locale, permis, cartographie déléguée.</li>
          </ul>

          <h2>Calendrier</h2>
          <p>Les cartes de nouvelle génération sont publiées <strong>progressivement</strong> depuis mars 2026. Les premières publications devraient couvrir environ 75 % de la population.</p>
          <p class="source">Source : MELCCFP / gouvernement du Québec, 2025–2026.</p>
          <p><a href="/carte-donnees/lire-les-cartes.html">Comprendre les nouvelles cartes →</a></p>
        </div>
      </div>
    </section>`,
};
