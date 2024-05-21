import { Router } from "express";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import MessageManager from "../dao/mongo/messagesMManager.js";
import ProductManager from "../dao/mongo/productMMongo.js";
import CartManager from "../dao/mongo/cartMMongo.js";
import { auth, ensureIsUser } from "../middlewares/auth.js";

const manejadorDeMensajes = new MessageManager();
const manejadorDeProducto = new ProductManager();
const manejadorDeCarrito = new CartManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();
const productosFilePath = join(__dirname, "../data/productos.json");

router.get("/", auth, async (req, res) => {
  try {
    const productosData = await fs.readFile(productosFilePath, "utf-8");
    const productos = JSON.parse(productosData);
    res.render("home", { productos: productos });
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/realtimeproducts", auth, async (req, res) => {
  try {
    const productosData = await fs.readFile(productosFilePath, "utf-8");
    const productos = JSON.parse(productosData);
    res.render("realtimeproducts", { productos: productos });
  } catch (error) {
    console.error("Error al ingresar a la ruta", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/chat", auth, ensureIsUser, async (req, res) => {
  try {
    const messages = await manejadorDeMensajes.getAll();
    res.render("chat", { messages });
  } catch (error) {
    console.error("Error al ingresar a la ruta", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/products", auth, async (req, res) => {
  try {
    let { limit, page, query, sort } = req.query;
    let data = await manejadorDeProducto.getAllH({ limit, page, query, sort });
    // Comprobar si hay productos en los resultados
    const hasProducts = data.payload && data.payload.length > 0;
    // Comprobar si la página actual está dentro del rango válido
    const {
      payload,
      hasPrevPage,
      page: currentPage,
      hasNextPage,
      prevLink,
      nextLink,
    } = data;

    res.render("products", {
      payload,
      hasPrevPage,
      currentPage,
      hasNextPage,
      prevLink,
      nextLink,
      hasProducts,
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/carts/:cid", auth, async (req, res) => {
  try {
    const cid = req.params.cid;
    let carrito = await manejadorDeCarrito.getCartById(cid);
    // condicion para entrar a la vista
    const hasCarrito = carrito.products && carrito.products.length > 0;
    res.render("carts", { carrito, hasCarrito });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/porfile", auth, (req, res) => {
  res.render("porfile", {
    user: req.session.user,
  });
});

//restaurar password
router.get("/restore", (req, res) => {
  res.render("restore");
});

export default router;
