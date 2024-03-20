import productsModel from "../models/products.js";

export default class ProductManager {
  constructor() {
    console.log("Trabajando con productManager");
  }

  getAll = async (limit) => {
    let result = await productsModel.find().limit(limit);
    return result;
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
