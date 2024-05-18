import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema({
  purchase_datetime: {},
  amount: {
    type: String,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const TicketModel = mongoose.model(collection, schema);

export default TicketModel;
