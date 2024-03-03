const socket = io();

function submitForm(event) {
  event.preventDefault();

  const formData = new FormData(document.getElementById("products"));

  // el form data lo convierte a un objeto
  const jsonObjeto = {};
  formData.forEach((value, key) => {
    jsonObjeto[key] = value;
  });

  socket.emit("articuloCargado", { jsonObjeto });
  // Log the JSON data (replace this with sending the data to your server)
  console.log(JSON.stringify(jsonObjeto));

  socket.on("datos recibidos", (data) => {
    data.jsonObjeto.innerHTML = +jsonObjeto;
  });
}
