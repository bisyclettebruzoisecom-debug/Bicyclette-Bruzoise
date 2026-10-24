 (function () {
      "use strict";

      const STORAGE_KEY = "bb_rando_access";
      const RANDO_PASSWORD = "RandoBB26";

      const storage = (function () {
        try {
          const key = "__bb_rando_test__";
          localStorage.setItem(key, "1");
          localStorage.removeItem(key);
          return localStorage;
        } catch (error) {
          return sessionStorage;
        }
      })();

      function getElement(id) {
        return document.getElementById(id);
      }

      function isUnlocked() {
        return storage.getItem(STORAGE_KEY) === "1";
      }

      function unlock() {
        const lockedHint = getElement("rando-locked-hint");
        const content = getElement("rando-content");
        const message = getElement("rando-message");

        storage.setItem(STORAGE_KEY, "1");
        if (lockedHint) lockedHint.classList.add("hidden");
        if (content) content.classList.remove("hidden");
        if (message) message.textContent = "";
      }

      function lock() {
        const lockedHint = getElement("rando-locked-hint");
        const content = getElement("rando-content");
        const message = getElement("rando-message");

        storage.removeItem(STORAGE_KEY);
        if (lockedHint) lockedHint.classList.remove("hidden");
        if (content) content.classList.add("hidden");
        if (message) message.textContent = "";
      }

      document.addEventListener("DOMContentLoaded", function () {
        if (isUnlocked()) {
          unlock();
        }

        const form = getElement("rando-access-form");
        if (form) {
          form.addEventListener("submit", function (event) {
            event.preventDefault();

            const pwd = getElement("rando-password");
            const message = getElement("rando-message");
            const value = pwd && pwd.value ? pwd.value.trim() : "";

            if (!value) {
              if (message) message.textContent = "Veuillez saisir le mot de passe.";
              return;
            }

            if (value === RANDO_PASSWORD) {
              if (pwd) pwd.value = "";
              unlock();
            } else if (message) {
              message.textContent = "Mot de passe incorrect.";
            }
          });
        }

        const logout = getElement("rando-logout");
        if (logout) {
          logout.addEventListener("click", lock);
        }
      });
    })();