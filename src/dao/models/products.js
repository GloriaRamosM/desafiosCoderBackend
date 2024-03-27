import mongoose from "mongoose";
import mongoosepaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const collection = "Products";

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  thumbnails: {
    type: [String],
    required: true,
  },
  brand: {
    type: [String],
    required: true,
  },
});

schema.plugin(mongoosepaginate);
const productsModel = mongoose.model(collection, schema);

export default productsModel;
