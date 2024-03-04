import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import productsRouter from "./src/routes/productsRouter.js";
import cartsRouter from "./src/routes/cartsRouter.js";
import viewsRouter from "./src/routes/views.router.js";
import ProductMannager from "./src/services/productManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = 8080;

//Middlewares
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/src/public`));
app.engine("handlebars", handlebars.engine());

app.use(viewsRouter);

////Routes

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const server = app.listen(port, () =>
  console.log("servidor corriendo en el puerto " + port)
);

const io = new Server(server); // instanciando socket.io
const manejadorDeProducto = new ProductMannager("./src/data/productos.json");

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("articuloCargado", async (data) => {
    const jsonObjeto = data.jsonObjeto;
    const productoAgregado = await manejadorDeProducto.agregarProductos(
      jsonObjeto
    );
    if (productoAgregado) {
      console.log(
        "Producto agregado correctamente, en caso de que el producto exista en los datos, no se volvera a agregar"
      );

      socket.emit("datosRecibidos", productoAgregado);
    } else {
      console.log("No se pudo agregar el producto");
      socket.emit("respuesta", { mensaje: "No se pudo agregar el producto" });
    }
  });

  socket.on("eliminarProducto", async (pid) => {
    const productoEliminado = await manejadorDeProducto.deleteProduct(pid);
    if (productoEliminado) {
      socket.emit("productoEliminado", productoEliminado);
    }
  });
});
