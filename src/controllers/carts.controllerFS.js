import CartManager from "../dao/services/cartManagerFS.js";

const manejadorDeCart = new CartManager("./src/data/carrito.json");

class CartController {
  constructor() {
    console.log("manejador de carrito FS");
  }

  async createCart(req, res) {
    const cart = await manejadorDeCart.createCart();
    res.status(201).json({
      mensaje: " Carrito creado",
      CartID: ID,
    });
    res.json(cart);
  }

  async get(req, res) {
    const carts = manejadorDeCart.get();
    res.json(carts);
  }

  async getById(req, res) {
    const cid = req.params.cid;
    const cart = manejadorDeCart.getById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito  no fue encontrado" });
    }
    res.json(cart);
  }

  async update(req, res) {
    const cid = req.params.cid;
    const pid = req.params.pid;

    if (!cid) {
      return res.status(400).json({
        error: "Se requiere proporcionar 'id de carrito'",
      });
    }

    if (!pid) {
      return res.status(400).json({
        error: "se requiero id de producto",
      });
    }

    try {
      const actualizar = await manejadorDeCart.update(cid, pid);
      res.json({ actualizar });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({
        error: "Ocurrió un error interno al intentar eliminar el producto.",
      });
    }
  }
}

export default new CartController();
