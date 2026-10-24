/*!
 * Bicyclette Bruzoise – main.js
 * Rôle : uniquement UI globale (menu responsive).
 *
 * IMPORTANT :
 * - Le contrôle d'accès "adhérents" est géré par assets/js/private-access.js
 * - Ne PAS dupliquer de mot de passe ici.
 */

(function () {
  "use strict";

  function setupNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav"); // <nav class="main-nav">…</nav>

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupNavToggle();
  });
})();
