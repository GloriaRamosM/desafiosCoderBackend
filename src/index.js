import ProductMannager from "./services/productManager.js";
import express from "express";

const app = express();
const manejadorDeProducto = new ProductMannager("./src/data/productos.json");
app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const products = await manejadorDeProducto.getProductos(limit);
  res.json(products);
});

app.get("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  const product = await manejadorDeProducto.getProductoById(productId);
  res.json(product);
});

const port = 8080;

app.listen(port, () => console.log("servidor corriendo en el puerto " + port));
