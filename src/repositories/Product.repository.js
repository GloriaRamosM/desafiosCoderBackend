import ProductDTO from "../dao/DTOs/product.dto.js";
import productsModel from "../dao/mongo/models/products.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
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

  //   getAll = async (limit, page, query, sort) => {
  //     return await this.dao.getAll({ limit, page, query, sort });
  //   };

  getById = async (id) => {
    return await this.dao.getById(id);
  };

  getByBrand = async (brand) => {
    return await this.dao.getByBrand(brand);
  };

  add = async (product) => {
    const newProduct = new ProductDTO(product);
    return await this.dao.add(newProduct);
  };
  update = async (id, productData) => {
    const updateProduct = new ProductDTO(productData);
    return await this.dao.update(id, updateProduct);
  };

  delet = async (id) => {
    return await this.dao.delete(id);
  };

  getAllProductsWithCategories = async () => {
    return await this.dao.getAllProductsWithCategories();
  };

  getPaginateProducts = async () => {
    return await this.dao.getPaginateProducts();
  };
}
