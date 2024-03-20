import express from "express";
import messagesManager from "../dao/services/messagesManager.js";

const messageRouter = express.Router();

// Maneja la solicitud para obtener los mensajes en tiempo real
messageRouter.get("/", messagesManager.getMessages);

// Maneja la solicitud para agregar mensajes en tiempo real
messageRouter.post("/addMessage", messagesManager.addMessage);

export default messageRouter;
