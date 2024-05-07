import { Router } from "express";
import __dirname from "../utils.js";
import productsControllerFS from "../controllers/products.controllerFS.js";

const productsRouter = Router();

// GET traigo todos los productos, o usando query, limito cuantos quiero, usando parametros
productsRouter.get("/", productsControllerFS.getProductos);

// GET, usando mi manejador, busco un producto especifico por ID y lo muestro
productsRouter.get("/:pid/", productsControllerFS.getProductoById);

// POST, en este post usando BODY , le agrego un producto nuevo a mi archivo de productos
productsRouter.post("/", productsControllerFS.agregarProductos);

// PUT, usando mi manejador de Producto con el metodo update puedo actualizar mi producto pasandole id para identificar cual quiero cambiar y enviandole cambios por body
productsRouter.put("/:pid/", productsControllerFS.updateProduct);

// DELETE, voy a borrar el producto que le indique y le pase por parametros
productsRouter.delete("/:pid/", productsControllerFS.deleteProduct);

export default productsRouter;
