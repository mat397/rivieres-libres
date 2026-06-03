# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is a **pre-build, planning-stage** repository for **« Rivières Libres »** — a standalone French (Québec) educational portal about *l'espace de liberté des rivières* (river freedom space) and Quebec's 2026 flood-zone regulatory overhaul. **No site has been built yet.** The repo currently holds the specs and design mockups Claude Code is meant to build from.

The deliverable is a **static multipage site** (HTML/CSS/vanilla JS, no framework, no build step for the MVP) — see [brief-2-technique-claude-code.md](brief-2-technique-claude-code.md) §6 for the expected output.

## What's in the repo

- [brief-2-technique-claude-code.md](brief-2-technique-claude-code.md) — **The build spec.** Read this first. Contains the target file structure, CSS design tokens, the 11 reusable components to code, page-by-page draft content (in French, ready to integrate), the MVP-vs-V2 page priority, and data-precaution rules.
- [compass_artifact_wf-...text_markdown.md](compass_artifact_wf-42f3c994-3936-45bb-aced-f65b77721460_text_markdown.md) — The research brief: domain background, sourced facts/figures, actors, and the information architecture rationale. Use this to verify content accuracy and sourcing.
- [stitch_portail_rivi_res_libres/](stitch_portail_rivi_res_libres/) — Stitch-generated visual mockups (one folder per screen, each with `code.html` + `screen.png`). These are **reference mockups, not the codebase.** They use a CDN Tailwind config; the actual build per the brief uses hand-written CSS with custom properties (not Tailwind).
- [stitch_portail_rivi_res_libres/.../rivi_res_libres/DESIGN.md](stitch_portail_rivi_res_libres/stitch_portail_rivi_res_libres/rivi_res_libres/DESIGN.md) — The design-system reference (color tokens, typography tiers, spacing, elevation, component styling).

## Two sources of design tokens — reconcile before building

The brief and the Stitch DESIGN.md **disagree** on palette and fonts. Resolve this with the user before generating styles rather than picking silently:

| | brief-2-technique §2 | DESIGN.md / Stitch mockups |
|---|---|---|
| Display font | Fraunces (serif, editorial) | Montserrat (geometric sans) |
| Body font | Inter | Source Sans 3 |
| Primary blue | `--color-deep #0E3A52` | `primary #001431` / `#002856` |
| Risk colors | `--risk-faible #F2D14E` … | `risk-low #BDD5EA` … (different values) |

The **official Quebec flood-risk legend colors are semantically locked** — they must only be used for the map legend/risk indicators, never as decorative accents (brief §2 comment, DESIGN.md "Mapping & Risk Status").

## Hard requirements for the build (from brief §1)

- **Stack:** semantic HTML5 + modern CSS (custom properties, Flexbox/Grid) + vanilla JS. No framework for the MVP.
- **Accessibility:** target **WCAG 2.1 AA** — ARIA landmarks, keyboard nav, visible focus, conformant contrast, `alt` on every image, text alternatives for diagrams. Accordions need `aria-expanded` and keyboard support.
- **Responsive:** mobile-first, breakpoints at 640 / 1024 / 1280px. Hamburger menu under 1024px. Data tables reflow to stacked/card layout on mobile.
- **i18n-ready:** `lang="fr-CA"`; isolate text strings and include a (V2-inactive) FR/EN selector in the header so English can be added later.
- **SEO:** per-page `<title>`/`<meta description>`, Open Graph, `Organization` + `WebSite` structured data.
- The **interactive map is a styled placeholder for the MVP** (`map-embed`) with a `<!-- TODO: Leaflet + WMS officielles MELCCFP/MRNF -->` marker. Do not attempt to wire a real map service.
- A **legal disclaimer** ("valeur indicative, pas de portée légale") is mandatory in the footer of every page and on the map.

## Content accuracy rules (brief §5 — non-negotiable)

This is a public-facing civic-information site about real Quebec regulation; factual integrity matters more than completeness.

- **Always show the source** next to any figure.
- Treat the **~30% flood-zone expansion** and **25 000 → 35 000 logements** numbers as *government estimates announced June 2025*, not settled facts — phrase as estimates.
- The **risk-class thresholds** (e.g. "très élevée" = >70% over 25 yrs, depth >60cm) come from media relays and **must be validated against the official MELCCFP guide méthodologique before publication** — phrase cautiously until then.
- Do not assert precise property-value-impact percentages from commercial sources; stay qualitative or cite the official regulatory impact analysis.
- Keep the French draft content's **meaning and sources** when refining it.

## Build priority

MVP first (brief §1): `index.html`, the 5 `comprendre/` pages, `carte-donnees/carte.html` + `lire-les-cartes.html`, `cadre-reglementaire/cadre-2026.html`, the 3 `pour-vous/` pages, `a-propos.html`. Remaining pages (the `agir/`, `ressources/`, and the deferred `carte-donnees`/`cadre-reglementaire` pages) are built as structured "bientôt disponible" placeholder templates.

## Domain glossary (so content edits stay correct)

- **Espace de liberté** — *scientific/management* concept (Biron/Buffin-Bélanger/Larocque, Concordia/Ouranos 2013): voluntary, hydrogeomorphological, basin-scale = espace de mobilité + espace d'inondabilité.
- **Zone de mobilité des cours d'eau** — the *regulatory* notion (2026 framework): legally enforceable, government-mapped, parcel/municipal-scale. The portal's core thesis is explicitly distinguishing these two cousin-but-distinct concepts.
- **2026 framework** — modernized hydric-environment regulations adopted 12 June 2025, in force since 1 March 2026; replaces the 2022 transitional regime. Key regulations: **ROPI**, **RMUN**, **RAMHHS**.
- **New map system** — 4 intensity classes (faible/modérée/élevée/très élevée) + a 5th "zone protégée à risque résiduel", replacing the old 0–20yr / 20–100yr two-zone system.
