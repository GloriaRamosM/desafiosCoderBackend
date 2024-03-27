import { Router } from "express";
import __dirname from "../utils.js";
import ProductManager from "../dao/services/productMMongo.js";

const productsRouter = Router();

const manejadorDeProducto = new ProductManager();

// GET traigo todos los productos, o usando query, limito cuantos quiero, usando parametros

productsRouter.get("/", async (req, res) => {
  let { limit, page, query, sort } = req.query;
  let data = await manejadorDeProducto.getAll({ limit, page, query, sort });
  console.log(sort);
  res.json({ status: "success", ...data });
});

// GET, usando mi manejador, busco un producto especifico por ID y lo muestro
productsRouter.get("/:pid/", async (req, res) => {
  const productId = req.params.pid;
  let data = await manejadorDeProducto.getById(productId);
  res.json({ data });
});

// POST, en este post usando BODY , le agrego un producto nuevo a mi archivo de productos
productsRouter.post("/", async (req, res) => {
  //const {title, description,code,category,brand,price,stock,status,thumbnails} = req.body
  const newProduct = req.body;
  let result = await manejadorDeProducto.addProduct(newProduct);
  res.json({ result });
});

// PUT, usando mi manejador de Producto con el metodo update puedo actualizar mi producto pasandole id para identificar cual quiero cambiar y enviandole cambios por body
productsRouter.put("/:pid/", async (req, res) => {
  let id = req.params.pid;
  let updateUser = req.body;
  let result = await manejadorDeProducto.updateProduct(id, updateUser);
  res.json({ result });
});

// DELETE, voy a borrar el producto que le indique y le pase por parametros
productsRouter.delete("/:pid/", async (req, res) => {
  const id = req.params.pid;
  let result = await manejadorDeProducto.deleteProduct(id);
  res.json({ result });
});

export default productsRouter;
