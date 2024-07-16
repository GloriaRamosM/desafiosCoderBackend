import ProductManager from "../dao/mongo/product.dao.js";
import ProductRepository from "./Product.repository.js";
import UserManager from "../dao/mongo/user.dao.js";
import UserRepository from "./User.repository.js";
import CartManager from "../dao/mongo/cart.dao.js";
import CartsRepository from "./Carts.repository.js";
import ticketRepository from "./ticket.repository.js";
import ticketManager from "../dao/mongo/ticket.dao.js";

export const ProductsService = new ProductRepository(new ProductManager());
export const UsersService = new UserRepository(new UserManager());
export const CartsServicie = new CartsRepository(new CartManager());
export const TicketService = new ticketRepository(new ticketManager());
