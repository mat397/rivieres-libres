/* Helpers partagés pour les fragments de pages. */

export function pageHead(eyebrow, title, lead, crumbs) {
  const bc = crumbs
    ? `  <nav class="breadcrumb container" aria-label="Fil d'Ariane">
    <ol>
      ${crumbs.map((c, i) =>
        i === crumbs.length - 1
          ? `<li aria-current="page">${c.label}</li>`
          : `<li><a href="${c.href}">${c.label}</a></li>`
      ).join("\n      ")}
    </ol>
  </nav>`
    : "";
  return `${bc}
    <div class="page-head">
      <div class="page-head__inner">
        ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ""}
        <h1>${title}</h1>
        ${lead ? `<p>${lead}</p>` : ""}
      </div>
    </div>`;
}

/** Bloc « bientôt disponible » pour les gabarits V2. */
export function soonBlock(title, desc, links = []) {
  const list = links.length
    ? `<p>En attendant, consultez :</p>\n        <ul style="display:inline-block;text-align:left">${links
        .map(l => `<li><a href="${l.href}">${l.label}</a></li>`)
        .join("")}</ul>`
    : "";
  return `    <section class="section">
      <div class="container soon">
        <span class="tag">Bientôt disponible</span>
        <svg class="soon__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        <h1 class="mt-0">${title}</h1>
        <p class="lead" style="margin-inline:auto">${desc}</p>
        ${list}
      </div>
    </section>`;
}
