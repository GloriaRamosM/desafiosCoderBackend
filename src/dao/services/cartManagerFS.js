import fs from "fs";
import { randomUUID } from "node:crypto";
import ProductManager from "./productManager.js";

const manejadorDeProducto = new ProductManager("./src/data/productos.json");

export default class CartManager {
  path;
  constructor(path) {
    this.path = path;
    if (fs.existsSync(this.path)) {
      this.productos = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      console.log("existe el archivo");
    } else {
      fs.writeFileSync(this.path, JSON.stringify(this.productos));
      console.log("no existe");
    }
  }

  // consultar si hace falta sacar el await en la parte de JSON.parse
  createCart = async () => {
    try {
      let carrito = await fs.promises.readFile(this.path, "utf-8");
      let parsedCart = JSON.parse(carrito);

      const ID = randomUUID();

      let cart = {
        id: ID,
        products: [],
      };

      parsedCart.push(cart);
      let data = JSON.stringify(parsedCart, null, "\t");
      await fs.promises.writeFile(pathCart, data, null);
    } catch (error) {
      console.error("Error al crear el carrito:", error);
    }
  };

  get = async () => {
    const cartsFile = await fs.promises.readFile(this.path, "utf-8");
    const carritos = await JSON.parse(cartsFile);
    return carritos;
  };

  getById = async () => {
    let id = req.params.cid;
    let carrito = await fs.promises.readFile(this.path, "utf-8");
    let parsedCart = JSON.parse(carrito);

    let finalCart = parsedCart.find((cart) => cart.id === id);

    if (finalCart === undefined) {
      console("El carrito no fue encontrado.");
    } else {
      return finalCart.products;
    }
  };

  // busca por el id un carrito , cuando lo encuentra le suma el id de producto que le paso, y si existe le suma la cantidad
  update = async () => {
    try {
      let carrito = await fs.promises.readFile(pathCart, "utf-8");
      let parsedCart = JSON.parse(carrito);

      let pid = req.params.pid;
      let foundProduct = await manejadorDeProducto.getProductoById(pid);

      if (!foundProduct) {
        return console.log(
          "Producto no encontrado (post de cart /:cid/product/:pid"
        );
      }

      let cid = req.params.cid;
      let foundCartIndex = parsedCart.findIndex((c) => c.id == cid);

      if (foundCartIndex === -1) {
        return console.log(
          "El ID del carrito solicitado no fue encontrado(post de cart)"
        );
      }

      const productIndex = parsedCart[foundCartIndex].products.findIndex(
        (product) => product.id == pid
      );
      if (productIndex !== -1) {
        parsedCart[foundCartIndex].products[productIndex].quantity++;
        console.log(
          "se sumo la cantidad a tu producto ya guardado anteriormente"
        );
      } else {
        parsedCart[foundCartIndex].products.push({ id: pid, quantity: 1 });
        console.log("Se agrego el ID del producto al carrito solicitado");
      }

      await fs.promises.writeFile(
        pathCart,
        JSON.stringify(parsedCart, null, "\t")
      );
      return;
    } catch (error) {
      console.error("Error al procesar la solicitud:");
    }
  };
}

// Debo comentar todo para recordar como funciona cada cosa
