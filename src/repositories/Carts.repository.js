export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async (limit) => {
    return await this.dao.getAll(limit);
  };

  getById = async (id) => {
    return await this.dao.getById(id);
  };

  create = async () => {
    return await this.dao.create({});
  };

  add = async (cid, pid, quantity) => {
    return await this.dao.add(cid, pid, quantity);
  };

  update = async (cid, pid, quantity) => {
    return await this.dao.update(cid, pid, quantity);
  };

  delete = async (id, pid) => {
    return await this.dao.delete(id, pid);
  };

  updateProductsInCart = async (cid, pid, quantity) => {
    return await this.dao.updateProductsInCart(cid, pid, quantity);
  };

  deleteAll = async (cid) => {
    return await this.dao.deleteAll(cid);
  };
}
