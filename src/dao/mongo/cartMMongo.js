import cartModel from "../mongo/models/carts.js";

export default class CartManager {
  constructor() {
    console.log("Trabajando con cartManager");
  }

  getAll = async (limit) => {
    let result = await cartModel.find().limit(limit);

    return result;
  };

  getById = async (id) => {
    try {
      let result = await cartModel.findById(id);

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  create = async () => {
    let result = await cartModel.create({});
    return result;
  };

  add = async (cid, pid, quantity) => {
    let cart = await cartModel.findById(cid);
    let product = cart.products.find(
      (product) =>
        product && product.product && product.product.toString() === pid
    );

    if (product) {
      product.quantity += quantity;
    } else {
      cart.products.push({ _id: pid, quantity, product: pid });
    }

    return await cart.save();
  };

  delete = async (cid, pid) => {
    try {
      let cart = await cartModel.findById(cid);

      if (!cart) {
        throw new Error("El carrito no existe.");
      }

      // Filtrar el carrito para eliminar todas las instancias del producto con el id dado
      cart.products = cart.products.filter(
        (product) => product.product.toString() !== pid
      );

      // Guardar los cambios en la base de datos
      await cart.save();

      return cart;
    } catch (error) {
      console.error(
        "Error al intentar eliminar un producto del carrito:",
        error
      );
      throw error;
    }
  };

  update = async (cid, pid, quantity) => {
    let cart = await cartModel.findById(cid);

    let product = cart.products.findIndex(
      product && product.product && product.product.toString() === pid
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
        (product) =>
          product && product.product && product.product.toString() === pid
      );

      if (productIndex === -1) {
        // Si el producto no está en el carrito, agregarlo con la cantidad proporcionada
        cart.products.push({ _id: pid, quantity, product: pid });
      } else {
        // Si el producto ya está en el carrito, actualizar la cantidad
        cart.products[productIndex].quantity = quantity;
      }

      // Guardar los cambios en el documento del carrito
      await cart.save();

      return cart; // Devuelve el carrito actualizado para poder usarlo
    } catch (error) {
      console.error(
        "Error al intentar actualizar los productos del carrito:",
        error
      );
      throw error; // Envía el error para poder manejarlo
    }
  };

  deleteAll = async (cid) => {
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
