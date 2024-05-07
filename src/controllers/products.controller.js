import ProductManager from "../dao/services/productMMongo.js";

const manejadorDeProducto = new ProductManager();

class ProductController {
  constructor() {
    console.log("Controlador de producto");
  }

  async getAll(req, res) {
    try {
      let { limit, page, query, sort } = req.query;
      let data = await manejadorDeProducto.getAll({ limit, page, query, sort });
      //let data = await manejadorDeProducto.getAllProductsWithCategories({ limit, page, query, sort });
      console.log(sort);
      res.status(200).json({ data }); // usamos json porque tiene incluido a send() pero tiene algo adicional en un tema de formato que me conviene usar por ejemplo un null.
    } catch (error) {
      console.log(
        "Error al intentar traer todos los productos  " + error.message
      );
    }
  }

  async getById(req, res) {
    const productId = req.params.pid;
    let data = await manejadorDeProducto.getById(productId);
    res.json({ data });
  }

  async addProduct(req, res) {
    const newProduct = req.body;
    let result = await manejadorDeProducto.addProduct(newProduct);
    res.json({ result });
  }

  async updateProduct(req, res) {
    let id = req.params.pid;
    let updateUser = req.body;
    let result = await manejadorDeProducto.updateProduct(id, updateUser);
    res.json({ result });
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;
    let result = await manejadorDeProducto.deleteProduct(id);
    res.json({ result });
  }
}

export default new ProductController();
