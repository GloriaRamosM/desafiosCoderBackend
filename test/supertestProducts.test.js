import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080/api");

describe("Testing Api Coder", () => {
  //products
  describe("test de products", function () {
    it(" el endpoint Get /products debe traer los productos correctamente", async () => {
      const { statusCode, ok, _body } = await requester.get("/products");

      console.log(ok);
      console.log(statusCode);
      console.log(_body);

      expect(statusCode).to.equal(200);
    });

    // it("el endpoint Get /products/:pid debe traer el producto correctamente" , async() =>{
    //     const
    // })
    // // este creo que no funciona porque no tiene la sesion iniciada, necesita ser admin
    // it("el endpoint POST /products debe crear un producto correctamente", async () => {
    //   const mockProduct = {
    //     title: "Gomitas",
    //     description: "Para salir",
    //     code: "635",
    //     price: 600,
    //     status: true,
    //     category: "calzado",
    //     stock: 200,
    //     thumbnails: "no tiene",
    //     brand: "cualquiera",
    //   };

    //   const { statusCode, ok, _body } = await requester
    //     .post("/products")
    //     .send(mockProduct);

    //   console.log(ok);
    //   console.log(statusCode);
    //   console.log(_body);

    //   expect(statusCode).to.equal(200);
    // });
  });
});
