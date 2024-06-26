import fs from "fs";
import { Logger } from "../../middlewares/logger.js";

export default class ProductManager {
  productos = [];
  path;

  constructor(path) {
    this.path = path;
    Logger.debug(this.path);
    if (fs.existsSync(this.path)) {
      this.productos = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      Logger.info("existe el archivo de productos");
    } else {
      fs.writeFileSync(this.path, JSON.stringify(this.productos));
      Logger.info("no existe el archivo de productos");
    }
  }

  // consultar si hace falta sacar el await en la parte de JSON.parse
  getAll = async (limit = null) => {
    const productsfile = await fs.promises.readFile(this.path, "utf-8");
    const products = await JSON.parse(productsfile);
    this.productos = products;
    return limit ? this.productos.slice(0, limit) : this.productos;
  };

  async add({ titulo, descripcion, precio, rutaDeImagen, codigo, stock }) {
    if (
      !titulo ||
      !descripcion ||
      !precio ||
      !rutaDeImagen ||
      !codigo ||
      !stock
    ) {
      return null;
    }

    const productoExistente = this.productos.some(
      (producto) => producto.codigo === codigo
    );

    if (productoExistente) {
      Logger.info("Producto ya existe , no se puede agregar");
      return null;
    }

    const producto = {
      id: this.generarId(),
      titulo: titulo,
      descripcion: descripcion,
      precio: precio,
      rutaDeImagen: rutaDeImagen,
      codigo: codigo,
      stock: stock,
    };

    this.productos.push(producto);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.productos, null, "\t")
    );
    return producto;
  }

  generarId() {
    let id = 0;

    if (this.productos.length === 0) {
      id = 1;
    } else {
      id = this.productos[this.productos.length - 1].id + 1;
    }
    return id;
  }
  // revisar esto para cuando yo borre productos que pasa con el id como los va agregando? OJO
  getById(productoId) {
    const producto = this.productos.find(
      (producto) => producto.id == productoId
    );

    if (!producto) {
      Logger.debug(`Producto con id ${productoId} no encontrado`);
    }

    return producto;
  }

  async update(productoId, cambios) {
    const producto = this.productos.some(
      (producto) => producto.id == productoId
    );
    if (!producto) {
      return null;
    }
    this.productos = this.productos.map((producto) => {
      if (producto.id == productoId) {
        producto = { ...producto, ...cambios };
      }
      return producto;
    });
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.productos, null, "\t")
    );

    return this.productos.find((producto) => producto.id == productoId);
  }

  // METODO  DELETEPRODUCT
  /*1.El metodo deleteProduct recibe como parametro un ID
  2. Crea una constante y aplica sobre mi this.productos(de mi clase) un finIndex, que lo que hace 
  es ubicar el index del elemento en mi array que coincida o cumpla con la condicion que paso despues.
  3. la condicion es que producto.id(el producto sobre el que itera findIndex) coincida con productoId que llega por parametro
  4.si findIndex no encuentra nada, que cumpla, devuelve -1, pero si Si encuentra toma el indice y lo guarda, 
  en este caso yo lo guarde en la constante productoIndex.
  5.If( si es diferente a -1 quiere decir que si lo encontro ) procede a 
  hacer un Splice(en el indice que yo ya ubique con el findIndex y lo habia guardado en mi constante) y el 1 porque 
  el Splice recibe el indice primero y luego la cantidad de elementos a borrar 
  6. Luego lo sobre escibe con writeFile, y actualiza mi this.productos
  7. Si el resultado de el FindIndex es -1, es que no encontro coincidencia 
  en la condicion y hace el console.log(no se encontro ningun producto con ese ID, que recibe por parametro)*/

  async delete(productoId) {
    const productoIndex = this.productos.findIndex(
      (producto) => producto.id == productoId
    );

    if (productoIndex !== -1) {
      Logger.info("Producto encontrado, va a ser eliminado");
      this.productos.splice(productoIndex, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.productos, null, "\t")
      );
      return productoId;
    } else {
      return null;
    }
  }
}

// Debo comentar todo para recordar como funciona cada cosa
