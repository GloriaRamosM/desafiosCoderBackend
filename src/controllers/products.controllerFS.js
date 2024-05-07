import ProductMannager from "../dao/services/productManager.js";

const manejadorDeProducto = new ProductMannager("./src/data/productos.json");

class ProductControllerFS {
  constructor() {
    console.log("ProductControllerFS");
  }

  async getProductos(req, res) {
    const limit = req.query.limit;
    const products = await manejadorDeProducto.getProductos(limit);
    res.json(products);
  }

  async getProductoById(req, res) {
    const productId = req.params.pid;
    const product = await manejadorDeProducto.getProductoById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto  no fue encontrado" });
    }
    res.json(product);
  }

  async agregarProductos(req, res) {
    const productNuevo = req.body;

    try {
      const product = await manejadorDeProducto.agregarProductos(productNuevo);
      if (!product) {
        return res.status(400).json({ error: "No se pudo crear" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error al crear el producto:", error);
      res.status(500).json({
        error: "Ocurrió un error interno al intentar crear el producto.",
      });
    }
  }

  async updateProduct(req, res) {
    const id = req.params.pid;
    const cambios = req.body;

    if (!id || !cambios) {
      return res.status(400).json({
        error:
          "Se requiere proporcionar 'id' y 'cambios' en el cuerpo de la solicitud.",
      });
    }

    try {
      const productAct = await manejadorDeProducto.updateProduct(id, cambios);
      if (!productAct) {
        return res.status(404).json({ error: "No se pudo actualizar" });
      }
      res.json(productAct);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      res.status(500).json({
        error: "Ocurrió un error interno al intentar actualizar el producto.",
      });
    }
  }

  async deleteProduct(req, res) {
    const id = req.params.pid;

    if (!id) {
      return res.status(400).json({
        error: "Se requiere proporcionar 'id'",
      });
    }

    try {
      const deleted = await manejadorDeProducto.deleteProduct(id);
      if (deleted == null) {
        return res.status(404).json({
          error: `No se encontró ningún producto con el ID ${id} por esto, no se puede eliminar`,
        });
      }
      res.send(`el producto con el id ${id} fue eliminado `);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({
        error: "Ocurrió un error interno al intentar eliminar el producto.",
      });
    }
  }
}

export default new ProductControllerFS();
