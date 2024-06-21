import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import productsRouter from "./src/routes/productsRouter.js";
import viewsRouter from "./src/routes/views.router.js";
import cartsRouterM from "./src/routes/cartRouterM.js";
import ProductMannager from "./src/dao/fs/productManager.js";
import MessageManager from "./src/dao/mongo/messagesMManager.js";
import session from "express-session";
import sessionsRouter from "./src/routes/sessions.router.js";
import MongoStore from "connect-mongo";
import passport from "passport";
import initilizePassport from "./src/config/passport.config.js";
import userRouter from "./src/routes/userRouter.js";
import cookieParser from "cookie-parser";
import config from "./src/config.js";
import mongoose from "mongoose";
import fakerRouter from "./src/routes/fakerRouter.js";
import { addLogger } from "./src/middlewares/logger.js";
import { Logger } from "./src/middlewares/logger.js";
import swaggerJSDOC from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = config.PORT || 8080;

const DB_URL = config.DB_URL;
Logger.debug(DB_URL);

// config docu

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: " API Ecommerce-Coder",
      description:
        "La API de este ecommerce facilita la gestión completa de una tienda en línea al proporcionar un conjunto  de endpoints. Los usuarios pueden agregar, actualizar y eliminar productos, gestionar categorías, administrar cuentas de clientes y procesar órdenes de compra.",
    },
  },

  apis: [path.resolve(__dirname, "./src/docs/**/*.yaml")],
};
const specs = swaggerJSDOC(swaggerOptions);

app.use(
  "/apidocs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(specs, {
    customCss: ".swagger-ui .topbar {display:none}",
  })
);

//Middlewares
app.set("views", __dirname + "/src/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/src/public`));
app.engine("handlebars", handlebars.engine());

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
app.use(addLogger);

////Routes
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouterM);
app.use("/api/sessions", sessionsRouter);
app.use("/api", userRouter);
app.use(fakerRouter);

const server = app.listen(port, () =>
  Logger.info("servidor corriendo en el puerto " + port)
);

const connectMongoDB = async () => {
  try {
    await mongoose.connect(DB_URL);
    Logger.info("conexion a la MONGODB");
  } catch (error) {
    console.error("No se pudo conectar a la BD", error);
    process.exit();
  }
};

connectMongoDB();

app.get("/loggerTest", (req, res) => {
  req.logger.fatal("fatal log");
  req.logger.error("error log");
  req.logger.warn("warn log");
  req.logger.info("info log");
  req.logger.debug("debug log");
});

//config.NODE_ENV === "PRODUCTION" ? prodLogger : ;

const io = new Server(server); // instanciando socket.io
const manejadorDeProducto = new ProductMannager(
  "./src/dao/fs/data/productos.json"
);
const manejadorDeMensajes = new MessageManager();

io.on("connection", (socket) => {
  Logger.info("Cliente conectado");

  socket.on("articuloCargado", async (data) => {
    const jsonObjeto = data;
    const productoAgregado = await manejadorDeProducto.agregarProductos(
      jsonObjeto
    );
    if (productoAgregado) {
      Logger.info(
        "Producto agregado correctamente, en caso de que el producto exista en los datos, no se volvera a agregar"
      );

      socket.emit("datosRecibidos", productoAgregado);
    } else {
      Logger.info("No se pudo agregar el producto");
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
