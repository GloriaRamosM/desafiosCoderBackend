// import productsModel from "../models/products";

// export default class Products {
//   constructor() {
//     console.log("");
//   }

//   //metodos

//   get = async () => {
//     const products = await productsModel.find();
//     return products;
//   };

//   getAll = async ({ limit = 10, page = 1, query, sort }) => {
//     let options = { limit: limit, page, lean: true };
//     if (sort !== undefined && !isNaN(parseInt(sort))) {
//       options.sort = { price: parseInt(sort) };
//     }
//     const queryParams = query ? JSON.parse(query) : {};

//     let {
//       docs,
//       totalPages,
//       page: actualPage,
//       prevPage,
//       nextPage,
//       hasPrevPage,
//       hasNextPage,
//     } = await productsModel.paginate(queryParams, options);

//     //const queryString = JSON.stringify(queryParams);

//     const prevLink = hasPrevPage
//       ? `http://localhost:8080/api/products?limit=${limit}&page=${prevPage}`
//       : null;

//     const nextLink = hasNextPage
//       ? `http://localhost:8080/api/products?limit=${limit}&page=${nextPage}`
//       : null;

//     return {
//       payload: docs,
//       totalPages,
//       page: actualPage,
//       prevPage,
//       nextPage,
//       hasPrevPage,
//       hasNextPage,
//       prevLink,
//       nextLink,
//     };
//   };
// }
