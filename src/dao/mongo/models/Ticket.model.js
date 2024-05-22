import mongoose from "mongoose";

const collection = "Tickets";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    // purchase_datetime: {
    //   type: String,
    //   required: true,
    // },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
  },
  { timestamps: { purchase_datetime: "created_at" } }
);

const TicketModel = mongoose.model(collection, schema);

export default TicketModel;
