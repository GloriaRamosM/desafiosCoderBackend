import productsModel from "../mongo/models/products.js";
import { Logger } from "../../middlewares/logger.js";

export default class ProductManager {
  constructor() {
    Logger.info("Trabajando con productDao");
  }

  getAll = async ({ limit = 10, page = 1, query, sort }) => {
    let options = { limit: limit, page, lean: true };
    if (sort !== undefined && !isNaN(parseInt(sort))) {
      options.sort = { price: parseInt(sort) };
    }
    const queryParams = query ? JSON.parse(query) : {};

    let {
      docs,
      totalPages,
      page: actualPage,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
    } = await productsModel.paginate(queryParams, options);

    //const queryString = JSON.stringify(queryParams);

    const prevLink = hasPrevPage
      ? `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}`
      : null;

    const nextLink = hasNextPage
      ? `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}`
      : null;

    return {
      payload: docs,
      totalPages,
      page: actualPage,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };
  };

  getAllH = async ({ limit = 10, page = 1, query, sort }) => {
    let options = { limit: limit, page, lean: true };
    if (sort !== undefined && !isNaN(parseInt(sort))) {
      options.sort = { price: parseInt(sort) };
    }
    const queryParams = query ? JSON.parse(query) : {};

    let {
      docs,
      totalPages,
      page: actualPage,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
    } = await productsModel.paginate(queryParams, options);

    //const queryString = JSON.stringify(queryParams);

    const prevLink = hasPrevPage
      ? `http://localhost:8080/products?limit=${limit}&page=${prevPage}`
      : null;

    const nextLink = hasNextPage
      ? `http://localhost:8080/products?limit=${limit}&page=${nextPage}`
      : null;

    return {
      payload: docs,
      totalPages,
      page: actualPage,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };
  };

  getById = async (id) => {
    let result = await productsModel.findById(id);
    return result;
  };
  getByBrand = async (brand) => {
    let result = await productsModel.find({ brand: brand });
    return result;
  };
  add = async (product) => {
    const existingProduct = await productsModel.findOne({ code: product.code });
    if (existingProduct) {
      return { message: "Ya existe un producto con este código." };
    } else {
      console.log(product);
      let result = await productsModel.create(product);
      return result;
    }
  };

  update = async (id, productData) => {
    try {
      let result = await productsModel.updateOne(
        { _id: id },
        { $set: productData }
      );

      if (result.nModified === 0) {
        res.json("No se encontró ningún producto para actualizar.");
      }

      return { message: "Producto actualizado correctamente." };
    } catch (error) {
      return { error: error.message };
    }
  };

  delete = async (id) => {
    let result = await productsModel.deleteOne({ _id: id });
    return result;
  };

  //Buscar los productos con categorias incluidas
  getAllProductsWithCategories = async () => {
    try {
      const products = await productsModel.find().populate("category");
      return products;
    } catch (error) {
      Logger.info("Error  al obtener todos lo productos");
    }
  };

  // Para paginar los productos que vienen por Backend
  getPaginateProducts = async (page = 1, limit = 10) => {
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
      };
      const products = await productsModel.paginate({}, options);
      return products;
    } catch (error) {
      Logger.info("Error  al Paginar los  productos");
    }
  };
}
