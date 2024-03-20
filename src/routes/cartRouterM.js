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

// POST /api/carts/:cid/product/:pid
cartsRouterM.post("/:cid/product/:pid", async (req, res) => {
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

export default cartsRouterM;
