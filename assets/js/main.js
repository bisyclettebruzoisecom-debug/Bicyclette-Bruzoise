
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
    error.textContent = "";
  } else {
    error.textContent = "Mot de passe incorrect.";
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

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("primary-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  restorePrivateAccess();
  setupNavToggle();
});
