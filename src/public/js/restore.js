const form = document.getElementById("restoreForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  // Verificar si los campos están vacíos
  if (!email || !password) {
    alert("Por favor, ingresa un correo electrónico y una contraseña.");
    return;
  }

  const data = new FormData(form);
  const obj = {};
  console.log(data);
  data.forEach((value, key) => (obj[key] = value));
  //hacer un fetch al end point del back que es en mis router
  fetch("/api/sessions/restore", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status === 200) {
      console.log("exito");
      window.location.href = "/login";
    } else {
      console.log("algo salio mal");
    }
  });
});
