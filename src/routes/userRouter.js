import { Router } from "express";
import passport from "passport";
import { auth, ensureIsAdmin } from "../middlewares/auth.js";
import userController from "../controllers/user.controller.js";
import { use } from "chai";
import { useUpload } from "../dao/services/multer.js";

const userRouter = Router();

//Obtener todos los usuarios. traer a los usuarios usando la estrategia de JWT y loggeado con la ruta de JWT
userRouter.get(
  "/jwt/users",
  passport.authenticate("jwt", { session: false }),
  userController.getAll
);

// traer a los usuarios usando session.

userRouter.get("/users", auth, userController.getAll);

// Obtener un usuario por su ID
userRouter.get("/user/:id", userController.getById);

//Get de los usuarios pero solo con NOMBRE, CORREO y TIPO DE CUENTA
userRouter.get("/usersDatos", userController.getDatosUsers);

// Crear un nuevo usuario
userRouter.post("/user", userController.createUser);

userRouter.post(
  "/users/:uid/documents",
  useUpload().fields([
    { name: "products" },
    { name: "profiles" },
    { name: "documents" },
  ]),
  userController.uploadDocuments
);

// Actualizar un usuario existente
userRouter.put("/user/:id", userController.updateUser);

// Eliminar un usuario por su ID
userRouter.delete("/user/:id", userController.deleteUser);

userRouter.delete("/users", userController.deleteUsers);

//login
userRouter.post("/login", userController.login);

// ruta para cambiar un usuario de user a premium y viceversa

// userRouter.post("/users/premium/:uid", ensureIsAdmin, userController.chanceRol);
userRouter.post("/users/premium/:uid", userController.chanceRol);

//recuperar contraseña
userRouter.post("/users/reset-password", userController.recuperarContrasena);

userRouter.get(
  "/users/reset-password/:token",
  userController.recuperarContrasenaToken
);
//userRouter.get("/users/reset-password", userController.updatePassword);

userRouter.get("/userDashboard", auth, ensureIsAdmin, async (req, res) => {
  try {
    const response = await userController.getAll();
    console.log("Response from getAll:", response); // Log de la respuesta del controlador

    // Verifica que `response` es el objeto esperado
    if (response && response.users) {
      const users = response.users;
      const hasUsers = users.length > 0;

      // Renderizar la vista con los usuarios
      res.render("userDashboard", {
        users,
        hasUsers,
        user: req.session.user,
      });
    } else {
      console.error("La respuesta del controlador no contiene `users`");
      res
        .status(500)
        .send({
          status: "error",
          error: "Error en la respuesta del controlador",
        });
    }
  } catch (error) {
    console.error(`Error al obtener usuarios: ${error}`);
    res
      .status(500)
      .send({ status: "error", error: "Error al obtener usuarios" });
  }
});

userRouter.post("/logout", (req, res) => {
  //lógica a implementar
});

export default userRouter;
