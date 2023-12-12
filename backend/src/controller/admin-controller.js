import adminService from "../services/admin-service.js";

const login = async (req, res, next) => {
  try {
    const result = await adminService.login(req.body);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error); // teruskan error ke middleware
  }
};

const regist = async (req, res, next) => {
  try {
    const result = await adminService.regist(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await adminService.logout(req.admin.email);
    res.status(200).json({ data: "Logout Berhasil" });
  } catch (error) {
    next(error);
  }
};

const reset = async (req, res, next) => {
  try {
    const result = await adminService.reset(req.body);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await adminService.get();
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const adminId = req.params.adminId;
    const employee = req.body;
    await adminService.update(employee, adminId);
    res.status(200).json({ data: "Data berhasil di update" });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const admin = req.admin;
    const employee = req.body;
    const result = await adminService.create(employee, admin);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { login, regist, logout, reset, get, update, create };
