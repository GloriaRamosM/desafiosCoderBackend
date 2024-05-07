import CartManager from "../dao/services/cartMMongo.js";

const cartManager = new CartManager();

class CartController {
  constructor() {
    console.log("Controlador de Carrito");
  }

  async getAllCarts(req, res) {
    let limit = req.query;
    let data = await cartManager.getAllCarts(limit);
    res.json({ data });
  }

  async getCartById(req, res) {
    try {
      const cid = req.params.cid;
      const cart = await cartManager.getCartById(cid);
      console.log(cart);
      res.send({ status: "success", payload: cart });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  async createCart(req, res) {
    try {
      const newCart = await cartManager.createCart();
      res.status(201).send({ status: "success", payload: newCart });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  async addProduct(req, res) {
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
  }

  async deleteProduct(req, res) {
    const { cid, pid } = req.params;
    try {
      const deleteProduct = await cartManager.deleteProduct(cid, pid);
      console.log("borrado");
      res.status(201).send({ status: "success", payload: deleteProduct });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  async updateProductsInCart(req, res) {
    const { cid } = req.params;
    const productsToUpdate = req.body;

    console.log("ID del producto:", cid);

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
  }

  async updateCart(req, res) {
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
  }

  async deleteProducts(req, res) {
    const { cid } = req.params;
    try {
      const deleteProducts = await cartManager.deleteProducts(cid);
      console.log("ProductOS borradoS del carrito");
      res.status(201).send({ status: "success", payload: deleteProducts });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
}
export default new CartController();
