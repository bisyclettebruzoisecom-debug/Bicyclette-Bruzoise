/*!
 * Bicyclette Bruzoise – upload.js
 * Rôle : interface de dépôt photos pour les capitaines de route.
 *
 * Ce script appelle assets/api/upload.php (voir upload.php).
 * Mot de passe capitaine stocké côté serveur (upload.php), pas ici.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "bb_captain_access";
  const API_URL     = "assets/api/upload.php";
  const ALBUMS_ROOT = "assets/albums/";

  /* -------- stockage session -------- */
  function isUnlocked() {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; } catch (e) { return false; }
  }
  function unlock() {
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
  }
  function lock() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  /* -------- helpers -------- */
  function show(el) { if (el) el.classList.remove("hidden"); }
  function hide(el) { if (el) el.classList.add("hidden"); }
  function escHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* -------- état -------- */
  let selectedFiles = [];

  /* -------- auth -------- */
  function setupAuth() {
    const form    = document.getElementById("upload-auth-form");
    const msgEl   = document.getElementById("upload-auth-message");
    const pwdEl   = document.getElementById("upload-password");
    const logoutB = document.getElementById("upload-logout");

    if (isUnlocked()) {
      showUploadInterface();
    }

    if (form) {
      form.addEventListener("submit", async e => {
        e.preventDefault();
        msgEl.textContent = "";
        const pwd = (pwdEl ? pwdEl.value : "").trim();
        if (!pwd) { msgEl.textContent = "Veuillez saisir le mot de passe."; return; }

        try {
          const fd = new FormData();
          fd.append("action", "auth");
          fd.append("password", pwd);
          const resp = await fetch(API_URL, { method: "POST", body: fd });
          const data = await resp.json();
          if (data.ok) {
            if (pwdEl) pwdEl.value = "";
            unlock();
            showUploadInterface();
          } else {
            msgEl.textContent = data.error || "Mot de passe incorrect.";
          }
        } catch (err) {
          msgEl.textContent = "Erreur de connexion au serveur : " + err.message;
        }
      });
    }

    if (logoutB) {
      logoutB.addEventListener("click", () => {
        lock();
        hide(document.getElementById("upload-content"));
        show(document.getElementById("upload-locked"));
      });
    }
  }

  function showUploadInterface() {
    hide(document.getElementById("upload-locked"));
    show(document.getElementById("upload-content"));
    setupDropZone();
    setupForm();
    loadExistingAlbums();
  }

  /* -------- drop zone -------- */
  function setupDropZone() {
    const zone     = document.getElementById("drop-zone");
    const fileInput = document.getElementById("photos-input");
    if (!zone || !fileInput) return;

    zone.addEventListener("click", () => fileInput.click());
    zone.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") fileInput.click(); });

    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", e => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      addFiles(Array.from(e.dataTransfer.files));
    });

    fileInput.addEventListener("change", () => {
      addFiles(Array.from(fileInput.files));
      fileInput.value = "";
    });
  }

  function addFiles(files) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    files.forEach(f => {
      if (!allowed.includes(f.type)) return;
      if (f.size > 10 * 1024 * 1024) { alert(f.name + " dépasse 10 Mo et ne sera pas ajouté."); return; }
      selectedFiles.push(f);
    });
    renderPreviews();
    updateSubmitState();
  }

  function renderPreviews() {
    const grid = document.getElementById("preview-grid");
    if (!grid) return;

    grid.innerHTML = "";
    if (!selectedFiles.length) { hide(grid); return; }
    show(grid);

    selectedFiles.forEach((f, i) => {
      const wrap = document.createElement("div");
      wrap.className = "preview-item";

      const img = document.createElement("img");
      img.className = "preview-thumb";
      img.alt = f.name;
      const url = URL.createObjectURL(f);
      img.src = url;
      img.onload = () => URL.revokeObjectURL(url);

      const btn = document.createElement("button");
      btn.className = "preview-remove";
      btn.type = "button";
      btn.textContent = "✕";
      btn.setAttribute("aria-label", "Retirer " + f.name);
      btn.addEventListener("click", () => {
        selectedFiles.splice(i, 1);
        renderPreviews();
        updateSubmitState();
      });

      wrap.appendChild(img);
      wrap.appendChild(btn);
      grid.appendChild(wrap);
    });
  }

  function updateSubmitState() {
    const btn = document.getElementById("upload-submit");
    if (!btn) return;
    const date = document.getElementById("sortie-date");
    const nom  = document.getElementById("sortie-nom");
    btn.disabled = !(selectedFiles.length && date && date.value && nom && nom.value.trim());
  }

  /* -------- formulaire -------- */
  function setupForm() {
    const form = document.getElementById("upload-form");
    if (!form) return;

    // Réactiver le bouton dès qu'on saisit
    ["sortie-date", "sortie-nom"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", updateSubmitState);
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!selectedFiles.length) return;

      const date      = document.getElementById("sortie-date").value;
      const nom       = document.getElementById("sortie-nom").value.trim();
      const capitaine = (document.getElementById("sortie-capitaine").value || "").trim();
      const distance  = (document.getElementById("sortie-distance").value || "").trim();

      const submitBtn  = document.getElementById("upload-submit");
      const progressWrap = document.getElementById("upload-progress-wrap");
      const progressBar  = document.getElementById("upload-progress-bar");
      const progressLabel = document.getElementById("upload-progress-label");
      const resultEl   = document.getElementById("upload-result");

      submitBtn.disabled = true;
      show(progressWrap);
      hide(resultEl);
      resultEl.className = "upload-result";

      // Envoi multipart
      const fd = new FormData();
      fd.append("action", "upload");
      fd.append("date", date);
      fd.append("nom", nom);
      fd.append("capitaine", capitaine);
      fd.append("distance", distance);
      selectedFiles.forEach(f => fd.append("photos[]", f, f.name));

      try {
        await uploadWithProgress(fd, progressBar, progressLabel);

        progressLabel.textContent = "Mise à jour de l'index…";
        progressBar.style.width = "100%";

        // Rafraîchir liste
        selectedFiles = [];
        renderPreviews();
        form.reset();
        hide(progressWrap);
        progressBar.style.width = "0%";

        resultEl.textContent = "✓ Photos envoyées avec succès pour « " + nom + " ».";
        resultEl.classList.add("success");
        show(resultEl);
        updateSubmitState();
        loadExistingAlbums();

      } catch (err) {
        hide(progressWrap);
        progressBar.style.width = "0%";
        resultEl.textContent = "Erreur : " + err.message;
        resultEl.classList.add("error");
        show(resultEl);
        submitBtn.disabled = false;
      }
    });

    // Reset
    document.getElementById("upload-reset").addEventListener("click", () => {
      selectedFiles = [];
      renderPreviews();
      updateSubmitState();
      hide(document.getElementById("upload-result"));
    });
  }

  function uploadWithProgress(formData, bar, label) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", API_URL);

      xhr.upload.addEventListener("progress", e => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 90);
          bar.style.width = pct + "%";
          label.textContent = "Envoi : " + pct + "%";
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.ok) resolve(data);
            else reject(new Error(data.error || "Réponse serveur invalide."));
          } catch (e) {
            reject(new Error("Réponse non JSON : " + xhr.responseText.slice(0, 200)));
          }
        } else {
          reject(new Error("HTTP " + xhr.status));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Erreur réseau.")));
      xhr.addEventListener("abort", () => reject(new Error("Envoi annulé.")));

      xhr.send(formData);
    });
  }

  /* -------- Albums existants -------- */
  async function loadExistingAlbums() {
    const list = document.getElementById("existing-albums-list");
    if (!list) return;
    list.innerHTML = "<p class='albums-status'>Chargement…</p>";

    try {
      const resp = await fetch(ALBUMS_ROOT + "index.json?_=" + Date.now());
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const albums = await resp.json();
      albums.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

      list.innerHTML = "";
      if (!albums.length) {
        list.innerHTML = "<p class='albums-status'>Aucun album.</p>";
        return;
      }

      albums.forEach(album => {
        const item = document.createElement("div");
        item.className = "existing-album-item";
        item.innerHTML = `
          <div>
            <div class="existing-album-item-name">${escHtml(album.nom)}</div>
            <div class="existing-album-item-meta">${escHtml(album.date || "")} · ${album.count || 0} photo(s)</div>
          </div>
          <button class="existing-album-delete" data-slug="${escHtml(album.slug)}" title="Supprimer cet album">Supprimer</button>
        `;
        list.appendChild(item);
      });

      list.querySelectorAll(".existing-album-delete").forEach(btn => {
        btn.addEventListener("click", () => {
          if (confirm("Supprimer l'album « " + btn.closest(".existing-album-item").querySelector(".existing-album-item-name").textContent + " » et toutes ses photos ?")) {
            deleteAlbum(btn.dataset.slug);
          }
        });
      });

    } catch (err) {
      list.innerHTML = "<p class='albums-status'>Erreur : " + escHtml(err.message) + "</p>";
    }
  }

  async function deleteAlbum(slug) {
    const fd = new FormData();
    fd.append("action", "delete");
    fd.append("slug", slug);
    try {
      const resp = await fetch(API_URL, { method: "POST", body: fd });
      const data = await resp.json();
      if (data.ok) loadExistingAlbums();
      else alert("Erreur : " + (data.error || "Suppression impossible."));
    } catch (err) {
      alert("Erreur réseau : " + err.message);
    }
  }

  /* -------- Init -------- */
  document.addEventListener("DOMContentLoaded", setupAuth);

})();
