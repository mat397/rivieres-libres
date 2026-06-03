/* ==========================================================================
   Rivières Libres — Comportements front-end (vanilla JS)
   - Menu mobile accessible
   - Accordéons (aria-expanded + clavier)
   - Sélecteur de classe de risque (zone-selector)
   - Carte-placeholder (recherche non fonctionnelle, message d'info)
   - Année dynamique du footer
   ========================================================================== */
(function () {
  "use strict";

  /* --- Menu mobile ------------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    }

    toggle.addEventListener("click", function () {
      setOpen(nav.classList.contains("is-open") === false);
    });

    // Fermer au clic sur un lien (mobile)
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.matchMedia("(max-width: 1023px)").matches) {
        setOpen(false);
      }
    });

    // Fermer avec Échap
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* --- Accordéons ------------------------------------------------------- */
  function initAccordions() {
    var triggers = document.querySelectorAll(".accordion__trigger");
    Array.prototype.forEach.call(triggers, function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;

      function toggle() {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        panel.hidden = expanded;
        if (!expanded) {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } else {
          panel.style.maxHeight = "0px";
        }
      }

      btn.addEventListener("click", toggle);
    });
  }

  /* --- Sélecteur de classe de risque ------------------------------------ */
  var ZONE_DATA = {
    faible: {
      label: "Aléa faible",
      desc: "Secteur où la probabilité d'inondation est la plus basse parmi les zones cartographiées. Des règles d'aménagement s'appliquent tout de même.",
      todo: "Consulter la municipalité avant tout projet ; certains travaux restent encadrés."
    },
    moderee: {
      label: "Aléa modéré",
      desc: "Probabilité d'inondation intermédiaire. Les nouvelles constructions et l'agrandissement sont soumis à des conditions.",
      todo: "Vérifier l'admissibilité de votre projet auprès de la municipalité et privilégier l'adaptation."
    },
    elevee: {
      label: "Aléa élevé",
      desc: "Probabilité d'inondation importante. L'aménagement y est fortement restreint.",
      todo: "Constructions neuves généralement interdites ; informez-vous sur les mesures d'immunisation."
    },
    "tres-elevee": {
      label: "Aléa très élevé",
      desc: "Selon les définitions gouvernementales relayées, ce niveau correspondrait à un risque de plus de 70 % d'être inondé au moins une fois sur 25 ans, avec une profondeur d'eau pouvant dépasser 60 cm. (Seuils à valider sur le guide méthodologique officiel du MELCCFP.)",
      todo: "Aménagement très restreint. Référez-vous à la municipalité et aux mesures de sécurité civile."
    },
    residuel: {
      label: "Zone protégée à risque résiduel",
      desc: "Secteur situé derrière un ouvrage de protection contre les inondations (OPI) reconnu. Le risque est réduit mais subsiste en cas de défaillance ou de crue exceptionnelle.",
      todo: "Des règles particulières s'appliquent selon l'ouvrage reconnu ; vérifiez auprès de votre municipalité."
    }
  };

  function initZoneSelector() {
    var selector = document.querySelector("[data-zone-selector]");
    if (!selector) return;
    var chips = selector.querySelectorAll(".zone-chip");
    var result = selector.querySelector(".zone-result");
    if (!result) return;

    function show(key) {
      var d = ZONE_DATA[key];
      if (!d) return;
      result.innerHTML =
        '<h3>' + d.label + "</h3>" +
        "<p>" + d.desc + "</p>" +
        '<p class="mt-0"><strong>Que faire ?</strong> ' + d.todo + "</p>";
      Array.prototype.forEach.call(chips, function (c) {
        c.setAttribute("aria-pressed", String(c.dataset.zone === key));
      });
    }

    Array.prototype.forEach.call(chips, function (c) {
      c.addEventListener("click", function () { show(c.dataset.zone); });
    });
  }

  /* --- Carte placeholder ------------------------------------------------ */
  function initMapPlaceholder() {
    var forms = document.querySelectorAll("[data-map-search]");
    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var msg = form.querySelector("[data-map-message]");
        if (msg) {
          msg.hidden = false;
          msg.textContent =
            "La carte interactive sera disponible dans une prochaine version. " +
            "En attendant, consultez la carte officielle des zones inondables et de mobilité du gouvernement du Québec.";
        }
      });
    });
  }

  /* --- Année du footer -------------------------------------------------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initAccordions();
    initZoneSelector();
    initMapPlaceholder();
    initYear();
  });
})();
