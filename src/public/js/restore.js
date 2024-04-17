const form = document.getElementById("restoreForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
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
    } else {
      console.log("algo salio mal");
    }
  });
});
