# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**« Rivières Libres »** — a standalone French (Québec) educational portal about *l'espace de liberté des rivières* (river freedom space) and Quebec's 2026 flood-zone regulatory overhaul. It is a **static multipage site** (semantic HTML5 + hand-written CSS custom properties + vanilla JS), no framework, no runtime dependencies.

The MVP is **built and committed**. The HTML files at the repo root and in the topic folders are the live, servable site. (Earlier planning docs describe a "pre-build" state — that is out of date; the site exists.)

## Commands

There is no package.json, test suite, or lint step — the site is plain files.

```bash
# Serve locally (paths are ABSOLUTE — never open via file://, serve from repo root)
python -m http.server 8000        # then open http://localhost:8000/
# or: npx serve .

# Regenerate the HTML from the page generator (Node, zero deps)
node tools/build.mjs
```

## Architecture — the build generator is the source of truth

The committed `.html` files are **generated output**, not hand-edited source. Edit content in `tools/pages/`, then run `node tools/build.mjs` to regenerate. The generator is optional for *serving* (HTML is committed and servable as-is) but mandatory for *editing consistently* — otherwise header/footer/`<head>` drift across pages.

- **`tools/build.mjs`** — the common layout. Owns the `<head>` (fonts incl. Fraunces italics, OG/meta, the `html.js` class script), the fixed chameleon `header()` (with `NAV` array + `aria-current`), the full-screen mobile menu, the shared `FOOTER` (watermark + nav columns + the mandatory legal disclaimer), and the `layout()` wrapper. It loops over `tools/pages/*.mjs` (skipping `_`-prefixed files) and emits each to its `out` path.
- **`tools/pages/<page>.mjs`** — one file per content page, `export default { out, meta, body }`. `meta` = `{ title, description, canonical, active, headExtra? }` (`active` matches a `NAV[].match`; `headExtra` injects e.g. JSON-LD — used by `index.mjs`). `body` is the page HTML string.
- **`tools/pages/_shared.mjs`** — the component library (v2): `pageHero({kicker,title,lead,crumbs})` (dark page head, masked title lines), `maskLines()`, `linkArrow()`, `stat()`, `indexRow()`, `accordionItem()`, `soonBlock()`, inline icons (`ICON_ARROW`, `ICON_CHEVRON`, `WAVE`). Legacy `pageHead()` kept for compatibility. Underscore prefix = not a page, not auto-loaded.
- **`tools/pages/_v2.mjs`** — the `V2_PAGES` list. Every "bientôt disponible" stub (all of `agir/`, `ressources/`, plus the deferred `carte-donnees`/`cadre-reglementaire` pages) is one entry here, rendered via `soonBlock`. Add a deferred page here, not as a full `.mjs`.
- **`assets/css/styles.css`** — design tokens (`:root` custom properties) at the top, then components. `assets/js/main.js` — mobile nav, accordions (`aria-expanded` + keyboard), the risk-class `zone-selector`, footer year.
- **`partials/header.html` / `partials/footer.html`** — reference copies only; the generator's inline `header()`/`FOOTER` are authoritative.

### Adding / editing a page

1. Full page: create `tools/pages/<slug>.mjs` on the model of an existing one (use `pageHead()`). Deferred stub: add an entry to `V2_PAGES` in `_v2.mjs`.
2. `node tools/build.mjs`.
3. Update `sitemap.xml`, and if it's a top-level section, `NAV` in `build.mjs` and the footer columns.

## Design system v2 — resolved (do not re-litigate)

The build follows the **brief's editorial direction** ("grand reportage" register), NOT the Stitch `DESIGN.md`. The Stitch mockups (`stitch_portail_rivi_res_libres/`) are visual reference only and use a different palette/fonts (Montserrat, `#001431`) — ignore those values.

