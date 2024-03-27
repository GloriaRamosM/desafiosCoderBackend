// import mongoose from "mongoose";
// const { Schema } = mongoose;

// const collection = "Carts";

// const schema = new Schema({
//   products: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "products",
//       },
//       quantity: {
//         type: Number,
//         require: true,
//       },
//     },
//   ],
// });

// const cartsModel = mongoose.model(collection, schema);

// export default cartsModel;

import mongoose from "mongoose";

const { Schema } = mongoose;

const collection = "Carts";

const schema = new Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products", // Aquí debes usar el nombre del modelo de productos
      },
      quantity: {
        type: Number,
        required: true, // "require" debe ser "required"
      },
    },
  ],
});

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;
