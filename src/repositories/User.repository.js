import UserDTO from "../dao/DTOs/user.dto.js";

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async () => {
    return await this.dao.getAll();
  };

  getById = async (id) => {
    return await this.dao.getById(id);
  };

  createUser = async (userData) => {
    const newUser = new UserDTO(userData);
    return await this.dao.createUser(newUser);
  };

  updateUser = async (id, userData) => {
    const updateUser = new UserDTO(userData);
    return await this.dao.updateUser(id, updateUser);
  };

  delete = async (id) => {
    return await this.dao.delete(id);
  };

  getAllUsersWithCart = async () => {
    return await this.dao.getAllUsersWithCart();
  };

  getPaginatedUsers = async (page = 1, limit = 10) => {
    return await this.dao.getPaginatedUsers(page, limit);
  };
}
