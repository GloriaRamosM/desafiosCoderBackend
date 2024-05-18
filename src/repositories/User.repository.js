import UserDTO from "../dao/DTOs/user.dto.js";
//import AuthManager from "../dao/mongo/authMannager.js";

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
    return await this.dao.update(id, updateUser);
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

  //   login = async (email, password) => {
  //     const user = await AuthManager.login({ email, password });
  //     return await this.dao.login(user);
  //   };
  // }
}
