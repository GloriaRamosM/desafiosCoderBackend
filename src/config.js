import dotenv from "dotenv";

// variables de entorno
dotenv.config();

export default {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  ClientIdGithub: process.env.ClientIDGithub,
  ClientSecretGithub: process.env.ClientSecretGithub,
  CallbackGithub: process.env.CallbackGithub,
  persistence: process.env.PERSISTENCE,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
};
