import ProductManager from "../dao/mongo/productMMongo";
import ProductRepository from "./Product.repository.js";

// MONGO sin ruta
export const ProductsService = new ProductRepository(new ProductManager());

// FS con ruta
// export const ProductsService = new ProductRepository(
//   new Products("./src/dao/fs/data/productos.json")
// );
