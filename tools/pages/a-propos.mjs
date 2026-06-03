import { pageHead } from "./_shared.mjs";

export default {
  out: "a-propos.html",
  meta: {
    title: "À propos &amp; sources | Rivières Libres",
    description: "Mission du portail Rivières Libres, sources et partenaires (MELCCFP, Ouranos, RIISQ, ROBVQ, universités), contact et infolettre.",
    canonical: "https://rivieres-libres.example/a-propos.html",
    active: null,
  },
  body: `${pageHead(
    "À propos",
    "À propos &amp; sources",
    "Un portail indépendant, le pont entre la science et la réglementation.",
    [{ href: "/index.html", label: "Accueil" }, { label: "À propos" }]
  )}

    <section class="section">
      <div class="container">
        <div class="prose">
          <h2 class="mt-0">Notre mission</h2>
          <p>Rivières Libres relie en un seul endroit la vulgarisation du concept scientifique d'<strong>espace de liberté</strong>, le nouveau cadre réglementaire des <strong>zones de mobilité des cours d'eau</strong> et des ressources pratiques pour les citoyens, les municipalités et les professionnels. Notre fil conducteur : faire le pont entre la science et la réglementation, de façon crédible et non alarmiste.</p>
        </div>
      </div>
    </section>

    <section class="section section--mist">
      <div class="container">
        <h2 class="mt-0">Sources &amp; partenaires</h2>
        <p class="prose">Le contenu s'appuie sur des sources publiques et scientifiques. Les organisations citées ne sont pas nécessairement affiliées au portail.</p>
        <div class="grid grid--3">
          <div class="card"><h3 class="mt-0">Gouvernement</h3><p class="mt-0">MELCCFP, MAMH, MRNF, MSP (sécurité civile).</p></div>
          <div class="card"><h3 class="mt-0">Science &amp; climat</h3><p class="mt-0">Ouranos, RIISQ, INRS ; Concordia, UQAM, UQAR, Sherbrooke.</p></div>
          <div class="card"><h3 class="mt-0">Gouvernance de l'eau</h3><p class="mt-0">ROBVQ et les 40 OBV, CMM / BIRC, CMQ, MRC.</p></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" id="contact">
        <div class="grid grid--1-1">
          <div>
            <h2 class="mt-0">Contact</h2>
            <p>Une question, une correction de source, une suggestion de ressource ? Écrivez-nous.</p>
            <p><a href="mailto:info@rivieres-libres.example">info@rivieres-libres.example</a></p>
          </div>
          <div class="newsletter">
            <h2 class="mt-0">Infolettre</h2>
            <p>Recevez les mises à jour sur les cartes et le cadre réglementaire.</p>
            <form action="#" method="post" aria-label="Infolettre">
              <label class="visually-hidden" for="email-apropos">Adresse courriel</label>
              <input id="email-apropos" type="email" name="email" placeholder="votre@courriel.ca" required>
              <button class="btn btn--primary" type="submit">S'abonner</button>
            </form>
          </div>
        </div>

        <div class="callout callout--warning" style="margin-top:var(--space-5)">
          <span class="callout__label">Avertissement</span>
          <p class="mt-0">Les informations de ce portail ont une valeur indicative et n'ont aucune portée légale. Elles ne remplacent pas les cartes officielles, les règlements ni l'avis des autorités compétentes.</p>
        </div>
      </div>
    </section>`,
};
