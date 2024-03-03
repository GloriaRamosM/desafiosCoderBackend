import { Router } from "express";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

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

export default router;
