import generateUniqueCode from "../dao/services/generadordeCodigo.js";
import { CartsServicie, TicketService } from "../repositories/index.js";
import { ProductsService } from "../repositories/index.js";
import { Logger } from "../middlewares/logger.js";

class CartController {
  constructor() {
    Logger.debug("Controlador de Carrito");
  }

  // GET ALL FS
  // async getAll(req, res) {
  //   const carts = manejadorDeCart.getAll();
  //   res.json(carts);
  // }

  async getAll(req, res) {
    let limit = req.query;
    let data = await CartsServicie.getAll(limit);
    res.status(200).json({ data });
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
      const cart = await CartsServicie.getById(cid);
      req.logger.debug(cart);
      res.status(200).send({ status: "success", payload: cart });
    } catch (error) {
      req.logger.error(error);
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
      const newCart = await CartsServicie.create();
      res.status(201).send({ status: "success", payload: newCart });
    } catch (error) {
      req.logger.debug(error);
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
      if (req.session && req.session.user.rol == "Premium") {
        let product = await ProductsService.getById(pid);

        if (product.owner == req.session.user._id) {
          res.status(500).send({
            status: "error",
            error: "No puedes agregar un producto propio",
          });
          return;
        }
      }

      const updatedCart = await CartsServicie.add(cid, pid, parseInt(quantity));
      res.status(201).send({ status: "success", payload: updatedCart });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  async delete(req, res) {
    const { cid, pid } = req.params;
    try {
      const deleteProduct = await CartsServicie.delete(cid, pid);
      req.logger.info("borrado");
      res.status(201).send({ status: "success", payload: deleteProduct });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  async updateProductsInCart(req, res) {
    const { cid } = req.params;
    const productsToUpdate = req.body;

    req.logger.debug("ID del producto:", cid);

    try {
      // Iterar sobre cada producto en la lista y actualizarlo en el carrito
      for (const { product, quantity } of productsToUpdate) {
        await CartsServicie.updateProductsInCart(cid, product, quantity);
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
      const updatedQuantity = await CartsServicie.update(
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
      const deleteProducts = await CartsServicie.deleteAll(cid);
      req.logger.info("ProductOS borradoS del carrito");
      res.status(201).send({ status: "success", payload: deleteProducts });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  async purchase(req, res) {
    const { cid } = req.params;
    try {
      const cartPurchase = await CartsServicie.getById(cid);
      console.log("Cart before purchase:", cartPurchase); // Verifica el contenido del carrito

      if (cartPurchase.products.length === 0) {
        return res.status(400).json({ error: "El carrito está vacío" });
      }

      let cantidadTotal = 0;
      const productsComprados = [];
      const productsNoComprados = [];

      for (let i = 0; i < cartPurchase.products.length; i++) {
        const { product: productId, quantity } = cartPurchase.products[i];
        const product = await ProductsService.getById(productId);

        if (product.stock >= quantity) {
          productsComprados.push({ productId, quantity });
          const updateProduct = await ProductsService.update(productId, {
            stock: product.stock - quantity,
          });
          const eliminados = await CartsServicie.delete(
            cid,
            productId.toString()
          );
          cantidadTotal += product.price * quantity;
        } else {
          productsNoComprados.push({ productId, quantity });
        }
      }

      // Genera el código único para el ticket
      const ticketCode = generateUniqueCode();
      const ticket = await TicketService.add({
        amount: cantidadTotal,
        code: ticketCode,
        purchaser: req.session.user.email,
      });

      if (productsNoComprados.length > 0) {
        return res.json({ productsNoComprados });
      }

      res.status(200).json({ productsComprados, ticket });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
}
export default new CartController();
