import TicketDTO from "../dao/DTOs/ticket.dto.js";

export default class ticketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async (limit, page, query, sort) => {
    console.log({ limit, page, query, sort });
    return await this.dao.getAll({ limit, page, query, sort });
  };

  getById = async (id) => {
    return await this.dao.getById(id);
  };

  add = async (ticket) => {
    const newticket = new TicketDTO(ticket);
    return this.dao.add(newticket);
  };
  update = async (id, ticketData) => {
    const updateticket = new TicketDTO(ticketData);
    return await this.dao.update(id, updateticket);
  };

  delet = async (id) => {
    return await this.dao.delete(id);
  };
}
