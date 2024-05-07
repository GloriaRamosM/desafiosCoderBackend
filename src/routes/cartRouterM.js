import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";

const cartsRouterM = Router();

// GET /api/carts/:cid

cartsRouterM.get("/", CartsController.getAllCarts);

cartsRouterM.get("/:cid", CartsController.getCartById);

// POST /api/carts
cartsRouterM.post("/", CartsController.createCart);

// POST /api/carts/:cid/product/:pid AGREGA PRODUCTOS AL CARRITO
cartsRouterM.post("/:cid/products/:pid", CartsController.addProduct);

// BORRA EL PRODUCTO DEL CARRITO
cartsRouterM.delete("/:cid/products/:pid", CartsController.deleteProduct);

// PUT la consigna dice que deberá actualizar el carrito con un arreglo de productos
//con el formato especificado arriba.
cartsRouterM.put("/:cid", CartsController.updateProductsInCart);

//PUT api/carts/:cid/products/:pid ACTUALIZA atraves de req.
//body la cantidad de ejemplares de ESE producto que pase, dentro del carrito

cartsRouterM.put("/:cid/products/:pid", CartsController.updateCart);

cartsRouterM.delete("/:cid", CartsController.deleteProducts);

export default cartsRouterM;
