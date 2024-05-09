import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import productsRouter from "./src/routes/productsRouter.js";
import cartsRouter from "./src/routes/cartsRouter.js";
import viewsRouter from "./src/routes/views.router.js";
//import cartsRouterM from "./src/routes/cartRouterM.js";
//import productRouterfs from "./src/routes/productRouterfs.js";
import ProductMannager from "./src/dao/services/productManager.js";
import mongoose from "mongoose";
import MessageManager from "./src/dao/services/messagesMManager.js";
import session from "express-session";
import sessionsRouter from "./src/routes/sessions.router.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import initilizePassport from "./src/config/passport.config.js";
import userRouter from "./src/routes/userRouter.js";
import cookieParser from "cookie-parser";
import config from "./src/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = config.PORT || 8080;

//Middlewares
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/src/public`));
app.engine("handlebars", handlebars.engine());

const server = app.listen(port, () =>
  console.log("servidor corriendo en el puerto " + port)
);

const DB_URL = config.DB_URL;
console.log(DB_URL);

const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("conexion a la MONGODB");
  } catch (error) {
    console.error("No se pudo conectar a la BD", error);
    process.exit();
  }
};

connectMongoDB();

//middleware session

//logica de la sesión
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB_URL,
      ttl: 3600,
    }),
    secret: "Kobu",
    resave: false,
    saveUninitialized: false,
  })
);

//usando passpot, primero traigo a la funcion que cree en passport.config, luego inicio passport y luego uso
// con paassport la session que esta trabajando con la base de Datos Mongo
app.use(cookieParser());
initilizePassport();
app.use(passport.initialize());
app.use(passport.session());

////Routes
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api", userRouter);

const io = new Server(server); // instanciando socket.io
const manejadorDeProducto = new ProductMannager("./src/data/productos.json");
const manejadorDeMensajes = new MessageManager();

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("articuloCargado", async (data) => {
    const jsonObjeto = data;
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

  socket.on("message", async (data) => {
    await manejadorDeMensajes.addMessage(data);
    const messages = await manejadorDeMensajes.getAll();
    io.emit("messageLogs", messages);
  });
});
