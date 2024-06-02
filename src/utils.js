import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fakerES as faker } from "@faker-js/faker";
import { Logger } from "./middlewares/logger.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//Clave secreta para firmar el token JWT
const JWT_SECRET = "desafio-integrador";

//Aqui Hasheo de contrase;a ( similar a encriptar o poner dificil)
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// aca validamos la contrase;a con la que usuario ingresa
export const isValidPassword = (user, password) => {
  Logger.debug(
    `Datos a validar: user-password: ${user.password}, password: ${password}`
  );
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = (email) => {
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "5h" });
  return token;
};

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    category: faker.commerce.productMaterial(),
  };
};

export default __dirname;
