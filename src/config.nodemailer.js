import nodemailer from "nodemailer";
import config from "./config.js";

//configuracion nodemailer

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  port: 587,
  auth: {
    user: config.MAIL_USERNAME,
    pass: config.MAIL_PASSWORD,
  },
});

export default transport;
