import { Router } from "express";
import fs, { writeFileSync } from "fs";
import __dirname from "../utils.js";
import { randomUUID } from "node:crypto";

const cartsRouter = Router();

const pathCart = "./src/data/carrito.json";

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

    res.send("Carrito creado");
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({
      error: "Ocurrió un error al crear el carrtio.",
    });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
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

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  // POST  debe agregar un prodcuto nuevo a ese carrito id que ando buscando
});

export default cartsRouter;
