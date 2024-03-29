import { Router } from "express";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import MessageManager from "../dao/services/messagesMManager.js";
import ProductManager from "../dao/services/productMMongo.js";
import CartManager from "../dao/services/cartMMongo.js";

const manejadorDeMensajes = new MessageManager();
const manejadorDeProducto = new ProductManager();
const manejadorDeCarrito = new CartManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();
const productosFilePath = join(__dirname, "../data/productos.json");

router.get("/", async (req, res) => {
  try {
    const productosData = await fs.readFile(productosFilePath, "utf-8");
    const productos = JSON.parse(productosData);
    res.render("home", { productos: productos });
  } catch (error) {
    console.error("Error al leer el archivo JSON:", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const productosData = await fs.readFile(productosFilePath, "utf-8");
    const productos = JSON.parse(productosData);
    res.render("realtimeproducts", { productos: productos });
  } catch (error) {
    console.error("Error al ingresar a la ruta", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/chat", async (req, res) => {
  try {
    const messages = await manejadorDeMensajes.getAll();
    res.render("chat", { messages });
  } catch (error) {
    console.error("Error al ingresar a la ruta", error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/products", async (req, res) => {
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
    });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

router.get("/carts/:cid", async (req, res) => {
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

export default router;
