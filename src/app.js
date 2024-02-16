import ProductMannager from "./services/productManager.js";
import express from "express";
import fs, { writeFileSync } from "fs";
import { randomUUID } from "node:crypto";

const app = express();
const manejadorDeProducto = new ProductMannager("./src/data/productos.json");
const port = 8080;

const pathCart = "./src/data/carrito.json";

// Midlewares
app.use(express.json());

// RUTAS DE PRODUCTS
app.get("/api/products/", async (req, res) => {
  const limit = req.query.limit;
  const products = await manejadorDeProducto.getProductos(limit);
  res.json(products);
});

app.get("/api/products/:pid/", async (req, res) => {
  const productId = req.params.pid;
  const product = await manejadorDeProducto.getProductoById(productId);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(product);
});

app.post("/api/products/", async (req, res) => {
  const productNuevo = req.body;

  try {
    const product = await manejadorDeProducto.agregarProductos(productNuevo);
    if (!product) {
      return res.status(400).json({ error: "No se pudo crear" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({
      error: "Ocurrió un error interno al intentar crear el producto.",
    });
  }
});

app.put("/api/products/:pid/", async (req, res) => {
  const id = req.params.pid;
  const cambios = req.body;

  if (!id || !cambios) {
    return res.status(400).json({
      error:
        "Se requiere proporcionar 'id' y 'cambios' en el cuerpo de la solicitud.",
    });
  }

  try {
    const productAct = await manejadorDeProducto.updateProduct(id, cambios);
    if (!productAct) {
      return res.status(404).json({ error: "No se pudo actualizar" });
    }
    res.json(productAct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({
      error: "Ocurrió un error interno al intentar actualizar el producto.",
    });
  }
});

app.delete("/api/products/:pid/", async (req, res) => {
  const id = req.params.pid;

  if (!id) {
    return res.status(400).json({
      error: "Se requiere proporcionar 'id'",
    });
  }

  try {
    const deleted = await manejadorDeProducto.deleteProduct(id);
    if (deleted == null) {
      return res.status(404).json({
        error: `No se encontró ningún producto con el ID ${id} por esto, no se puede eliminar`,
      });
    }
    res.send(`el producto con el id ${id} fue eliminado `);
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({
      error: "Ocurrió un error interno al intentar eliminar el producto.",
    });
  }
});

// RUTAS DE CARRITO

app.post("/api/carts/", async (req, res) => {
  try {
    let carrito = await fs.promises.readFile(pathCart, "utf-8");
    let parsedCart = JSON.parse(carrito);

    const ID = randomUUID();

    let cart = {
      id: ID,
      products: [],
    };

    parsedCart.push(cart);
    let data = JSON.stringify(parsedCart, null, "\t");
    await fs.promises.writeFile(pathCart, data, null);

    res.send("Carrito creado");
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({
      error: "Ocurrió un error al crear el carrtio.",
    });
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  let id = req.params.cid;
  let carrito = await fs.promises.readFile(pathCart, "utf-8");
  let parsedCart = JSON.parse(carrito);

  let finalCart = parsedCart.find((cart) => cart.id === id);

  if (finalCart === undefined) {
    res.status(404).send("El carrito no fue encontrado.");
  } else {
    res.json(finalCart);
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  // POST  debe agregar un prodcuto nuevo a ese carrito id que ando buscando
});

app.listen(port, () => console.log("servidor corriendo en el puerto " + port));
