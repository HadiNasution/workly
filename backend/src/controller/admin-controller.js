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
    res.status(200).json({ data: "Logout Success" });
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

export default { login, regist, logout, reset };
