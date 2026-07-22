import { maskLines, linkArrow, stat, indexRow, ICON_ARROW, WAVE } from "./_shared.mjs";

/* Bandeau défilant : vocabulaire du domaine, séparé par le glyphe d'onde.
   Décoratif (aria-hidden), en pause au survol, statique en reduced-motion. */
const MARQUEE_WORDS = [
  "Espace de liberté",
  "Zone de mobilité",
  "Zone inondable",
  "Cadre 2026",
  "Milieux humides",
  "Résilience",
];
const marqueeRun = MARQUEE_WORDS
  .map((w, i) => `<span class="marquee__word${i % 2 ? " marquee__word--outline" : ""}">${w}</span><span class="marquee__sep">${WAVE}</span>`)
  .join("");

const JSONLD = `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://rivieres-libres.example/#org",
        "name": "Rivières Libres",
        "url": "https://rivieres-libres.example/",
        "description": "Portail d'information indépendant sur l'espace de liberté des rivières et les zones inondables au Québec."
      },
      {
        "@type": "WebSite",
        "@id": "https://rivieres-libres.example/#site",
        "url": "https://rivieres-libres.example/",
        "name": "Rivières Libres",
        "inLanguage": "fr-CA",
        "publisher": { "@id": "https://rivieres-libres.example/#org" }
      }
    ]
  }
  </script>`;

