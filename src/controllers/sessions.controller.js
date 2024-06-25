import userModel from "../dao/mongo/models/Users.model.js";
import { auth } from "../middlewares/auth.js";
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";
import UserdatosDTO from "../dao/DTOs/userdatos.dto.js";
import nodemailer from "nodemailer";
import { Logger } from "../middlewares/logger.js";

class SessionController {
  constructor() {
    Logger.info("Trabajando con SessionController");
  }

  async register(req, res) {
    res.status(201).send({ status: "success", message: "Usuario registrado" });
  }

  async failregister(req, res) {
    req.logger.error("error");
    res.send({ error: "Falló el registro(/failregister)" });
  }

  async login(req, res) {
    if (!req.user) return res.status(400).send("error");
    req.logger.debug(req.session.user);
    req.session.user = {
      _id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      rol: req.user.rol,
    };
    res.status(200).send({ status: "success", payload: req.user });
  }

  async fail(req, res) {
    req.logger.error("error En failLogin");
    res.send({ error: "Fallo el login" });
  }

  async github(req, res) {
    req.session.user = req.user;

    res.redirect("/products"); //ruta a la que redirigimos luego de iniciar sesión
  }

  // Modificada para que pase informacion con un DTO indicando que datos va a enviar
  async current(req, res) {
    const datosUser = new UserdatosDTO(req.session.user);
    res.send({
      datosUser,
      sessionType: "Passport session",
    });

    // res.send({
    //   ...req.session.passport,
    //   ...req.session.user,
    //   sessionType: "Passport session",
    // });
  }

  async logout(req, res) {
    req.session.destroy((err) => {
      if (!err) {
        res.redirect("/login");
      } else {
        res.send({ error: err });
      }
    });
  }

  async restore(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        status: "error",
        message: "Correo electrónico y contraseña son requeridos",
      });
    }

    const user = await userModel.findOne({ email });

    req.logger.debug(user);
    if (!user)
      return res
        .status(400)
        .send({ status: "error", message: "No se encuentra el user" });
    const valid = isValidPassword(user, password);
    if (valid) {
      return res.status(400).send({
        status: "error",
        message: "Contraseña no puede ser igual a la anterior",
      });
    }

    const newPass = createHash(password);

    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: newPass } }
    );

    res.send({ status: "success", message: "Password actualizado" });
  }
}

export default new SessionController();
