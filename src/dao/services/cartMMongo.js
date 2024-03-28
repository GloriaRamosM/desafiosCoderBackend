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
    try {
      let result = await cartModel
        .findById(id)
        .populate("products.product")
        .lean();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
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
      cart.products.splice(product, 1);
    }

    return await cart.save();
  };

  updateCart = async (cid, pid, quantity) => {
    let cart = await cartModel.findById(cid);
    let product = cart.products.findIndex(
      (product) => product.product.toString() === pid
    );
    if (product !== -1) {
      cart.products[product].quantity = quantity;
    }

    await cart.save();
    return cart;
  };

  updateProductsInCart = async (cid, pid, quantity) => {
    try {
      let cart = await cartModel.findById(cid);

      if (!cart) {
        throw new Error("El carrito no existe.");
      }
      let productIndex = cart.products.findIndex(
        (product) => product.product.toString() === pid
      );

      if (productIndex === -1) {
        cart.products.push({ product: pid, quantity });
      } else {
        cart.products[productIndex].quantity = quantity;
      }

      // Guardar los cambios en la base de datos
      await cart.save();

      return cart; // Devuelve  el carrito actualizado para poder usarlo
    } catch (error) {
      console.error(
        "Error al intentar actualizar los productos del carrito:",
        error
      );
      throw error; // envia el error para poder manejarlo
    }
  };

  deleteProducts = async (cid) => {
    try {
      let cart = await cartModel.findById(cid);
      if (!cart) {
        console.log("Carrito no encontrado");
        return; // SI no lo encuentra, termina aca
      }
      if (cart.products.length === 0) {
        console.log("El carrito ya está vacío");
        return; // Si el carrito esta vacio y no tiene nada que borrar, termina aca
      }
      // Si encuentra al carrito, sigue y vacia products
      cart.products = [];

      // Guardar  el carrito actualizado sin productos
      await cart.save();

      console.log(
        "Todos los productos fueron eliminados del carrito exitosamente"
      );
      return cart; // Devolver el carrito actualizado, me lo deja disponible
    } catch (error) {
      console.error(
        "Error al intentar eliminar los productos del carrito:",
        error
      );
      throw error; // Reenviar el error para ser manejado por el código que llama a esta función
    }
  };
}
