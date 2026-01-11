// Mot de passe simple pour les pages qui utilisent #login-section / #private-content
const PASSWORD = "Telgruc24";

function checkPassword(event) {
  if (event) event.preventDefault();

  const input = document.getElementById("password");
  const error = document.getElementById("password-error");
  const loginSection = document.getElementById("login-section");
  const privateContent = document.getElementById("private-content");

  if (!input || !loginSection || !privateContent) {
    return false;
  }

  if (input.value === PASSWORD) {
    localStorage.setItem("bb_isLoggedIn", "true");
    loginSection.classList.add("hidden");
    privateContent.classList.remove("hidden");
    if (error) error.textContent = "";
  } else {
    if (error) error.textContent = "Mot de passe incorrect.";
    input.value = "";
    input.focus();
  }
  return false;
}

function restorePrivateAccess() {
  const isLoggedIn = localStorage.getItem("bb_isLoggedIn") === "true";
  const loginSection = document.getElementById("login-section");
  const privateContent = document.getElementById("private-content");

  if (!loginSection || !privateContent) return;

  if (isLoggedIn) {
    loginSection.classList.add("hidden");
    privateContent.classList.remove("hidden");
  }
}

// Gestion du menu responsive
function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav"); // <nav class="main-nav">…</nav>

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

// Un seul DOMContentLoaded qui initialise tout
document.addEventListener("DOMContentLoaded", () => {
  restorePrivateAccess();
  setupNavToggle();
});
