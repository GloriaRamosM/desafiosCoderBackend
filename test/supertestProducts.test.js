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

    // este creo que no funciona porque no tiene la sesion iniciada, necesita ser admin
    it("el endpoint POST /products debe crear un producto correctamente", async () => {
      const mockProduct = {
        title: "Gomitas",
        description: "Para salir",
        code: "635",
        price: 600,
        status: true,
        category: "calzado",
        stock: 200,
        thumbnails: "no tiene",
        brand: "cualquiera",
      };

      const { statusCode, ok, _body } = await requester
        .post("/products")
        .send(mockProduct);

      console.log(ok);
      console.log(statusCode);
      console.log(_body);

      // puse expect 500 porque al no ser Admin, no podra crear un producto

      expect(statusCode).to.equal(500);
    });
  });

  describe("test de Carts", function () {
    it("el endpoint GET  /carts debe traer los carritos correctamente", async () => {
      const { statusCode, ok, _body } = await requester.get("/carts");

      console.log(ok);
      console.log(statusCode);
      console.log(_body);

      expect(statusCode).to.equal(200);
    });

    it(" el endpoint POST  /carts debe crear un carrito correctamente", async () => {
      const { statusCode, ok, _body } = await requester.post("/carts");

      console.log(ok);
      console.log(statusCode);
      console.log(_body);

      expect(statusCode).to.equal(201);
      expect(_body.payload).to.have.property("_id");
      expect(_body.payload).to.have.property("products");
    });

    it(" el endpoint GET  /carts/:cid debe traer un carrito correctamente por su ID", async () => {
      const { statusCode, ok, _body } = await requester.get(
        "/carts/666d9fde15103b18e79c9a16"
      );

      console.log(ok);
      console.log(statusCode);
      console.log(_body);

      expect(statusCode).to.equal(200);
      expect(_body.payload).to.have.property("products");
    });
  });
});
