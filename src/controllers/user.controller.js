import UserManager from "../dao/services/userMMongo.js";
import AuthManager from "../dao/services/authMannager.js";

const userManager = new UserManager();
const authManager = new AuthManager();

class UserController {
  constructor() {
    console.log("Trabajando con UserControler");
  }

  async getAll(req, res) {
    try {
      const users = await userManager.getAll();
      res.status(200).json({ users });
    } catch (error) {
      console.error(`Error al cargar los usuarios: ${error}`);
      res.status(500).json({ error: `Error al recibir los usuarios` });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await userManager.getById(id);
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
      const newUser = req.body;
      const result = await userManager.createUser(newUser);
      res.status(201).json({ result });
    } catch (error) {
      console.error(`Error al crear el usuario: ${error}`);
      res.status(500).json({ error: `Error al crear el usuario` });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updatedUser = req.body;
      const result = await userManager.updateUser(id, updatedUser);
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
      const deletedUser = await userManager.deleteUser(id);
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
      const user = await authManager.login({ email, password });
      console.log(user.token);
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
}

export default new UserController();