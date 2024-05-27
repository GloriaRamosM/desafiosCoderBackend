import { Router } from "express";
import { generateProduct } from "../utils.js";

const fakerRouter = Router();

fakerRouter.get("/mockingproducts", (req, res) => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }

  res.send({ status: "sucess", payload: products });
});

export default fakerRouter;
