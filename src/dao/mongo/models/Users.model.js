import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const collection = "Users";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    index: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  rol: {
    type: String,
    default: "User",
  },
  cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  documents: [
    {
      name: {
        type: String,
        required: true,
      },
      reference: {
        type: String,
        required: true,
      },
    },
  ],
  last_connection: {
    type: Date,
  },
});

// Aplica el plugin de paginación
schema.plugin(mongoosePaginate);

const userModel = mongoose.model(collection, schema);

export default userModel;
