import { Router } from "express";
import CartManager from "../dao/services/cartMMongo.js";

const cartsRouterM = Router();

const cartManager = new CartManager();

// GET /api/carts/:cid

cartsRouterM.get("/", async (req, res) => {
  let limit = req.query;
  let data = await cartManager.getAllCarts(limit);
  res.json({ data });
});

cartsRouterM.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    console.log(cart);
    res.send({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

// POST /api/carts
cartsRouterM.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).send({ status: "success", payload: newCart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", error: error.message });
  }
});

// POST /api/carts/:cid/product/:pid AGREGA PRODUCTOS AL CARRITO
cartsRouterM.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartManager.addProduct(
      cid,
      pid,
      parseInt(quantity)
    );
    res.status(201).send({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

// BORRA EL PRODUCTO DEL CARRITO
cartsRouterM.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const deleteProduct = await cartManager.deleteProduct(cid, pid);
    console.log("Producto borrado del carrito");
    res.status(201).send({ status: "success", payload: deleteProduct });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

// PUT la consigna dice que deberá actualizar el carrito con un arreglo de productos
//con el formato especificado arriba.( no entiendo cual arreglo?)
cartsRouterM.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const productsToUpdate = req.body;

  try {
    // Iterar sobre cada producto en la lista y actualizarlo en el carrito
    for (const { product, quantity } of productsToUpdate) {
      await cartManager.updateProductsInCart(cid, product, quantity);
    }

    // Devuelve una respuesta exitosa
    res.status(201).send({
      status: "success",
      message: "Productos actualizados correctamente en el carrito.",
    });
  } catch (error) {
    // Devuelve una respuesta de error si ocurre algún problema
    res.status(500).send({ status: "error", error: error.message });
  }
});

//PUT api/carts/:cid/products/:pid ACTUALIZA atraves de req.
//body la cantidad de ejemplares de ESE producto que pase, dentro del carrito

cartsRouterM.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const updatedQuantity = await cartManager.updateCart(
      cid,
      pid,
      parseInt(quantity)
    );
    res.status(201).send({ status: "success", payload: updatedQuantity });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

cartsRouterM.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const deleteProducts = await cartManager.deleteProducts(cid);
    console.log("ProductOS borradoS del carrito");
    res.status(201).send({ status: "success", payload: deleteProducts });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

export default cartsRouterM;
