import messagesModel from "../models/messagess.js";

class MessageManager {
  getAll = async () => {
    let result = await messagesModel.find().lean();
    return result;
  };

  addMessage = async (message) => {
    let result = await messagesModel.create(message);
    return result;
  };
}

export default MessageManager;
