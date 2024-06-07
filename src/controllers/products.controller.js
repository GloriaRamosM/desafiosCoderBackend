import { ProductsService } from "../repositories/index.js";
import { Logger } from "../middlewares/logger.js";

class ProductController {
  constructor() {
    Logger.info("Controlador de producto");
  }

  //GETALL FS
  // async getAll(req, res) {
  //   const limit = req.query.limit;
  //   const products = await manejadorDeProducto.getAll(limit);
  //   res.json(products);
  // }

  async getAll(req, res) {
    try {
      let { limit, page, query, sort } = req.query;
      let data = await ProductsService.getAll(limit, page, query, sort);
      //let data = await manejadorDeProducto.getAllProductsWithCategories({ limit, page, query, sort });
      req.logger.debug(sort);
      res.status(200).json({ data }); // usamos json porque tiene incluido a send() pero tiene algo adicional en un tema de formato que me conviene usar por ejemplo un null.
    } catch (error) {
      req.logger.error(error);
    }
  }

  //getbyId FS
  // async getById(req, res) {
  //   const productId = req.params.pid;
  //   const product = await manejadorDeProducto.getById(productId);
  //   if (!product) {
  //     return res.status(404).json({ error: "Producto  no fue encontrado" });
  //   }
  //   res.json(product);
  // }

  async getById(req, res) {
    try {
      const productId = req.params.pid;
      let data = await ProductsService.getById(productId);
      res.json({ data });
    } catch (error) {
      Logger.error(error);
      res.send("ID no encontrado");
    }
  }

  //ADD FS
  // async add(req, res) {
  //   const productNuevo = req.body;

  //   try {
  //     const product = await manejadorDeProducto.add(productNuevo);
  //     if (!product) {
  //       return res.status(400).json({ error: "No se pudo crear" });
  //     }
  //     res.json(product);
  //   } catch (error) {
  //     console.error("Error al crear el producto:", error);
  //     res.status(500).json({
  //       error: "Ocurrió un error interno al intentar crear el producto.",
  //     });
  //   }
  // }

  //Agregar un nuevo producto.
  async add(req, res) {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        category,
        stock,
        thumbnails,
        brand,
      } = req.body;

      // Validar que los campos requeridos sean enviados
      const camposRequeridos = [
        "title",
        "description",
        "code",
        "price",
        "status",
        "category",
        "stock",
        "brand",
      ];
      const camposFaltantes = camposRequeridos.filter(
        (campo) => !req.body[campo]
      );

      // Si se encuentran campos faltantes, devolver un error 400 Bad Request
      if (camposFaltantes.length) {
        return res.status(400).json({
          status: "failure",
          errorCode: "faltan_campos",
          errorMessage: `Todos los campos son obligatorios. Faltan los siguientes campos: ${camposFaltantes.join(
            ", "
          )}`,
        });
      }

      // Si todos los campos requeridos están presentes, continuar con la lógica de agregar el producto
      const newProduct = {
        title,
        description,
        code,
        price,
        status,
        category,
        stock,
        thumbnails,
        brand,
      };

      let result = await ProductsService.add(newProduct);
      res.json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "failure",
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: "Error al agregar el producto",
      });
    }
  }

  // async add(req, res) {
  //   try {
  //     const {
  //       title,
  //       description,
  //       code,
  //       price,
  //       status,
  //       category,
  //       stock,
  //       thumbnails,
  //       brand,
  //     } = req.body;

  //     // Verificar si todos los campos requeridos están presentes
  //     if (
  //       !title ||
  //       !description ||
  //       !code ||
  //       !price ||
  //       !status ||
  //       !category ||
  //       !stock ||
  //       !brand
  //     ) {
  //       return res.status(400).json({
  //         status: "failure",
  //         errorCode: "missing_campos",
  //         errorMessage: "Todos los campos son obligatorios",
  //       });
  //     }
  //     const newProduct = {
  //       title,
  //       description,
  //       code,
  //       price,
  //       status,
  //       category,
  //       stock,
  //       thumbnails,
  //       brand,
  //     };
  //     let result = await ProductsService.add(newProduct);
  //     res.json({ result });
  //   } catch (error) {}
  // }

  // Update FS
  //  async update(req, res) {
  //   const id = req.params.pid;
  //   const cambios = req.body;

  //   if (!id || !cambios) {
  //     return res.status(400).json({
  //       error:
  //         "Se requiere proporcionar 'id' y 'cambios' en el cuerpo de la solicitud.",
  //     });
  //   }

  //   try {
  //     const productAct = await manejadorDeProducto.update(id, cambios);
  //     if (!productAct) {
  //       return res.status(404).json({ error: "No se pudo actualizar" });
  //     }
  //     res.json(productAct);
  //   } catch (error) {
  //     console.error("Error al actualizar el producto:", error);
  //     res.status(500).json({
  //       error: "Ocurrió un error interno al intentar actualizar el producto.",
  //     });
  //   }
  // }

  async update(req, res) {
    try {
      let id = req.params.pid;
      const {
        title,
        description,
        code,
        price,
        status,
        category,
        stock,
        thumbnails,
        brand,
      } = req.body;
      const updateProduct = {
        title,
        description,
        code,
        price,
        status,
        category,
        stock,
        thumbnails,
        brand,
      };
      let result = await ProductsService.update(id, updateProduct);
      res.json({ result });
    } catch (error) {
      Logger.error(error);
      res.status(500).json({
        status: "failure",
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: "Error al actualizar un producto",
      });
    }
  }

  //delete FS
  // async delete(req, res) {
  //   const id = req.params.pid;

  //   if (!id) {
  //     return res.status(400).json({
  //       error: "Se requiere proporcionar 'id'",
  //     });
  //   }

  //   try {
  //     const deleted = await manejadorDeProducto.delete(id);
  //     if (deleted == null) {
  //       return res.status(404).json({
  //         error: `No se encontró ningún producto con el ID ${id} por esto, no se puede eliminar`,
  //       });
  //     }
  //     res.send(`el producto con el id ${id} fue eliminado `);
  //   } catch (error) {
  //     console.error("Error al eliminar el producto:", error);
  //     res.status(500).json({
  //       error: "Ocurrió un error interno al intentar eliminar el producto.",
  //     });
  //   }
  // }

  async delete(req, res) {
    const id = req.params.pid;
    let result = await ProductsService.delet(id);
    res.json({ result });
  }
}

export default new ProductController();
