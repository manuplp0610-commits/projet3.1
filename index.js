import { pageAdmin } from "./admin.js";

// =========================LOCALSTORAGE PAGE ADMIN============================

const isLoggedIn = localStorage.getItem("isLoggedIn");

document.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn === "true") {
    pageAdmin();
  }
});

//==================AFFICHER PROJETS DYNAMIQUEMENT DANS L ACCUEIL=====================

// Récupère les projets depuis l'API
export async function recupererProjets() {
  try {
    const reponse = await fetch("http://localhost:5678/api/works");

    if (!reponse.ok) {
      throw new Error(`Erreur HTTP : ${reponse.status}`);
    }

    const data = await reponse.json();
    return data;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
const toutProjets = await recupererProjets();

// Affiche les projets dans la galerie de la page d'accueil
const gallery = document.querySelector(".gallery");

async function afficherProjetsIndex(filtre) {
  gallery.innerHTML = "";

  filtre.forEach((projet) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");

    img.src = projet.imageUrl;
    img.alt = projet.title;

    const figcaption = document.createElement("figcaption");

    figcaption.textContent = projet.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}
afficherProjetsIndex(toutProjets);

// ====================================FILTRES===================================================

const btnFiltres = document.querySelectorAll(".filtre");

// fontion Choisir filtre
function filtrerAffichageIndex() {
  btnFiltres.forEach((btnFiltre) => {
    btnFiltre.addEventListener("click", () => {
      // bouton selectionné en vert
      btnFiltres.forEach((btn) => btn.classList.remove("active"));
      btnFiltre.classList.add("active");

      // condition pour filtres
      switch (btnFiltre.textContent) {
        case "Tout":
          afficherProjetsIndex(toutProjets);
          break;
        case "Objets":
          const projetsObjets = toutProjets.filter(
            (projet) => projet.category.name === "Objets",
          );
          afficherProjetsIndex(projetsObjets);
          break;
        case "Appartements":
          const projetsAppartements = toutProjets.filter(
            (projet) => projet.category.name === "Appartements",
          );
          afficherProjetsIndex(projetsAppartements);
          break;
        case "Hotels et restaurents":
          const projetsHotels = toutProjets.filter(
            (projet) => projet.category.name === "Hotels & restaurants",
          );
          afficherProjetsIndex(projetsHotels);
          break;
      }
    });
  });
}
filtrerAffichageIndex();

// ======================CONNECTION / DECONNECTION================================

const btnLogin = document.querySelector(".btnLogin");

btnLogin.addEventListener("click", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  } else {
    window.location.href = "./login.html";
  }
});

// =================================Modale================================

// fonction ouvrir modale
const btnOpenModale = document.querySelector(".btnModif");

btnOpenModale.addEventListener("click", () => {
  const fondModale = document.querySelector(".fondModale");
  fondModale.style.display = "flex";
  afficherGalerieModale();
});

// function fermer modale
function fermerModale(btn) {
  btn.addEventListener("click", () => {
    document.querySelector(".fondModale").style.display = "none";
    return;
  });
}

// =======afficher gallerie de la modale

async function afficherGalerieModale() {
  try {
    // recuperation api
    const reponse = await fetch("http://localhost:5678/api/works");
    if (!reponse.ok) {
      throw new Error("Erreur serveur");
    }
    const datas = await reponse.json();

    // creation gallerie
    const modale = document.querySelector(".modale");
    modale.innerHTML = "";

    const title = document.createElement("h4");
    title.className = "titleModale";
    title.textContent = "Galerie photos";

    const galleryModale = document.createElement("div");
    galleryModale.className = "galleryModale";

    datas.forEach((data) => {
      // creation de projets dans la modale

      const figure = document.createElement("figure");

      const trashIcon = document.createElement("i");
      trashIcon.className = "fa-solid fa-trash trashIcon";

      const img = document.createElement("img");
      img.className = "imgModale";
      img.src = data.imageUrl;

      figure.appendChild(trashIcon);
      figure.appendChild(img);
      galleryModale.appendChild(figure);
    });

    const hr = document.createElement("hr");
    const btnAjoutPhoto = document.createElement("button");
    btnAjoutPhoto.textContent = "Ajouter une photo";
    btnAjoutPhoto.className = "btnAjoutPhoto";

    const btnCloseModale = document.createElement("span");
    btnCloseModale.className = "btnCloseModale";
    btnCloseModale.textContent = "X";

    // fermer modale
    fermerModale(btnCloseModale);

    // event btn ouvre formulaire modale
    btnAjoutPhoto.addEventListener("click", () => {
      afficherFormulaireModale();
    });

    // ajout des elementdans le formulaire modle
    modale.appendChild(btnCloseModale);
    modale.appendChild(title);
    modale.appendChild(galleryModale);
    modale.appendChild(hr);
    modale.appendChild(btnAjoutPhoto);
  } catch (error) {
    const modale = document.querySelector(".modale");
    modale.innerHTML = `<p>Erreur : ${error.message}</p>`;
  }
}
//=============================formulaire de la modale===================================

function afficherFormulaireModale() {
  const modale = document.querySelector(".modale");
  modale.innerHTML = "";
  modale.style.height = "650px";

  // creation btn fermer modale
  const btnCloseModale = document.createElement("span");
  btnCloseModale.className = "btnCloseModale";
  btnCloseModale.textContent = "X";
  fermerModale(btnCloseModale);

  // creation btn fermer formulaire modale
  const btnCloseform = document.createElement("span");
  btnCloseform.className = "btnCloseform";
  btnCloseform.textContent = "←";

  // cree titre formulaire modale
  const title = document.createElement("h4");
  title.className = "titleModale";
  title.textContent = "Ajout photo";

  // cree formulaire modale
  const form = document.createElement("form");
  form.className = "formulairAjout";
  // formulaire
  form.innerHTML = `
  <div class="zoneAjout">
    <img id="preview" style="display:none;" />
    <div class="cntZoneAjout">
      <i class="fa-regular fa-image logoPrev"></i>
      <label class="btnajout">
      + Ajouter photo
      <input type="file" name="image" hidden required>
      </label>
      <p>jpg, png : 4mo max</p>
      <i class="fa-solid fa-trash trashBis"></i>
    </div>
  </div>

  <label>Titre</label>
  <input type="text" name="title" required>

  <label>Catégorie</label>
  <select name="category" required>
    <option value=""></option>
  </select>
  <hr>
  <button class="btnValid" type="submit" disabled>Valider</button>
`;
  modale.appendChild(title);
  modale.appendChild(btnCloseModale);
  modale.appendChild(btnCloseform);
  modale.appendChild(form);

  btnCloseform.addEventListener("click", () => {
    afficherGalerieModale();
  });
}
