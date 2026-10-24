/*!
 * Bicyclette Bruzoise – album.js
 * Rôle : afficher les albums photos pour les adhérents.
 *
 * Structure serveur attendue :
 *   assets/albums/
 *     index.json                ← liste de tous les albums
 *     2026-04-05_pont-rean/
 *       meta.json               ← {nom, date, capitaine?, distance?, photos:[]}
 *       thumbs/photo1.jpg
 *       photos/photo1.jpg
 *
 * index.json (généré par upload.php) :
 *   [ { "slug": "2026-04-05_pont-rean", "nom": "…", "date": "2026-04-05", "count": 12 }, … ]
 */

(function () {
  "use strict";

  const ALBUMS_ROOT = "assets/albums/";
  const STORAGE_KEY = "bb_private_access";

  /* -------- helpers -------- */
  function isUnlocked() {
    try { if (localStorage.getItem(STORAGE_KEY) === "1") return true; } catch (e) {}
    try { if (sessionStorage.getItem(STORAGE_KEY) === "1") return true; } catch (e) {}
    return false;
  }

  function show(el) { if (el) el.classList.remove("hidden"); }
  function hide(el) { if (el) el.classList.add("hidden"); }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  }

  /* -------- état -------- */
  let allAlbums = [];
  let currentPhotos = [];
  let lbIndex = 0;

  /* -------- chargement liste -------- */
  async function loadAlbums() {
    const grid = document.getElementById("albums-grid");
    const loading = document.getElementById("albums-loading");
    const errEl = document.getElementById("albums-error");

    try {
      const resp = await fetch(ALBUMS_ROOT + "index.json?_=" + Date.now());
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      allAlbums = await resp.json();
      allAlbums.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      hide(loading);
      renderAlbumGrid(allAlbums);
    } catch (err) {
      hide(loading);
      errEl.textContent = "Impossible de charger les albums. Vérifiez que assets/albums/index.json existe. (" + err.message + ")";
      show(errEl);
    }
  }

  /* -------- rendu grille -------- */
  function renderAlbumGrid(albums) {
    const grid = document.getElementById("albums-grid");
    grid.innerHTML = "";

    if (!albums.length) {
      grid.innerHTML = "<p class='albums-status'>Aucun album pour le moment.</p>";
      show(grid);
      return;
    }

    albums.forEach(album => {
      const card = document.createElement("article");
      card.className = "card album-card";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "Ouvrir l'album : " + album.nom);

      // Miniatures (jusqu'à 4 aperçus)
      const thumbGrid = document.createElement("div");
      thumbGrid.className = "album-thumb-grid";

      const previewPhotos = (album.preview || []).slice(0, 4);
      if (previewPhotos.length) {
        previewPhotos.forEach((p, i) => {
          const img = document.createElement("img");
          img.src = ALBUMS_ROOT + album.slug + "/thumbs/" + p;
          img.alt = album.nom + " – photo " + (i + 1);
          img.loading = "lazy";
          img.decoding = "async";
          img.onerror = () => { img.style.display = "none"; };
          thumbGrid.appendChild(img);
        });
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "album-thumb-placeholder";
        placeholder.textContent = "📷";
        placeholder.style.gridColumn = "1 / 3";
        placeholder.style.gridRow = "1 / 3";
        thumbGrid.appendChild(placeholder);
      }

      // Infos
      const info = document.createElement("div");
      info.className = "album-info";
      info.innerHTML = `
        <div class="album-info-header">
          <span class="album-name">${escHtml(album.nom)}</span>
          <span class="album-count">${album.count || 0} photo${(album.count || 0) > 1 ? "s" : ""}</span>
        </div>
        <div class="album-date">${formatDate(album.date)}${album.capitaine ? " · " + escHtml(album.capitaine) : ""}${album.distance ? " · " + album.distance + " km" : ""}</div>
      `;

      card.appendChild(thumbGrid);
      card.appendChild(info);

      card.addEventListener("click", () => openAlbum(album));
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openAlbum(album); });

      grid.appendChild(card);
    });

    show(grid);
  }

  /* -------- ouverture d'un album -------- */
  async function openAlbum(album) {
    const grid = document.getElementById("albums-grid");
    hide(grid);

    // Créer la vue détail
    let detail = document.getElementById("album-detail");
    if (detail) detail.remove();

    detail = document.createElement("div");
    detail.id = "album-detail";

    detail.innerHTML = `
      <div class="album-detail-header">
        <button id="back-to-albums" class="btn secondary btn-sm">← Tous les albums</button>
        <div>
          <h2>${escHtml(album.nom)}</h2>
          <p class="album-detail-meta">${formatDate(album.date)}${album.capitaine ? " · " + escHtml(album.capitaine) : ""}${album.distance ? " · " + album.distance + " km" : ""}</p>
        </div>
      </div>
      <div id="photos-grid-loading" class="albums-status">Chargement des photos…</div>
      <div id="photos-grid" class="photos-grid hidden"></div>
    `;

    document.getElementById("private-content").appendChild(detail);

    document.getElementById("back-to-albums").addEventListener("click", () => {
      detail.remove();
      renderAlbumGrid(allAlbums);
      show(grid);
    });

    // Charger le meta.json de l'album
    try {
      const resp = await fetch(ALBUMS_ROOT + album.slug + "/meta.json?_=" + Date.now());
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const meta = await resp.json();
      currentPhotos = meta.photos || [];

      const loadingEl = document.getElementById("photos-grid-loading");
      const photosGrid = document.getElementById("photos-grid");
      hide(loadingEl);

      if (!currentPhotos.length) {
        photosGrid.innerHTML = "<p class='albums-status'>Aucune photo dans cet album.</p>";
        show(photosGrid);
        return;
      }

      currentPhotos.forEach((photo, idx) => {
        const img = document.createElement("img");
        img.className = "photo-thumb";
        img.src = ALBUMS_ROOT + album.slug + "/thumbs/" + photo;
        img.alt = album.nom + " – photo " + (idx + 1);
        img.loading = "lazy";
        img.decoding = "async";
        img.addEventListener("click", () => openLightbox(idx, album.slug));
        photosGrid.appendChild(img);
      });

      show(photosGrid);
    } catch (err) {
      document.getElementById("photos-grid-loading").textContent = "Erreur de chargement : " + err.message;
    }
  }

  /* -------- Lightbox -------- */
  function openLightbox(idx, slug) {
    lbIndex = idx;
    const lb = document.getElementById("lightbox");
    show(lb);
    document.body.style.overflow = "hidden";
    showLbPhoto(slug);
  }

  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    hide(lb);
    document.body.style.overflow = "";
  }

  function showLbPhoto(slug) {
    const photo = currentPhotos[lbIndex];
    const img = document.getElementById("lb-img");
    const counter = document.getElementById("lb-counter");
    const caption = document.getElementById("lb-caption");
    img.src = ALBUMS_ROOT + slug + "/photos/" + (typeof photo === "object" ? photo.filename : photo);
    img.alt = typeof photo === "object" ? (photo.caption || "") : "";
    caption.textContent = typeof photo === "object" ? (photo.caption || "") : "";
    counter.textContent = (lbIndex + 1) + " / " + currentPhotos.length;
  }

  /* -------- Recherche -------- */
  function setupSearch() {
    const input = document.getElementById("album-search");
    if (!input) return;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      const filtered = q
        ? allAlbums.filter(a => (a.nom || "").toLowerCase().includes(q) || (a.capitaine || "").toLowerCase().includes(q))
        : allAlbums;
      renderAlbumGrid(filtered);
    });
  }

  /* -------- Sécurité HTML -------- */
  function escHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* -------- Init -------- */
  function init() {
    if (!isUnlocked()) return;

    loadAlbums();
    setupSearch();

    // Lightbox events
    document.getElementById("lb-close").addEventListener("click", closeLightbox);
    document.getElementById("lb-prev").addEventListener("click", () => {
      // On récupère le slug courant depuis la src de l'image
      const src = document.getElementById("lb-img").src;
      const slug = extractSlugFromSrc(src);
      lbIndex = (lbIndex - 1 + currentPhotos.length) % currentPhotos.length;
      showLbPhoto(slug);
    });
    document.getElementById("lb-next").addEventListener("click", () => {
      const src = document.getElementById("lb-img").src;
      const slug = extractSlugFromSrc(src);
      lbIndex = (lbIndex + 1) % currentPhotos.length;
      showLbPhoto(slug);
    });

    document.getElementById("lightbox").addEventListener("click", function (e) {
      if (e.target === this) closeLightbox();
    });

    document.addEventListener("keydown", e => {
      const lb = document.getElementById("lightbox");
      if (lb.classList.contains("hidden")) return;
      const src = document.getElementById("lb-img").src;
      const slug = extractSlugFromSrc(src);
      if (e.key === "ArrowLeft") { lbIndex = (lbIndex - 1 + currentPhotos.length) % currentPhotos.length; showLbPhoto(slug); }
      if (e.key === "ArrowRight") { lbIndex = (lbIndex + 1) % currentPhotos.length; showLbPhoto(slug); }
      if (e.key === "Escape") closeLightbox();
    });
  }

  function extractSlugFromSrc(src) {
    // assets/albums/{slug}/photos/xxx.jpg
    const m = src.match(/assets\/albums\/([^/]+)\//);
    return m ? m[1] : "";
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (isUnlocked()) init();
  });

  document.addEventListener("bb:privateUnlocked", () => {
    init();
  });

})();
