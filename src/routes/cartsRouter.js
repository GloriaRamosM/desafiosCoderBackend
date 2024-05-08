import { Router } from "express";
import __dirname from "../utils.js";
import cartsControllerFS from "../controllers/carts.controllerFS.js";

const cartsRouter = Router();

// debo crear el propio manejador de carrito para no tener tanta logica dentro de las rutas, como lo hice inicialmente con manejador de Producto

// POST, voy al archivo JSON , creo un ID, pusheo el carrito con id a mi archivo de carritos
cartsRouter.post("/", cartsControllerFS.createCart);

// GET me traigo mi archivo de carrito, lo parseo  y lo envio como respuesta para mostrarlos todos
cartsRouter.get("/", cartsControllerFS.get);

// GET dentro de mi archivo JSON , busco al carrito por id y lo muestro (solo los productos dentro del carrito y no el carrito completo)
cartsRouter.get("/:cid", cartsControllerFS.getById);

// POST busco por ID mi carrito, luego busco un producto por ID (si los encuentra)  le pusheo el ID del producto ,al carrito que quiero.
cartsRouter.post("/:cid/product/:pid", cartsControllerFS.update);

export default cartsRouter;
