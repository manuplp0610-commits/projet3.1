//AUTENTIFICATION DE L UTILISATEUR

function connexion() {
  const formLogin = document.querySelector(".formLogin");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (email.value === "" || password.value === "") {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur login");
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      window.location.href = "./index.html";
    } catch (error) {
      alert("Email ou mot de passe incorrect");
      console.error(error);
    }
  });
}
connexion();

export function deconnection() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  }
}