- Fonts: **Fraunces** (display, serif, italics loaded) + **Inter** (body), via Google Fonts.
- Primary blue `--color-deep #0E3A52`, dark surfaces `--color-deep-2 #0A2C3F` / `--color-abyss #071E2A`, turquoise `--color-river #1E8AA0`, on-dark accent `--color-glint #7BD4E4`, AA link color `--color-link #14708A`, plus nature/sand and per-audience accents.
- **Deliberate theme arc** (not random alternation): dark page head → light reading body → dark closing CTA/footer. Dark surfaces carry `data-navtheme="dark"`; the fixed header reads them via IntersectionObserver to switch its scheme. **Never add extra dark sections inside a page body.**
- Shape lock: interactive = pill, containers = 14px, media frames = 22px.
- **Motion conventions** (all disabled under `prefers-reduced-motion`; hidden initial states require `html.js` so no-JS users see everything): `data-reveal` (+`data-reveal-group` cascades), `maskLines()` line reveals, `data-wordfill` (CSS scroll-driven with JS fallback — homepage manifesto only), `.draw`+`pathLength="1"` SVG tracing, `data-count-to` counters, one marquee max (homepage only). No `scroll` event listeners anywhere.
- Editorial copy rules: no em/en dashes in visible copy (rephrase), max one `·` per line, section labels (kicker/eyebrow) rationed to ~1 per 3 sections, no 3-identical-card rows, one CTA label per intent ("Vérifier une adresse" is reserved for the map intent).
- **The official Quebec flood-risk legend colors (`--risk-faible … --risk-residuel`) are semantically locked** — use them ONLY for the map legend and risk indicators, never as decorative accents.

## Content accuracy rules (non-negotiable — this is a civic-info site about real regulation)

- **Always show the source** next to any figure.
- The **~30% flood-zone expansion** and **25 000 → 35 000 logements** numbers are *government estimates announced June 2025* — phrase as estimates, not facts.
- The **risk-class thresholds** (e.g. "très élevée" = >70% over 25 yrs, depth >60cm) come from media relays and **must be validated against the official MELCCFP guide méthodologique before publication** — phrase cautiously. (See the cautious wording already in `main.js` `ZONE_DATA`.)
- No precise property-value-impact percentages from commercial sources — stay qualitative or cite the official regulatory impact analysis.
- Refining French draft content: keep its **meaning and sources**.
- The **legal disclaimer** ("valeur indicative, aucune portée légale") must stay in the footer of every page and on the map. It lives in `FOOTER` in `build.mjs`.

## The map

The map on `carte-donnees/carte.html` **embeds the official MRNF map** (`<iframe src="https://zonesinondables.mrnf.gouv.qc.ca/">`) with a fallback link and the locked legend. Keep the iframe attributes intact. The "Liens officiels" URLs on that page are still `quebec.ca` stubs to be pointed at exact official URLs before go-live.

## Requirements the build already targets (keep them intact)

- **Accessibility:** WCAG 2.1 AA — ARIA landmarks, skip link, keyboard nav, visible focus, `alt` on images, accordions with `aria-expanded`.
- **Responsive:** mobile-first, breakpoints 640/1024/1280px, hamburger under 1024px, tables reflow on mobile.
- **i18n-ready:** `lang="fr-CA"`; the header FR/EN switch is present but **disabled** (V2). To add English: isolate strings, duplicate under `/en/`, enable the switch.
- **SEO:** per-page `<title>`/`meta description`, Open Graph, canonical. `robots.txt` + `sitemap.xml` at root.

## Deployment

- Vercel: `vercel.json` sets `cleanUrls: true`, `trailingSlash: false`; `404.html` is the custom 404.
- Paths are **absolute** (`/assets/…`, `/comprendre/…`). The site works on a **root domain** only. On a GitHub Pages *project* site (`user.github.io/repo/`) the absolute paths break — use a custom domain / user site, or rework with `<base>`/relative paths.

## Reference docs (planning-stage, may lag the built site)

- `brief-2-technique-claude-code.md` — the original build spec (file structure, tokens, components, page content).
- `compass_artifact_…_markdown.md` — the research brief: sourced domain facts/figures, actors, IA rationale. Use to verify content accuracy.
- `stitch_portail_rivi_res_libres/` — visual mockups only (different, superseded design tokens).

## Domain glossary (so content edits stay correct)

- **Espace de liberté** — *scientific/management* concept (Biron/Buffin-Bélanger/Larocque, Concordia/Ouranos 2013): voluntary, hydrogeomorphological, basin-scale = espace de mobilité + espace d'inondabilité.
- **Zone de mobilité des cours d'eau** — the *regulatory* notion (2026 framework): legally enforceable, government-mapped, parcel/municipal-scale. The portal's core thesis is distinguishing these two cousin-but-distinct concepts.
- **2026 framework** — modernized hydric-environment regulations adopted 12 June 2025, in force since 1 March 2026; replaces the 2022 transitional regime. Key regulations: **ROPI**, **RMUN**, **RAMHHS**.
- **Map system** — 4 intensity classes (faible/modérée/élevée/très élevée) + a 5th "zone protégée à risque résiduel", replacing the old 0–20yr / 20–100yr two-zone system.
