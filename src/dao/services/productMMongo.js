import productsModel from "../models/products.js";

export default class ProductManager {
  constructor() {
    console.log("Trabajando con productManager");
  }

  getAll = async ({ limit = 10, page = 1, query, sort }) => {
    let options = { limit: limit, page };
    if (sort) {
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

    const queryString = JSON.stringify(queryParams);

    return {
      payload: docs,
      totalPages,
      page: actualPage,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink: !hasPrevPage
        ? null
        : `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${encodeURIComponent(
            queryString
          )}`,
      nextLink: !hasNextPage
        ? null
        : `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${encodeURIComponent(
            queryString
          )}`,
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
  addProduct = async (product) => {
    const existingProduct = await productsModel.findOne({ code: product.code });
    if (existingProduct) {
      return { message: "Ya existe un producto con este código." };
    } else {
      let result = await productsModel.create(product);
      return result;
    }
  };

  updateProduct = async (id, productData) => {
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

  deleteProduct = async (id) => {
    let result = await productsModel.deleteOne({ _id: id });
    return result;
  };
}
