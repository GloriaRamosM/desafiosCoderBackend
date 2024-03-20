import { Router } from "express";
import fs, { writeFileSync } from "fs";
import __dirname from "../utils.js";
import { randomUUID } from "node:crypto";

const cartsRouter = Router();

const pathCart = "./src/data/carrito.json";

// debo crear el propio manejador de carrito para no tener tanta logica dentro de las rutas, como lo hice inicialmente con manejador de Producto

// POST, voy al archivo JSON , creo un ID, pusheo el carrito con id a mi archivo de carritos
cartsRouter.post("/", async (req, res) => {
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

    res.status(201).json({
      mensaje: " Carrito creado",
      CartID: ID,
    });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({
      error: "Ocurrió un error al crear el carrtio.",
    });
  }
});

// GET me traigo mi archivo de carrito, lo parseo  y lo envio como respuesta para mostrarlos todos
cartsRouter.get("/", async (req, res) => {
  const cartsFile = await fs.promises.readFile(pathCart, "utf-8");
  const carritos = await JSON.parse(cartsFile);
  res.json(carritos);
  return;
});

// GET dentro de mi archivo JSON , busco al carrito por id y lo muestro (solo los productos dentro del carrito y no el carrito completo)
cartsRouter.get("/:cid", async (req, res) => {
  let id = req.params.cid;
  let carrito = await fs.promises.readFile(pathCart, "utf-8");
  let parsedCart = JSON.parse(carrito);

  let finalCart = parsedCart.find((cart) => cart.id === id);

  if (finalCart === undefined) {
    res.status(404).send("El carrito no fue encontrado.");
  } else {
    res.json(finalCart.products);
  }
});

// POST busco por ID mi carrito, luego busco un producto por ID (si los encuentra)  le pusheo el ID del producto ,al carrito que quiero.
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    let carrito = await fs.promises.readFile(pathCart, "utf-8");
    let parsedCart = JSON.parse(carrito);

    let pid = req.params.pid;
    let foundProduct = await manejadorDeProducto.getProductoById(pid);

    if (!foundProduct) {
      return res.status(404).json({
        error: "Producto no encontrado (post de cart /:cid/product/:pid)",
      });
    }

    let cid = req.params.cid;
    let foundCartIndex = parsedCart.findIndex((c) => c.id == cid);

    if (foundCartIndex === -1) {
      return res
        .status(404)
        .send("El ID del carrito solicitado no fue encontrado(post de cart)");
    }

    const productIndex = parsedCart[foundCartIndex].products.findIndex(
      (product) => product.id == pid
    );
    if (productIndex !== -1) {
      parsedCart[foundCartIndex].products[productIndex].quantity++;
      res.send("se sumo la cantidad a tu producto ya guardado anteriormente");
    } else {
      parsedCart[foundCartIndex].products.push({ id: pid, quantity: 1 });
      res.send("Se agrego el ID del producto al carrito solicitado");
    }

    await fs.promises.writeFile(
      pathCart,
      JSON.stringify(parsedCart, null, "\t")
    );
    res.status(200).json({ message: "Producto agregado al carrito." });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send("Hubo un error al procesar la solicitud.");
  }
});

export default cartsRouter;