export default {
  out: "index.html",
  meta: {
    title: "Rivières Libres | Espace de liberté des rivières et zones inondables au Québec",
    description: "Comprendre l'espace de liberté des rivières et les zones inondables au Québec : le concept scientifique, le cadre réglementaire 2026, la carte officielle et des ressources pour les citoyens, les municipalités et les professionnels.",
    canonical: "https://rivieres-libres.example/",
    active: null,
    headExtra: JSONLD,
  },
  body: `
    <!-- ===== HÉROS ===== -->
    <section class="hero" data-navtheme="dark">
      <div class="hero__media">
        <img src="https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=2000&q=75"
             alt="Rivière sinueuse traversant une vallée boisée" loading="eager" fetchpriority="high">
      </div>
      <div class="hero__grade" aria-hidden="true"></div>
      <div class="hero__inner">
        <svg class="hero__wave draw" viewBox="0 0 84 30" aria-hidden="true" focusable="false">
          <path pathLength="1" d="M2 8c10 0 10 7 21 7s10-7 20-7 10 7 20 7 10-7 19-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
          <path pathLength="1" d="M2 22c10 0 10 7 21 7s10-7 20-7 10 7 20 7 10-7 19-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
        </svg>
        <h1 class="hero__title">${maskLines(["Les rivières ont", "besoin <em>d'espace</em>."])}</h1>
        <div data-reveal-group>
          <p data-reveal>Les nouvelles cartes des zones inondables changent la donne. Comprenez ce qu'elles signifient pour vous et pour nos rivières.</p>
          <div class="btn-row" data-reveal>
            <a class="btn btn--primary" href="/carte-donnees/carte.html">Vérifier une adresse ${ICON_ARROW}</a>
            <a class="btn btn--ghost" href="#these">Comprendre en 2 minutes</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== LA THÈSE (manifeste, remplissage au défilement) ===== -->
    <section class="section" id="these">
      <div class="container">
        <p class="kicker">La thèse</p>
        <p class="manifesto" data-wordfill>Une rivière n'est pas une ligne fixe sur une carte. Elle bouge, déborde et se redessine au fil des crues. Lui redonner de l'espace, c'est protéger nos maisons, nos routes et nos milieux de vie. C'est toute l'idée de <em>l'espace de liberté</em>.</p>
        <p style="margin-top:var(--space-5)" data-reveal>${linkArrow("/comprendre/espace-de-liberte.html", "Lire le dossier complet")}</p>
      </div>
    </section>

    <!-- ===== LE CONCEPT (schéma animé) ===== -->
    <section class="section section--mist">
      <div class="container">
        <div class="grid grid--1-1 grid--gap-lg">
          <div>
            <h2>${maskLines(["Une rivière n'est", "pas une route."])}</h2>
            <div data-reveal-group>
              <p data-reveal>Elle se déplace latéralement et déborde naturellement. Son espace de liberté est la somme de son <strong>espace de mobilité</strong> (le lit et ses méandres) et de son <strong>espace d'inondabilité</strong> (la zone des crues), milieux humides riverains compris.</p>
              <p data-reveal>${linkArrow("/comprendre/mobilite-inondabilite.html", "Distinguer mobilité et inondabilité")}</p>
            </div>
          </div>
          <figure class="concept-diagram draw" data-reveal>
            <svg viewBox="0 0 480 260" role="img" aria-labelledby="diag-title diag-desc">
              <title id="diag-title">Schéma de l'espace de liberté d'une rivière</title>
              <desc id="diag-desc">L'espace de liberté est la somme de l'espace de mobilité (déplacement latéral du lit) et de l'espace d'inondabilité (zone des crues), incluant les milieux humides riverains.</desc>
              <rect x="20" y="40" width="440" height="180" rx="14" fill="#EAF5F7" stroke="#4FB3C4" stroke-dasharray="6 5"/>
              <rect x="70" y="80" width="340" height="110" rx="10" fill="#FBF6EC" stroke="#DBB36A" stroke-dasharray="6 5"/>
              <path pathLength="1" d="M40 135 C 130 95, 180 175, 250 135 S 380 95, 440 135" fill="none" stroke="#1E8AA0" stroke-width="14" stroke-linecap="round"/>
              <text x="240" y="32" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#0E3A52">Espace d'inondabilité (crues)</text>
              <text x="240" y="74" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#8a6d2f">Espace de mobilité (lit et méandres)</text>
              <text x="240" y="210" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#51616A">Milieux humides riverains : des éponges naturelles</text>
            </svg>
            <figcaption class="source">Schéma simplifié à des fins pédagogiques. Concept : Biron et coll. (2013).</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- ===== CE QUI CHANGE EN 2026 (repères chiffrés) ===== -->
    <section class="section">
      <div class="container">
        <h2 class="section__intro">${maskLines(["Ce qui change en 2026"])}</h2>
        <div class="stat-band" data-reveal-group>
          ${stat({
            value: "1<sup>er</sup> mars",
            unit: "2026",
            label: "Entrée en vigueur du nouveau cadre",
            note: "Règlements modernisés (ROPI, RMUN, RAMHHS). Source : MELCCFP.",
          })}
          ${stat({
            value: "4 + 1",
            label: "Classes d'intensité",
            note: "Quatre classes, de faible à très élevée, plus la zone protégée à risque résiduel. Source : MELCCFP.",
          })}
          ${stat({
            value: `<span data-count-to="30" data-count-prefix="≈ " data-count-suffix="&nbsp;%">≈ 30&nbsp;%</span>`,
            label: "Élargissement estimé des zones",
            note: "Estimation gouvernementale annoncée en juin 2025.",
          })}
          ${stat({
            value: `<span data-count-to="35000" data-count-prefix="≈ ">≈ 35 000</span>`,
            label: "Logements possiblement visés",
            note: "De 25 000 à 35 000 selon l'estimation gouvernementale de juin 2025.",
          })}
        </div>
        <p style="margin-top:var(--space-6)" data-reveal>${linkArrow("/cadre-reglementaire/cadre-2026.html", "Comprendre le cadre 2026")}</p>
      </div>
    </section>

    <!-- ===== PARCOURS DE LECTURE ===== -->
    <section class="section section--mist">
      <div class="container">
        <h2>${maskLines(["Comprendre, dans l'ordre"])}</h2>
        <p class="section__intro" data-reveal>Cinq dossiers courts, pensés pour être lus à la suite.</p>
        <ol class="index-list" data-reveal-group>
          ${indexRow({ num: "01", href: "/comprendre/pourquoi-espace.html", title: "Pourquoi protéger l'espace des rivières", desc: "Sécurité, économie, biodiversité : les bénéfices de laisser la rivière respirer." })}
          ${indexRow({ num: "02", href: "/comprendre/espace-de-liberte.html", title: "L'espace de liberté", desc: "Le concept scientifique né au Québec, expliqué simplement." })}
          ${indexRow({ num: "03", href: "/comprendre/mobilite-inondabilite.html", title: "Mobilité et inondabilité", desc: "Deux notions cousines, deux portées bien différentes." })}
          ${indexRow({ num: "04", href: "/comprendre/climat-inondations.html", title: "Climat et inondations", desc: "Pourquoi le risque évolue, et ce que disent les données." })}
          ${indexRow({ num: "05", href: "/comprendre/glossaire-faq.html", title: "Glossaire et FAQ", desc: "Les termes clés et les questions les plus fréquentes." })}
        </ol>
      </div>
    </section>

    <!-- ===== POUR VOUS (bento audiences) ===== -->
    <section class="section">
      <div class="container">
        <p class="kicker">Pour vous</p>
        <h2 class="section__intro">${maskLines(["Des réponses selon", "votre réalité"])}</h2>
        <div class="bento" data-reveal-group>
          <a class="bento__cell bento__cell--tall" href="/pour-vous/citoyens.html" data-reveal>
            <span class="bento__media"><img src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=70" alt="" loading="lazy"></span>
            <span class="bento__scrim" aria-hidden="true"></span>
            <h3><span class="bento__q">Ma propriété est-elle concernée ?</span></h3>
            <p>Ce que les nouvelles cartes changent pour vous, et comment vous adapter.</p>
            <span class="link-arrow">Espace citoyens ${ICON_ARROW}</span>
          </a>
          <a class="bento__cell bento__cell--deep" href="/pour-vous/municipalites-obv.html" data-reveal>
            <h3>Municipalités, MRC et OBV</h3>
            <p>Mettre en œuvre le cadre, gérer la cartographie, financer l'adaptation.</p>
            <span class="link-arrow">Espace municipalités ${ICON_ARROW}</span>
          </a>
          <a class="bento__cell bento__cell--mist" href="/pour-vous/professionnels.html" data-reveal>
            <h3>Professionnels</h3>
            <p>Méthodes hydrogéomorphologiques, données géospatiales, littérature scientifique.</p>
            <span class="link-arrow">Espace professionnels ${ICON_ARROW}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ===== BANDEAU VOCABULAIRE ===== -->
    <div class="marquee" aria-hidden="true" data-navtheme="dark">
      <div class="marquee__track">
        ${marqueeRun}
        ${marqueeRun}
      </div>
    </div>

    <!-- ===== APPEL FINAL : LA CARTE ===== -->
    <section class="section theme-dark cta-deep" data-navtheme="dark" style="background:var(--color-deep-2)">
      <div class="container">
        <p class="kicker">Carte officielle</p>
        <h2>${maskLines(["Votre secteur est-il", "<em>concerné</em> ?"])}</h2>
        <div data-reveal-group>
          <p data-reveal>La carte officielle du gouvernement du Québec est intégrée au portail : recherchez une adresse et explorez les couches.</p>
          <div class="btn-row" data-reveal>
            <a class="btn btn--primary" href="/carte-donnees/carte.html">Vérifier une adresse ${ICON_ARROW}</a>
            ${linkArrow("/carte-donnees/lire-les-cartes.html", "Apprendre à lire les cartes")}
          </div>
          <ul class="legend-chips" data-reveal aria-label="Classes d'intensité de la cartographie officielle">
            <li><span class="legend__swatch legend__swatch--faible"></span>Faible</li>
            <li><span class="legend__swatch legend__swatch--moderee"></span>Modérée</li>
            <li><span class="legend__swatch legend__swatch--elevee"></span>Élevée</li>
            <li><span class="legend__swatch legend__swatch--tres-elevee"></span>Très élevée</li>
            <li><span class="legend__swatch legend__swatch--residuel"></span>Risque résiduel</li>
          </ul>
          <p class="cta-deep__note" data-reveal>Valeur indicative, sans portée légale. Pour le statut réel d'un terrain, consultez votre municipalité et les outils officiels.</p>
        </div>
      </div>
    </section>`,
};
