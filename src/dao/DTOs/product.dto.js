export default class ProductDTO {
  constructor(product) {
    this.title = product.title;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price;
    this.status = product.status;
    this.category = product.category;
    this.stock = product.stock;
    this.thumbnails = product.thumbnails;
    this.owner = product.owner;
    this.brand = product.brand;
  }
}
