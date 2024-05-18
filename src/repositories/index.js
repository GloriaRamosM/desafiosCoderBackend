import ProductManager from "../dao/mongo/productMMongo.js";
import ProductRepository from "./Product.repository.js";
import UserManager from "../dao/mongo/userMMongo.js";
import UserRepository from "./User.repository.js";
import CartManager from "../dao/mongo/cartMMongo.js";
import CartsRepository from "./Carts.repository.js";

export const ProductsService = new ProductRepository(new ProductManager());
export const UsersService = new UserRepository(new UserManager());
export const CartsServicie = new CartsRepository(new CartManager());
