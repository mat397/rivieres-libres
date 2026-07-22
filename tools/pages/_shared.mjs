/* Helpers partagés pour les fragments de pages (v2).
   Vocabulaire du système design : têtes de page « eau profonde », titres
   masqués ligne par ligne, révélations au défilement, icônes inline.

   Conventions d'animation (le CSS/JS fait le reste) :
   - data-reveal            : fondu + montée à l'entrée dans le viewport
   - data-reveal-group      : cascade automatique des enfants [data-reveal]
   - data-wordfill          : remplissage mot à mot piloté par le défilement
   - .mask (via maskLines)  : titre révélé ligne par ligne
   - .draw + pathLength="1" : tracé SVG qui se dessine
   Tout est neutralisé sous prefers-reduced-motion et sans JS. */

/* Icônes inline (tracés type Tabler, famille unique, trait 2). */
export const ICON_ARROW = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const ICON_CHEVRON = `<svg class="chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* Petit glyphe d'onde (séparateur de bandeau, ornements). */
export const WAVE = `<svg viewBox="0 0 32 14" aria-hidden="true" focusable="false"><path d="M2 7c4 0 4-4 8-4s4 8 8 8 4-8 8-8 4 4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

/** Titre masqué ligne par ligne. `lines` = tableau de segments HTML
    (un segment = une ligne révélée). À placer DANS un h1/h2. */
export function maskLines(lines) {
  const segs = lines
    .map(l => `<span class="mask__seg"><span class="mask__line">${l}</span></span>`)
    .join("");
  return `<span class="mask">${segs}</span>`;
}

/** Lien fléché. */
export function linkArrow(href, label) {
  return `<a class="link-arrow" href="${href}">${label} ${ICON_ARROW}</a>`;
}

/** Fil d'Ariane. */
export function breadcrumb(crumbs) {
  return `<nav class="breadcrumb" aria-label="Fil d'Ariane">
        <ol>
          ${crumbs.map((c, i) =>
            i === crumbs.length - 1
              ? `<li aria-current="page">${c.label}</li>`
              : `<li><a href="${c.href}">${c.label}</a></li>`
          ).join("\n          ")}
        </ol>
      </nav>`;
}

/** Tête de page interne « eau profonde » : fil d'Ariane, étiquette,
    titre masqué (string ou tableau de lignes), texte d'amorce. */
export function pageHero({ kicker, title, lead, crumbs }) {
  const lines = Array.isArray(title) ? title : [title];
  return `    <div class="page-hero" data-navtheme="dark">
      <div class="page-hero__inner">
        ${crumbs ? breadcrumb(crumbs) : ""}
        ${kicker ? `<p class="kicker">${kicker}</p>` : ""}
        <h1>${maskLines(lines)}</h1>
        ${lead ? `<p class="lead" data-reveal>${lead}</p>` : ""}
      </div>
    </div>`;
}

/** Ancienne tête de page (gabarits non migrés) : conservée pour compatibilité. */
export function pageHead(eyebrow, title, lead, crumbs) {
  const bc = crumbs ? breadcrumb(crumbs) : "";
  return `    <div class="page-head">
      <div class="page-head__inner">
        ${bc}
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
        <h1>${title}</h1>
        ${lead ? `<p>${lead}</p>` : ""}
      </div>
    </div>`;
}

/** Repère chiffré pour bande de stats. `value` peut contenir un compteur :
    statique (ex. "4+1") ou animé via data-count-to (voir index.mjs). */
export function stat({ value, unit, label, note }) {
  return `<div class="stat" data-reveal>
            <span class="stat__value">${value}${unit ? ` <span class="stat__unit">${unit}</span>` : ""}</span>
            <span class="stat__label">${label}</span>
            ${note ? `<span class="stat__note">${note}</span>` : ""}
          </div>`;
}

/** Rangée d'index éditorial (parcours de lecture). */
export function indexRow({ num, href, title, desc }) {
  return `<li class="index-list__item" data-reveal>
            <a class="index-list__link" href="${href}">
              <span class="index-list__num" aria-hidden="true">${num}</span>
              <span>
                <span class="index-list__title">${title}</span>
                <p class="index-list__desc">${desc}</p>
              </span>
              <span class="index-list__arrow" aria-hidden="true">${ICON_ARROW}</span>
            </a>
          </li>`;
}

/** Élément d'accordéon accessible. Sans JS, le panneau reste ouvert. */
export function accordionItem({ id, question, answerHtml }) {
  return `<div class="accordion__item">
            <h3 class="mt-0" style="margin:0">
              <button class="accordion__trigger" type="button" aria-expanded="true" aria-controls="${id}">
                ${question}
                ${ICON_CHEVRON}
              </button>
            </h3>
            <div class="accordion__panel" id="${id}" role="region">
              <div class="accordion__panel-inner">${answerHtml}</div>
            </div>
          </div>`;
}

/** Bloc « bientôt disponible » (gabarits V2) : tête sombre + renvois. */
export function soonBlock(title, desc, links = []) {
  const list = links.length
    ? `<p class="mt-0"><strong>En attendant, consultez :</strong></p>
        <ul style="display:inline-block;text-align:left;margin:0;padding-left:1.2em">${links
          .map(l => `<li><a href="${l.href}">${l.label}</a></li>`)
          .join("")}</ul>`
    : "";
  return `    <div class="page-hero" data-navtheme="dark">
      <div class="page-hero__inner" style="text-align:center">
        <span class="tag">Bientôt disponible</span>
        <h1 style="margin-inline:auto;margin-top:var(--space-4)">${maskLines([title])}</h1>
        <p class="lead" style="margin-inline:auto" data-reveal>${desc}</p>
      </div>
    </div>
    <section class="section">
      <div class="container soon" style="padding-block:var(--space-6)" data-reveal>
        ${list}
      </div>
    </section>`;
}
