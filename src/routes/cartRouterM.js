import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";
import { ensureIsUser } from "../middlewares/auth.js";

const cartsRouterM = Router();

// GET /api/carts/:cid

cartsRouterM.get("/", CartsController.getAll);

cartsRouterM.get("/:cid", CartsController.getById);

// POST /api/carts
cartsRouterM.post("/", CartsController.create);

// POST /api/carts/:cid/product/:pid AGREGA PRODUCTOS AL CARRITO
cartsRouterM.post("/:cid/products/:pid", ensureIsUser, CartsController.add);

// BORRA EL PRODUCTO DEL CARRITO
cartsRouterM.delete("/:cid/products/:pid", CartsController.delete);

// PUT la consigna dice que deberá actualizar el carrito con un arreglo de productos
//con el formato especificado arriba.
cartsRouterM.put("/:cid", CartsController.updateProductsInCart);

//PUT api/carts/:cid/products/:pid ACTUALIZA atraves de req.
//body la cantidad de ejemplares de ESE producto que pase, dentro del carrito

cartsRouterM.put("/:cid/products/:pid", CartsController.update);

cartsRouterM.delete("/:cid", CartsController.deleteAll);

cartsRouterM.post("/:cid/purchase", ensureIsUser, CartsController.purchase);

export default cartsRouterM;
