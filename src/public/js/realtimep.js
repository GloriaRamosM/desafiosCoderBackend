const socket = io();

function submitForm(event) {
  event.preventDefault();

  // Obtener los valores de los campos
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const rutaDeImagen = document.getElementById("rutaDeImagen").value;
  const codigo = document.getElementById("codigo").value;
  const stock = parseInt(document.getElementById("stock").value);

  // Crear un objeto con los datos del formulario
  const data = {
    titulo: titulo,
    descripcion: descripcion,
    precio: precio,
    rutaDeImagen: rutaDeImagen,
    codigo: codigo,
    stock: stock,
  };

  // Emitir los datos al servidor a través del socket
  socket.emit("articuloCargado", data);
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
