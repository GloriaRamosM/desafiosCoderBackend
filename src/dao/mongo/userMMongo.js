import { createHash } from "../../utils.js";
import userModel from "../mongo/models/Users.model.js";
import { Logger } from "../../middlewares/logger.js";

export default class UserManager {
  constructor() {
    Logger.info("ConstructorUserManager");
  }

  getAll = async () => {
    const result = await userModel.find();
    return result;
  };

  getById = async (id) => {
    const result = await userModel.findById(id);
    return result;
  };

  createUser = async (userData) => {
    try {
      // Hashear la contraseña antes de crear el usuario
      userData.password = createHash(userData.password);
      const result = await userModel.create(userData);
      return result;
    } catch (error) {
      Logger.error("Error al tratar de crear un usuario " + error.message);
    }
  };

  updateUser = async (id, userData) => {
    // Hashear la contraseña antes de actualizar el usuario
    try {
      if (userData.password) {
        userData.password = createHash(userData.password);
      }
      const result = await userModel.updateOne({ _id: id }, { $set: userData });
      return result;
    } catch (error) {
      Logger.error("Error al tratar de actualizar un usuario " + error.message);
    }
  };

  deleteUser = async (id) => {
    const result = await userModel.deleteOne({ _id: id });
    return result;
  };

  // Buscar a los usuarios con los carritos incluidos
  getAllUsersWithCart = async () => {
    //logica
    try {
      const users = await userModel.find().populate("cart.product");
      return users;
    } catch (error) {
      Logger.error(
        "error al obtener los usuarios con su carrito ",
        error.message
      );
    }
  };

  // Paginación
  getPaginatedUsers = async (page = 1, limit = 10) => {
    //logica a implementar
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
      };
      const users = await userModel.paginate({}, options);

      return users;
    } catch (error) {
      Logger.error("Error al realizar la paginación " + error.message);
    }
  };
}
