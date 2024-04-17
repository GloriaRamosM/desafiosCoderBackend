const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json) {
        if (json.status === "success") {
          alert(
            `¡Bienvenido, ${obj.first_name} ahora puedes ingresar con tus credenciales`
          );
          window.location.href = "/products";
        } else if (json.error) {
          alert(json.error);
        } else {
          alert("Error desconocido");
        }
      } else {
        alert("Error: respuesta del servidor indefinida");
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud Fetch:", error);
    });
});
