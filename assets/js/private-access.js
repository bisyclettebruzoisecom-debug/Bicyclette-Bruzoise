/*!
 * Bicyclette Bruzoise – Private access (client-side)
 * Script commun pour pages "membres" (club / espace adhérents / circuits 2026).
 *
 * Important : ceci n'est pas une protection "sécurité" au sens strict.
 * Pour une vraie confidentialité, utilisez une protection côté serveur (htaccess/PHP).
 */
(function () {
  "use strict";

  // Obfuscation (hash) – évite d'avoir le mot de passe en clair dans le code.
  // Hash = SHA-256( SALT + mot_de_passe )
  const SALT = "BB2026:";
  const REQUIRED_HASH = "91703d2b56a14797a5edb02ff4938e985d60505ef559717af8de9840b0413004";
  const STORAGE_KEY = "bb_private_access";

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function dispatch(name) {
    try {
      document.dispatchEvent(new CustomEvent(name));
    } catch (e) {
      // IE fallback (peu probable)
    }
  }

  function getElements() {
    const form =
      byId("private-access-form") ||
      byId("password-form") ||
      qs("form.login-form");

    const input =
      byId("private-password") ||
      byId("password") ||
      (form ? qs('input[type="password"]', form) : null);

    const message =
      byId("private-message") ||
      byId("password-error") ||
      (form ? qs("[aria-live]", form) : null);

    const privateContent = byId("private-content");
    const lockedHint =
      byId("private-locked-hint") ||
      byId("private-locked");

    const lockBtn =
      byId("private-logout") ||
      byId("lock-btn") ||
      null;

    const submitBtn = (form ? qs('button[type="submit"]', form) : null);

    return { form, input, message, privateContent, lockedHint, lockBtn, submitBtn };
  }

  function setMessage(el, text, isError) {
    if (!el) return;
    el.textContent = text || "";
    if (isError) {
      el.style.color = "#b00020";
    } else {
      el.style.color = "";
    }
  }

  function isUnlocked() {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  }

  function setUnlockedState(unlocked, els) {
    if (!els.privateContent) return;

    if (unlocked) {
      els.privateContent.classList.remove("hidden");
      if (els.lockedHint) els.lockedHint.classList.add("hidden");
      sessionStorage.setItem(STORAGE_KEY, "1");
      dispatch("bb:privateUnlocked");
    } else {
      els.privateContent.classList.add("hidden");
      if (els.lockedHint) els.lockedHint.classList.remove("hidden");
      sessionStorage.removeItem(STORAGE_KEY);
      if (els.input) els.input.value = "";
      dispatch("bb:privateLocked");
    }
  }

  async function sha256Hex(str) {
    const enc = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    const arr = Array.from(new Uint8Array(buf));
    return arr.map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function init() {
    const els = getElements();
    if (!els.form || !els.privateContent) return;

    // état initial
    setUnlockedState(isUnlocked(), els);

    els.form.addEventListener("submit", async function (e) {
      e.preventDefault();
      setMessage(els.message, "", false);

      const pwd = (els.input && els.input.value || "").trim();
      if (!pwd) {
        setMessage(els.message, "Veuillez saisir le mot de passe.", true);
        return;
      }

      if (!window.crypto || !window.crypto.subtle) {
        // Fallback : si SubtleCrypto indisponible, on bascule sur un contrôle minimal
        // (dans la pratique, tous les navigateurs modernes le supportent).
        setMessage(els.message, "Navigateur non compatible. Merci d'utiliser un navigateur récent.", true);
        return;
      }

      const oldText = els.submitBtn ? els.submitBtn.textContent : "";
      if (els.submitBtn) {
        els.submitBtn.disabled = true;
        els.submitBtn.textContent = "Vérification…";
      }

      try {
        const h = await sha256Hex(SALT + pwd);
        if (h === REQUIRED_HASH) {
          setUnlockedState(true, els);
        } else {
          setMessage(els.message, "Mot de passe incorrect.", true);
        }
      } catch (err) {
        setMessage(els.message, "Erreur lors de la vérification.", true);
      } finally {
        if (els.submitBtn) {
          els.submitBtn.disabled = false;
          els.submitBtn.textContent = oldText || "Entrer";
        }
      }
    });

    if (els.lockBtn) {
      els.lockBtn.addEventListener("click", function () {
        setUnlockedState(false, els);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
