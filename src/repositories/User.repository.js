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

  deleteUser = async (id) => {
    return await this.dao.deleteUser(id);
  };

  getAllUsersWithCart = async () => {
    return await this.dao.getAllUsersWithCart();
  };

  getPaginatedUsers = async (page = 1, limit = 10) => {
    return await this.dao.getPaginatedUsers(page, limit);
  };

  getBy = async (query) => {
    return await this.dao.getBy(query);
  };

  updatePassword = async (userId, newPassword) => {
    return await this.dao.updatePassword(userId, newPassword);
  };

  uploadDocuments = async (userId, newPassword) => {
    return await this.dao.uploadDocuments(userId, newPassword);
  };

  getDatosUsers = async () => {
    return await this.dao.getDatosUsers;
  };

  deleteInactiveUsers = async (date) => {
    return await this.dao.deleteInactiveUsers(date);
  };

  getInactiveUsers = async (date) => {
    return await this.dao.getInactiveUsers(date);
  };
}
