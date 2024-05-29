import userModel from "../dao/mongo/models/Users.model.js";
import { auth } from "../middlewares/auth.js";
import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";
import UserdatosDTO from "../dao/DTOs/userdatos.dto.js";
import nodemailer from "nodemailer";

class SessionController {
  constructor() {
    console.log("Trabajando con SessionController");
  }

  async register(req, res) {
    res.status(201).send({ status: "success", message: "Usuario registrado" });
  }

  async failregister(req, res) {
    console.log("error");
    res.send({ error: "Falló el registro(/failregister)" });
  }

  async login(req, res) {
    if (!req.user) return res.status(400).send("error");
    console.log(req.session.user);
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      rol: req.user.rol,
    };
    res.status(200).send({ status: "success", payload: req.user });
  }

  async fail(req, res) {
    console.log("error En failLogin");
    res.send({ error: "Fallo" });
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
    console.log(user);
    if (!user)
      return res
        .status(400)
        .send({ status: "error", message: "No se encuentra el user" });
    const newPass = createHash(password);

    await userModel.updateOne(
      { _id: user._id },
      { $set: { password: newPass } }
    );

    res.send({ status: "success", message: "Password actualizado" });
  }
}

export default new SessionController();
