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
}

const productosActuales = document.getElementById("productosActuales");

socket.on("datosRecibidos", (data) => {
  console.log(data);
  productosActuales.innerHTML += `   <li id="${data.id}"> ID: ${data.id}  Nombre:  ${data.titulo}  - Precio: ${data.precio} - Descripcion:${data.descripcion}  <button onclick="eliminarProducto(${data.id})"> Eliminar Producto</button> </li> `;
});

const eliminarProducto = (pid) => {
  socket.emit("eliminarProducto", pid);
};

socket.on("productoEliminado", (pid) => {
  const productoAEliminar = document.getElementById(`${pid}`);
  productosActuales.removeChild(productoAEliminar);
});
