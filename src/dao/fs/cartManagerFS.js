import fs from "fs";
import { randomUUID } from "node:crypto";
import ProductManager from "./productManager.js";

const manejadorDeProducto = new ProductManager(
  "./src/dao/fs/data/productos.json"
);

export default class CartManager {
  carts = [];
  path;
  constructor(path) {
    this.path = path;
    if (fs.existsSync(this.path)) {
      this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      console.log("existe el archivo", this.carts);
    } else {
      fs.writeFileSync(this.path, JSON.stringify(this.carts));
      console.log("no existe");
    }
  }

  // consultar si hace falta sacar el await en la parte de JSON.parse
  create = async () => {
    try {
      const ID = randomUUID();

      let cart = {
        id: ID,
        products: [],
      };

      this.carts.push(cart);
      let data = JSON.stringify(this.carts, null, "\t");
      await fs.promises.writeFile(this.path, data, null);
    } catch (error) {
      console.error("Error al crear el carrito:", error);
    }
  };

  getAll() {
    return this.carts;
  }

  getById(id) {
    let finalCart = this.carts.find((cart) => cart.id === id);

    if (finalCart === undefined) {
      console("El carrito no fue encontrado.");
    } else {
      return finalCart;
    }
  }

  // busca por el id un carrito , cuando lo encuentra le suma el id de producto que le paso, y si existe le suma la cantidad
  add = async (cid, pid) => {
    let foundProduct;
    try {
      foundProduct = await manejadorDeProducto.getProductoById(pid);
    } catch (err) {
      console.error(err);
      foundProduct = null;
    }

    if (!foundProduct) {
      throw new Error("Product not found - Producto no encontrado");
    }

    let foundCartIndex = this.carts.findIndex((c) => c.id == cid);

    if (foundCartIndex === -1) {
      throw new Error(
        "El ID del carrito solicitado no fue encontrado(post de cart)"
      );
    }

    const productIndex = this.carts[foundCartIndex].products.findIndex(
      (product) => product.id == pid
    );
    if (productIndex !== -1) {
      this.carts[foundCartIndex].products[productIndex].quantity++;
      console.log(
        "se sumo la cantidad a tu producto ya guardado anteriormente"
      );
    } else {
      this.carts[foundCartIndex].products.push({ id: pid, quantity: 1 });
      console.log("Se agrego el ID del producto al carrito solicitado");
    }
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, "\t")
      );
      return this.carts[foundCartIndex];
    } catch (error) {
      throw new Error("Error al guardar el producto en el carrito");
    }
  };
}

// Debo comentar todo para recordar como funciona cada cosa
