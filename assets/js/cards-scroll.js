/*
 * Limite l'affichage des grilles de cartes (.news-grid) marquées avec
 * l'attribut [data-limit-visible] : seules les N premières cartes restent
 * visibles sans action, les suivantes deviennent accessibles en faisant
 * défiler l'intérieur de la grille (et non toute la page).
 *
 * La hauteur nécessaire est recalculée en JavaScript plutôt que fixée en CSS
 * car le nombre de cartes par ligne change selon la largeur de l'écran
 * (grille en auto-fit / colonnes fixes selon les pages).
 */
(function () {
  "use strict";

  var SCROLLABLE_CLASS = "news-grid--scrollable";

  function getVisibleCount(grid) {
    var attr = grid.getAttribute("data-limit-visible");
    var n = parseInt(attr, 10);
    return isNaN(n) || n <= 0 ? 16 : n;
  }

  function limitGrid(grid) {
    var visibleCount = getVisibleCount(grid);
    var cards = Array.prototype.filter.call(grid.children, function (el) {
      return el.tagName === "ARTICLE";
    });

    // Repart d'une hauteur libre avant de mesurer, pour ne pas fausser le calcul.
    grid.classList.remove(SCROLLABLE_CLASS);
    grid.style.maxHeight = "";

    if (cards.length <= visibleCount) {
      return;
    }

    var containerTop = grid.getBoundingClientRect().top;
    var lastVisibleCard = cards[visibleCount - 1];
    var lastVisibleBottom = lastVisibleCard.getBoundingClientRect().bottom;
    var height = Math.ceil(lastVisibleBottom - containerTop);

    grid.style.maxHeight = height + "px";
    grid.classList.add(SCROLLABLE_CLASS);
  }

  function limitAllGrids() {
    var grids = document.querySelectorAll(".news-grid[data-limit-visible]");
    Array.prototype.forEach.call(grids, limitGrid);
  }

  document.addEventListener("DOMContentLoaded", limitAllGrids);

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(limitAllGrids, 150);
  });
})();
