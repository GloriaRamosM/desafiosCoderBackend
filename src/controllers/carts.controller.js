import CartsManager from "../dao/mongo/cartMMongo.js";

const Servicies = new CartsManager();

class CartController {
  constructor() {
    console.log("Controlador de Carrito");
  }

  // GET ALL FS
  // async getAll(req, res) {
  //   const carts = manejadorDeCart.getAll();
  //   res.json(carts);
  // }

  async getAll(req, res) {
    let limit = req.query;
    let data = await Servicies.getAll(limit);
    res.json({ data });
  }

  // GETBYID FS
  // async getById(req, res) {
  //   const cid = req.params.cid;
  //   const cart = manejadorDeCart.getById(cid);
  //   if (!cart) {
  //     return res.status(404).json({ error: "Carrito  no fue encontrado" });
  //   }
  //   res.json(cart);
  // }

  async getById(req, res) {
    try {
      const cid = req.params.cid;
      const cart = await Servicies.getById(cid);
      console.log(cart);
      res.send({ status: "success", payload: cart });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  //CREATE FS
  // async create(req, res) {
  //   const cart = await manejadorDeCart.create();
  //   res.status(201).json({
  //     mensaje: " Carrito creado",
  //     CartID: ID,
  //   });
  //   res.json(cart);
  // }

  async create(req, res) {
    try {
      const newCart = await Servicies.create();
      res.status(201).send({ status: "success", payload: newCart });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "error", error: error.message });
    }
  }
  //

  //ADD FS
  //   async add(req, res) {
  //     const cid = req.params.cid;
  //     const pid = req.params.pid;

  //     if (!cid) {
  //       return res.status(400).json({
  //         error: "Se requiere proporcionar 'id de carrito'",
  //       });
  //     }

  //     if (!pid) {
  //       return res.status(400).json({
  //         error: "se requiero id de producto",
  //       });
  //     }

  //     try {
  //       const actualizar = await manejadorDeCart.add(cid, pid);
  //       res.json({ actualizar });
  //     } catch (error) {
  //       console.error("Error al eliminar el producto:", error);
  //       res.status(500).json({
  //         error: "Ocurrió un error interno al intentar agregar el producto.",
  //       });
  //     }
  //   }
  // }

  async add(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      const updatedCart = await Servicies.add(cid, pid, parseInt(quantity));
      res.status(201).send({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  async delete(req, res) {
    const { cid, pid } = req.params;
    try {
      const deleteProduct = await Servicies.delete(cid, pid);
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
        await Servicies.updateProductsInCart(cid, product, quantity);
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

  async update(req, res) {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      const updatedQuantity = await Servicies.update(
        cid,
        pid,
        parseInt(quantity)
      );
      res.status(201).send({ status: "success", payload: updatedQuantity });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  async deleteAll(req, res) {
    const { cid } = req.params;
    try {
      const deleteProducts = await Servicies.deleteAll(cid);
      console.log("ProductOS borradoS del carrito");
      res.status(201).send({ status: "success", payload: deleteProducts });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
}
export default new CartController();
