/* Accès adhérents (verrouillage côté client)
   IMPORTANT : ce mécanisme ne constitue PAS une vraie sécurité (le code est visible).
   Usage : changez PRIVATE_PASSWORD ci-dessous, puis commit/push sur GitHub Pages. */

(function () {
  "use strict";

  // Doit correspondre au STORAGE_KEY utilisé par circuits2026.js
  const STORAGE_KEY = "bb_private_access";

  // Option: persistance entre onglets et après fermeture du navigateur
  // (localStorage). Fallback sessionStorage si localStorage indisponible.
  const storage = (function () {
    try {
      const k = "__bb_test__";
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return localStorage;
    } catch (e) {
      return sessionStorage;
    }
  })();

  function storageGet(key) { return storage.getItem(key); }
  function storageSet(key, val) { storage.setItem(key, val); }
  function storageRemove(key) { storage.removeItem(key); }

  // >>> Mot de passe du club (à modifier ici) <<<
  const PRIVATE_PASSWORD = "Obernai25";

  function byId(id) {
    return document.getElementById(id);
  }

  function show(el) {
    if (el) el.classList.remove("hidden");
  }

  function hide(el) {
    if (el) el.classList.add("hidden");
  }

  function setMessage(text) {
    const el = byId("private-message");
    if (!el) return;
    el.textContent = text || "";
  }

  function isUnlocked() {
    return storageGet(STORAGE_KEY) === "1";
  }

  function unlock() {
    storageSet(STORAGE_KEY, "1");
    hide(byId("private-locked-hint"));
    show(byId("private-content"));
    setMessage("");
    // Notifie les pages (ex: circuits2026.js) pour initialiser le calendrier après déverrouillage
    document.dispatchEvent(new CustomEvent("bb:privateUnlocked"));
  }

  function lock() {
    storageRemove(STORAGE_KEY);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
    show(byId("private-locked-hint"));
    hide(byId("private-content"));
    setMessage("Accès verrouillé.");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = byId("private-access-form");
    const pwd = byId("private-password");
    const logout = byId("private-logout");

    // État initial
    if (isUnlocked()) {
      hide(byId("private-locked-hint"));
      show(byId("private-content"));
    } else {
      show(byId("private-locked-hint"));
      hide(byId("private-content"));
    }

    // Login
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const value = (pwd && pwd.value ? pwd.value : "").trim();

        if (!value) {
          setMessage("Veuillez saisir le mot de passe.");
          return;
        }

        if (value === PRIVATE_PASSWORD) {
          if (pwd) pwd.value = "";
          unlock();
        } else {
          setMessage("Mot de passe incorrect.");
        }
      });
    }

    // Logout
    if (logout) {
      logout.addEventListener("click", function () {
        lock();
      });
    }
  });
})();
