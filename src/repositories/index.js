import { Products } from "../dao/factory.js";
import ProductRepository from "./Product.repository.js";

export const ProductsService = new ProductRepository(new Products());
