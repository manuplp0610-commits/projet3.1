import { pageAdmin } from "./admin.js";

// set timeOut du bouton conact dans la page login
window.addEventListener("load", () => {
  if (window.location.hash === "#contact") {
    setTimeout(() => {
      const section = document.querySelector("#contact");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, null, " ");
      }
    }, 300);
  }
});
// =========================LOCALSTORAGE PAGE ADMIN============================

const isLoggedIn = localStorage.getItem("isLoggedIn");

document.addEventListener("DOMContentLoaded", () => {
  if (isLoggedIn === "true") {
    pageAdmin();
  }
});

//==================AFFICHER PROJETS DYNAMIQUEMENT DANS L ACCUEIL=====================

// Récupère les projets depuis l'API
async function recupererProjets() {
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

// ====================================FILTRES========================================

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
// fermer modale au click exterieur
const fondModale = document.querySelector(".fondModale");

fondModale.addEventListener("click", (event) => {
  if (event.target === fondModale) {
    fondModale.style.display = "none";
  }
});

// ============afficher gallerie de la modale

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

      // =================evenement de suppression des projets

      trashIcon.addEventListener("click", async () => {
        const confirmation = confirm("Voulez-vous supprimer cette image ?");

        if (!confirmation) {
          return;
        }

        const token = localStorage.getItem("token");

        const reponse = await fetch(
          `http://localhost:5678/api/works/${data.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (reponse.ok) {
          figure.remove();
          const nouveauxProjets = await recupererProjets();
          afficherProjetsIndex(nouveauxProjets);
        } else {
          alert("Erreur lors de la suppression");
        }
      });

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
      
    </div><i class="fa-solid fa-trash trashBis"></i>
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

  // revenir a la modale du formulaire
  btnCloseform.addEventListener("click", () => {
    afficherGalerieModale();
  });

  // ==================formulaire d ajout deprojet========================

  const formulaire = document.querySelector(".formulairAjout");

  // Modif de la zone d'image quand l'image est chargée
  const inputFile = form.querySelector('input[type="file"]');
  const preview = form.querySelector("#preview");
  const icon = form.querySelector("i");
  const btnajout = form.querySelector(".btnajout");
  const formatImage = form.querySelector(".zoneAjout p");
  const zoneAjout = form.querySelector(".zoneAjout");
  const trashBis = form.querySelector(".trashBis");
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];

    if (!file) return;

    // Format autorisés
    const typesAutorises = ["image/jpeg", "image/png"];
    const tailleMax = 4 * 1024 * 1024;

    // vérification type
    if (!typesAutorises.includes(file.type)) {
      alert("Seulement les fichiers JPG et PNG sont autorisés");

      return;
    }

    // vérification taille
    if (file.size > tailleMax) {
      alert("L'image ne doit pas dépasser 4 Mo");
      inputFile.value = "";
      return;
    }

    // si tout est OK
    modifContainerPreview();

    // suprimer preview
    trashBis.addEventListener("click", () => {
      resetContainerPreview();
      inputFile.value = "";
    });

    function modifContainerPreview() {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
      trashBis.style.display = "block";
      icon.style.display = "none";
      btnajout.style.display = "none";
      formatImage.style.display = "none";
      zoneAjout.style.padding = "0";
    }
    function resetContainerPreview() {
      preview.src = "";
      preview.style.display = "none";
      trashBis.style.display = "none";
      icon.style.display = "block";
      btnajout.style.display = "flex";
      formatImage.style.display = "block";
      zoneAjout.style.padding = "15px";
      btnValid.style.backgroundColor = "#A7A7A7";
      btnValid.style.border = "none";
    }
  });

  // ===== Vérification formulaire bien rempli=====
  const btnValid = form.querySelector(".btnValid");
  const titleInput = form.querySelector('input[name="title"]');
  const categorySelect = form.querySelector('select[name="category"]');
  const fileInput = form.querySelector('input[type="file"]');

  const select = form.querySelector("select");
  loadCategories(select);
  function verifForm() {
    const titleOk = titleInput.value.trim() !== "";
    const categoryOk = categorySelect.value !== "";
    const fileOk = fileInput.files.length > 0;

    if (titleOk && categoryOk && fileOk) {
      btnValid.disabled = false;
      btnValid.style.backgroundColor = "#1D6154";
      btnValid.style.color = "white";
      btnValid.style.cursor = "pointer";
    } else {
      btnValid.disabled = true;
      btnValid.style.backgroundColor = "#A7A7A7";
      btnValid.style.color = "white";
      btnValid.style.cursor = "not-allowed";
    }
  }

  // écouter les changements
  titleInput.addEventListener("input", verifForm);
  categorySelect.addEventListener("change", verifForm);
  fileInput.addEventListener("change", verifForm);

  // ================= envoi du formulaire =================

  formulaire.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("image", fileInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du projet");
      }

      alert("Projet ajouté avec succès");

      // recharge la galerie de la modale
      afficherGalerieModale();

      // recharge la galerie de la page d'accueil
      const nouveauxProjets = await recupererProjets();
      afficherProjetsIndex(nouveauxProjets);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  });
}
// recuperer categorie de l api
async function loadCategories(select) {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    categories.forEach((categorie) => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.textContent = categorie.name;

      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur catégories :", error);
  }
}
