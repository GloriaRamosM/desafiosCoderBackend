import dotenv from "dotenv";

// variables de entorno
dotenv.config();

export default {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  ClientIdGithub: process.env.ClientIDGithub,
  ClientSecretGithub: process.env.ClientSecretGithub,
  CallbackGithub: process.env.CallbackGithub,
};
