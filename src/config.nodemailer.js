import nodemailer from "nodemailer";

//configuracion nodemailer

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  port: 587,
  auth: {
    user: process.env.USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export default transport;
