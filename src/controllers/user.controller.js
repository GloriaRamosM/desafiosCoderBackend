import { UsersService } from "../repositories/index.js";
import authManager from "../dao/mongo/authMannager.js";
import { createHash } from "../utils.js";
import { Logger } from "../middlewares/logger.js";

const ServiciesAuthManager = new authManager();

class UserController {
  constructor() {
    Logger.info("Trabajando con UserControler");
  }

  async getAll(req, res) {
    try {
      const users = await UsersService.getAll();
      res.status(200).json({ users });
    } catch (error) {
      console.error(`Error al cargar los usuarios: ${error}`);
      res.status(500).json({ error: `Error al recibir los usuarios` });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await UsersService.getById(id);
      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ error: `Usuario con id: ${id} no encontrado` });
      }
    } catch (error) {
      console.error(`Error al cargar el usuario: ${error}`);
      res.status(500).json({ error: `Error al recibir el usuario` });
    }
  }

  async createUser(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;
      const hashedPassword = createHash(password);
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
      };
      const result = await UsersService.createUser(newUser);
      res.status(201).json({ result });
    } catch (error) {
      console.error(`Error al crear el usuario: ${error}`);
      res.status(500).json({ error: `Error al crear el usuario` });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;

      const { first_name, last_name, email, age, password } = req.body;
      const hashedPassword = createHash(password);

      const updatedUser = {
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
      };
      const result = await UsersService.updateUser(id, updatedUser);
      if (result) {
        res.status(200).json({ message: "Usuario actualizado exitosamente" });
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error(`Error al actualizar el usuario: ${error}`);
      res.status(500).json({ error: `Error al actualizar el usuario` });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await UsersService.deleteUser(id);
      if (deletedUser) {
        res.status(200).json({ message: "Usuario eliminado exitosamente" });
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error(`Error al eliminar el usuario: ${error}`);
      res.status(500).json({ error: `Error al eliminar el usuario` });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await ServiciesAuthManager.login({ email, password });
      req.logger.debug(user.token);
      if (user.token) {
        res
          .cookie("desafio-integrador", user.token, {
            httpOnly: true,
          })
          .send({ status: "success", message: user.message });
      }
    } catch (error) {
      res.send({ status: "error", message: error });
    }
  }

  async chanceRol(req, res) {
    try {
      const uid = req.params.uid;
      const user = await UsersService.getById(uid);

      let newRole;
      if (user.rol === "User") {
        newRole = "Premium";
      } else if (user.rol === "Premium") {
        newRole = "User";
      } else {
        return res.status(400).json({
          status: "failure",
          errorCode: "INVALID_ROLE",
          errorMessage: "Rol de usuario inválido",
        });
      }

      const userData = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        rol: newRole,
        cart: user.cart,
      };

      await UsersService.updateUser(user._id, userData);

      res.status(200).json({
        message: `Usuario actualizado y cambiado a rol ${newRole} exitosamente`,
      });
    } catch (error) {
      console.error("Error al cambiar el rol del usuario:", error);
      res.status(500).json({
        status: "failure",
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage:
          "Error interno del servidor al cambiar el rol del usuario",
      });
    }
  }

  // async chanceRol(req, res) {
  //   try {
  //     const uid = req.params;
  //     const user = await UsersService.getById(uid);
  //     if (user.rol == "User") {
  //       const userData = {
  //         first_name: user.first_name,
  //         last_name: user.last_name,
  //         email: user.email,
  //         age: user.age,
  //         rol: "Premium",
  //         cart: user.cart,
  //       };

  //       await UsersService.updateUser(user._id, userData);
  //       return res.status(200).json({
  //         message:
  //           "Usuario actualizado, y cambiado a rol Premium  exitosamente",
  //       });
  //     }
  //     if (user.rol == "Premium") {
  //       const userData = {
  //         first_name: user.first_name,
  //         last_name: user.last_name,
  //         email: user.email,
  //         age: user.age,
  //         rol: "User",
  //         cart: user.cart,
  //       };

  //       UsersService.updateUser(user._id, userData);
  //       return res.status(200).json({
  //         message:
  //           "Usuario actualizado, y cambiado a rol Premium  exitosamente",
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       status: "failure",
  //       errorCode: "INTERNAL_SERVER_ERROR",
  //       errorMessage: "Error al cambiar al usuario de rol  producto",
  //     });
  //   }
  // }
}

export default new UserController();
