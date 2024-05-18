import mongoose from "mongoose";
import config from "../config.js";

const DB_URL = config.DB_URL;

export let Products;
export let Carts;
export let Users;
export let Message;
export let Auth;

switch (config.persistence) {
  case "MONGO":
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(DB_URL);
        console.log("conexion a la MONGODB");
      } catch (error) {
        console.error("No se pudo conectar a la BD", error);
        process.exit();
      }
    };

    connectMongoDB();

    const { default: ProductsMongo } = await import("./mongo/productMMongo.js");
    Products = ProductsMongo;

    const { default: CartsMongo } = await import("./mongo/cartMMongo.js");
    Carts = CartsMongo;

    const { default: UsersMongo } = await import("./mongo/userMMongo.js");
    Users = UsersMongo;

    const { default: MessageMongo } = await import(
      "./mongo/messagesMManager.js"
    );
    Message = MessageMongo;

    const { default: AuthMongo } = await import("./mongo/authMannager.js");
    Auth = AuthMongo;
    break;

  case "FS":
    const { default: ProductsFS } = await import("./fs/productManager.js");
    Products = ProductsFS;

    const { default: CartsFS } = await import("./fs/cartManagerFS.js");
    Carts = CartsFS;

    const { default: UsersFS } = await import("./fs/userMMongo.js");
    Users = UsersFS;

    const { default: MessageFS } = await import("./fs/messagesMManager.js");
    Message = MessageFS;

    const { default: AuthFS } = await import("./fs/authMannager.js");
    Auth = AuthFS;
    break;

  default:
    break;
}
