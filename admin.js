export function pageAdmin() {
  createBanner();
  loginButton();
  removeFilters();
  portfolioTitle();
}

// Banniere
function createBanner() {
  const banner = document.createElement("div");
  banner.className = "banner";
  banner.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Mode édition`;
  document.body.prepend(banner);
}

// Login → Logout
function loginButton() {
  const btnLogin = document.querySelector(".btnLogin");
  if (btnLogin) {
    btnLogin.textContent = "Logout";
  }
}

// ================FILTRES====================
function removeFilters() {
  const filters = document.querySelector(".filtresContainer");
  if (filters) {
    filters.style.display = "none";
  }
}

// =================TITRE + BOUTON MODIF=================
function portfolioTitle() {
  const title = document.querySelector("#portfolio h2");
  if (!title) return;

  title.style.marginTop = "150px";
  title.style.marginBottom = "100px";

  const btnModif = document.createElement("span");
  btnModif.className = "btnModif";
  btnModif.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> modifier`;

  title.appendChild(btnModif);
}
