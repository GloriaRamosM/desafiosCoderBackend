import fs from "fs";
import { createHash } from "../../utils.js";

export default class UserManager {
  path;
  constructor(path) {
    this.path = path;
    console.log(this.path);
    if (fs.existsSync(this.path)) {
      this.users = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      console.log("existe el archivo de users");
    } else {
      fs.writeFileSync(this.path, JSON.stringify(this.users));
      console.log("no existe el archivo de users");
    }
  }

  getAll = async () => {
    const usersfile = await fs.promises.readFile(this.path, "utf-8");
    const users = await JSON.parse(usersfile);
    this.users = users;
    return limit ? this.users.slice(0, limit) : this.users;
  };

  // revisar esto para cuando yo borre users que pasa con el id como los va agregando? OJO
  getById(userId) {
    const user = this.users.find((user) => user.id == userId);

    if (!user) {
      console.log(`user con id ${userId} no encontrado`);
    }

    return user;
  }

  createUser = async (userData) => {
    try {
      const userExistente = this.users.some(
        (user) => user.email === userData.email
      );

      if (userExistente) {
        console.log("user ya existe , no se puede agregar");
        return null;
      }

      // Hashear la contraseña antes de crear el usuario
      userData.password = createHash(userData.password);
      this.users.push(userData);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.users, null, "\t")
      );
      return user;
    } catch (error) {
      console.log("Error al tratar de crear un usuario " + error.message);
    }
  };

  updateUser = async (id, userData) => {
    // Hashear la contraseña antes de actualizar el usuario
    if (userData.password) {
      userData.password = createHash(userData.password);
    }
    const user = this.users.some((user) => user.id == id);
    if (!user) {
      return null;
    }
    this.users = this.users.map((user) => {
      if (user.id == id) {
        user = { ...user, ...cambios };
      }
      return user;
    });

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.users, null, "\t")
      );

      return this.users.find((user) => user.id == id);
    } catch (error) {
      console.log("Error al tratar de actualizar un usuario " + error.message);
    }
  };

  deleteUser = async (id) => {
    const userIndex = this.users.findIndex((user) => user.id == id);

    if (userIndex !== -1) {
      console.log("user encontrado, va a ser eliminado");
      this.users.splice(userIndex, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.users, null, "\t")
      );
      return id;
    } else {
      return null;
    }
  };
}
