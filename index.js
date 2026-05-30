// Récupère les projets depuis l'API
async function recupererProjets() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const data = await reponse.json();

  return data;
}

// Affiche les projets dans la galerie de la page d'accueil
async function afficherProjetsIndex() {
  const projets = await recupererProjets();
  const gallery = document.querySelector(".gallery");

  projets.forEach((projet) => {
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

// Lance l'affichage des projets au chargement du script
afficherProjetsIndex();
