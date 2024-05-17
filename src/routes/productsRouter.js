import { Router } from "express";
import __dirname from "../utils.js";
import ProductController from "../controllers/products.controller.js";

const productsRouter = Router();

// GET traigo todos los productos, o usando query, limito cuantos quiero, usando parametros

productsRouter.get("/", ProductController.getAll);

// GET, usando mi manejador, busco un producto especifico por ID y lo muestro
productsRouter.get("/:pid/", ProductController.getById);

// POST, en este post usando BODY , le agrego un producto nuevo a mi archivo de productos
productsRouter.post("/", ProductController.add);

// PUT, usando mi manejador de Producto con el metodo update puedo actualizar mi producto pasandole id para identificar cual quiero cambiar y enviandole cambios por body
productsRouter.put("/:pid/", ProductController.update);

// DELETE, voy a borrar el producto que le indique y le pase por parametros
productsRouter.delete("/:pid/", ProductController.delete);

export default productsRouter;
