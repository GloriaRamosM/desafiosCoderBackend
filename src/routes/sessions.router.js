import { Router } from "express";
import userModel from "../dao/models/Users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
const sessionRouter = Router();

//REGISTER SIN PASSPORT
// sessionRouter.post("/register", async (req, res) => {
//   //logica a implementar
//   const { first_name, last_name, email, age, password } = req.body;
//   //no olvidar validar
//   const exist = await userModel.findOne({ email: email });
//   if (exist) {
//     return res
//       .status(400)
//       .send({ status: "error", error: "el correo ya existe" });
//   }
//   const user = {
//     first_name,
//     last_name,
//     email,
//     age,
//     password: createHash(password),
//   };
//   const result = await userModel.create(user);
//   console.log(result);
//   res.status(201).send({ status: "success", payload: result });
// });

sessionRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario registrado" });
  }
);

sessionRouter.get("/failregister", async (req, res) => {
  console.log("error");
  res.send({ error: "Falló el registro(/failregister)" });
});

//LOGIN SIN PASSPORTT SIN PASSPORT
// sessionRouter.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Verificamos si el usuario es administrador
//   if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
//     // Si el correo y la contraseña coinciden con las del administrador, agregamos un campo "rol" a la sesión
//     req.session.user = {
//       name: "Admin",
//       email: email,
//       role: "Admin",
//     };
//     return res.send({
//       status: "success",
//       payload: req.session.user,
//       message: "Inicio exitoso",
//     });
//   }

//   const user = await userModel.findOne({ email });

//   if (!user) {
//     return res
//       .status(400)
//       .send({ status: "error", error: "error en las credenciales" });
//   }

//   // Si no es el usuario administrador, verificamos la contraseña normalmente
//   const validarPass = isValidPassword(user, password);

//   if (!validarPass) {
//     return res
//       .status(401)
//       .send({ error: "error", message: "Error de credenciales" });
//   }

//   // Generamos la sesión para usuarios normales
//   req.session.user = {
//     name: `${user.first_name} ${user.last_name}`,
//     email: user.email,
//     age: user.age,
//     role: "usuario",
//   };

//   res.send({
//     status: "success",
//     payload: req.session.user,
//     message: "Inicio exitoso",
//   });
// });

sessionRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) return res.status(400).send("error");
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };
    res.status(200).send({ status: "success", payload: req.user });
  }
);

sessionRouter.get("/faillogin", async (req, res) => {
  console.log("error EN failLogin");
  res.send({ error: "Fallo" });
});

sessionRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/login");
    } else {
      res.send({ error: err });
    }
  });
});

sessionRouter.post("/restore", async (req, res) => {
  const { email, password } = req.body;
  //validar
  const user = await userModel.findOne({ email });
  console.log(user);
  if (!user)
    return res
      .status(400)
      .send({ status: "error", message: "No se encuentra el user" });
  const newPass = createHash(password);

  await userModel.updateOne({ _id: user._id }, { $set: { password: newPass } });

  res.send({ status: "success", message: "Password actualizado" });
});

export default sessionRouter;
