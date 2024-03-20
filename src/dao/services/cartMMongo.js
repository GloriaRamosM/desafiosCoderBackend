import cartModel from "../models/carts.js";

export default class CartManager {
  constructor() {
    console.log("Trabajando con cartManager");
  }

  getAllCarts = async (limit) => {
    let result = await cartModel.find().limit(limit);
    return result;
  };

  getCartById = async (id) => {
    let result = await cartModel.findById(id);
    return result;
  };
  createCart = async () => {
    let result = await cartModel.create({});
    return result;
  };

  addProduct = async (cid, pid, quantity) => {
    try {
      // Buscar el carrito por su ID
      let cart = await cartModel.findById(cid);

      // ver si existe el  carrito
      if (!cart) {
        throw new Error("El carrito no existe.");
      }

      // Buscar el producto en el carrito por su ID
      let productIndex = cart.products.findIndex(
        (product) => product.product.toString() === pid
      );

      // Si el producto ya está en el carrito, aumentar la cantidad
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        // Si el producto no está en el carrito, agregarlo con la cantidad especificada
        cart.products.push({ product: pid, quantity });
      }

      // Guardar los cambios en la base de datos
      await cart.save();

      return cart;
    } catch (error) {
      return { error: error.message };
    }
  };

  // addProduct = async (cid, pid, quantity) => {
  //   let cart = await cartModel.findById(cid);
  //   let product = cart.products.find(
  //     (product) => product.product.toString() === pid
  //   );

  //   if (product) {
  //     product.quantity += quantity;
  //   } else {
  //     cart.products.push({ product: pid, quantity });
  //   }

  //   return await cart.save();
  // };

  deleteProduct = async (cid, pid) => {
    let cart = await cartModel.findById(cid);
    let product = cart.products.findIndex(
      (product) => product.product.toString() === pid
    );

    if (product === 0) {
      console.log("Producto no encontrado");
    } else {
      cart.product.splice(product, 1);
    }

    return await cart.save();
  };
}
