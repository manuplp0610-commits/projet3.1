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

// ===================FILTRES=================================
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
