import ticketsModel from "../mongo/models/ticket.model.js";
import { Logger } from "../../middlewares/logger.js";

export default class ticketManager {
  constructor() {
    Logger.info("Trabajando con ticketManager");
  }

  getAll = async ({ limit = 10, page = 1, query, sort }) => {
    let options = { limit: limit, page, lean: true };
    if (sort !== undefined && !isNaN(parseInt(sort))) {
      options.sort = { price: parseInt(sort) };
    }
    const queryParams = query ? JSON.parse(query) : {};

    let {
      docs,
      totalPages,
      page: actualPage,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
    } = await ticketsModel.paginate(queryParams, options);

    //const queryString = JSON.stringify(queryParams);

    const prevLink = hasPrevPage
      ? `http://localhost:8080/api/tickets?limit=${limit}&page=${prevPage}`
      : null;

    const nextLink = hasNextPage
      ? `http://localhost:8080/api/tickets?limit=${limit}&page=${nextPage}`
      : null;

    return {
      payload: docs,
      totalPages,
      page: actualPage,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };
  };

  getById = async (id) => {
    let result = await ticketsModel.findById(id);
    return result;
  };

  add = async (ticket) => {
    const existingticket = await ticketsModel.findOne({ code: ticket.code });
    if (existingticket) {
      return { message: "Ya existe un ticketo con este código." };
    } else {
      let result = await ticketsModel.create(ticket);
      return result;
    }
  };

  update = async (id, ticketData) => {
    try {
      let result = await ticketsModel.updateOne(
        { _id: id },
        { $set: ticketData }
      );

      if (result.nModified === 0) {
        res.json("No se encontró ningún ticketo para actualizar.");
      }

      return { message: "ticketo actualizado correctamente." };
    } catch (error) {
      return { error: error.message };
    }
  };

  delete = async (id) => {
    let result = await ticketsModel.deleteOne({ _id: id });
    return result;
  };
}
