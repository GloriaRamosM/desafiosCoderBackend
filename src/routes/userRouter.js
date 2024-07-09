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

// Crear un nuevo usuario
userRouter.post("/user", userController.createUser);

userRouter.post(
  "/users/:uid/documents",
  useUpload("products").single("products"),
  userController.uploadDocuments
);

// Actualizar un usuario existente
userRouter.put("/user/:id", userController.updateUser);

// Eliminar un usuario por su ID
userRouter.delete("/user/:id", userController.deleteUser);

//login
userRouter.post("/login", userController.login);

// ruta para cambiar un usuario de user a premium y viceversa

userRouter.post("/users/premium/:uid", ensureIsAdmin, userController.chanceRol);

//recuperar contraseña
userRouter.post("/users/reset-password", userController.recuperarContrasena);

userRouter.get(
  "/users/reset-password/:token",
  userController.recuperarContrasenaToken
);
//userRouter.get("/users/reset-password", userController.updatePassword);

userRouter.post("/logout", (req, res) => {
  //lógica a implementar
});

export default userRouter;
