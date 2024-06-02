import userModel from "../mongo/models/Users.model.js";
import { isValidPassword, generateToken } from "../../utils.js";
import { Logger } from "../../middlewares/logger.js";

export default class AuthManager {
  constructor() {
    Logger.info("Constructor AuthManager");
  }

  async login({ email, password }) {
    try {
      //lógica a implementar
      const user = await userModel.findOne({ email });
      if (!user) return "Usuario no encontrado";
      const valid = isValidPassword(user, password);
      if (!valid) return "Error de auteuticación";
      const token = generateToken(email);
      return { message: "Autenticacion exitosa", token };
    } catch (error) {
      Logger.error(error);
      res.status(500).send({ status: "error", massage: error.message });
    }
  }
}
