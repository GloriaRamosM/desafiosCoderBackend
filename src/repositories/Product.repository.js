import ProductDTO from "../dao/DTOs/product.dto.js";
import productsModel from "../dao/mongo/models/products.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async (limit, page, query, sort) => {
    console.log({ limit, page, query, sort });
    return await this.dao.getAll({ limit, page, query, sort });
  };

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
