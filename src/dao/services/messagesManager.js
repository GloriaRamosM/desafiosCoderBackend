import messagesModel from "../models/messagess.js";

const messageManager = {
  getMessages: async (req, res) => {
    try {
      const messages = await messagesModel.find().lean();

      if (req.accepts("html")) {
        return res.render("chat", { messages });
      }
      res.json(messages);
    } catch (err) {
      console.error("Error:", err);
      return res
        .status(500)
        .json({ error: "Error en la base de datos", details: err.message });
    }
  },

  addMessage: async (req, res) => {
    const { user, text } = req.body;

    try {
      const newMessage = new Message({
        user,
        text,
      });

      await newMessage.save();

      return res.json({
        message: "Mensaje agregado",
        Message: newMessage,
      });
    } catch (err) {
      console.error("Error al guardar el mensaje:", err);
      return res
        .status(500)
        .json({ error: "Error en la base de datos", details: err.message });
    }
  },
};

export default messageManager;
