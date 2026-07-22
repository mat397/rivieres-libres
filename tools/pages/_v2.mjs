/* Définit tous les gabarits V2 « bientôt disponible » en une liste.
   build.mjs n'importe que les fichiers à default unique ; ce fichier (_v2)
   est ignoré par le loader (préfixe _) et consommé par v2-*.mjs générés. */
import { soonBlock } from "./_shared.mjs";

export const V2_PAGES = [
  {
    out: "carte-donnees/donnees-methodes.html",
    title: "Données &amp; méthodes",
    desc: "Le détail des sources de données et des méthodes de délimitation hydrogéomorphologique sera publié ici.",
    active: "/carte-donnees/",
    links: [
      { href: "/pour-vous/professionnels.html", label: "Espace professionnels" },
      { href: "/comprendre/mobilite-inondabilite.html", label: "Mobilité & inondabilité" },
    ],
  },
  {
    out: "cadre-reglementaire/ancienne-nouvelle-carto.html",
    title: "Ancienne et nouvelle cartographie",
    desc: "Une comparaison détaillée du passage de l'ancien système (grand courant / faible courant) aux quatre classes d'intensité sera publiée ici.",
    active: "/cadre-reglementaire/",
    links: [{ href: "/carte-donnees/lire-les-cartes.html", label: "Lire les cartes" }],
  },
  {
    out: "cadre-reglementaire/permis-par-zone.html",
    title: "Permis et travaux par zone",
    desc: "Un récapitulatif des travaux permis et restreints selon chaque classe de risque sera publié ici.",
    active: "/cadre-reglementaire/",
    links: [{ href: "/carte-donnees/lire-les-cartes.html", label: "Les classes d'intensité" }],
  },
  {
    out: "agir/solutions-nature.html",
    title: "Solutions fondées sur la nature",
    desc: "Renaturalisation, milieux humides et génie végétal : un dossier pratique sera publié ici.",
    active: null,
    links: [{ href: "/comprendre/pourquoi-espace.html", label: "Pourquoi protéger l'espace de liberté" }],
  },
  {
    out: "agir/amenagement-resilient.html",
    title: "Aménagement résilient",
    desc: "Principes d'aménagement et d'immunisation des bâtiments face aux inondations seront détaillés ici.",
    active: null,
    links: [{ href: "/pour-vous/citoyens.html", label: "Espace citoyens" }],
  },
  {
    out: "agir/financements.html",
    title: "Financements",
    desc: "Un répertoire des programmes de financement (PRAFI, bureaux de projets-Inondations, etc.) sera publié ici.",
    active: null,
    links: [{ href: "/pour-vous/municipalites-obv.html", label: "Espace municipalités" }],
  },
  {
    out: "ressources/bibliotheque.html",
    title: "Bibliothèque",
    desc: "Une bibliothèque documentaire (rapports, guides, fiches) sera publiée ici.",
    active: null,
    links: [{ href: "/a-propos.html", label: "Sources & partenaires" }],
  },
  {
    out: "ressources/etudes-de-cas.html",
    title: "Études de cas",
    desc: "Des études de cas détaillées (Coaticook, Argenteuil, Matane, etc.) seront publiées ici.",
    active: null,
    links: [{ href: "/pour-vous/municipalites-obv.html", label: "Études de cas (aperçu)" }],
  },
  {
    out: "ressources/repertoire-acteurs.html",
    title: "Répertoire des acteurs",
    desc: "Un répertoire des acteurs (ministères, OBV, organismes scientifiques) sera publié ici.",
    active: null,
    links: [{ href: "/a-propos.html", label: "Sources & partenaires" }],
  },
];

export function v2Body(p) {
  return soonBlock(p.title, p.desc, p.links);
}

export function v2Meta(p) {
  return {
    title: `${p.title} | Rivières Libres`,
    description: `${p.title} : page en préparation. ${p.desc}`,
    canonical: `https://rivieres-libres.example/${p.out}`,
    active: p.active,
  };
}
