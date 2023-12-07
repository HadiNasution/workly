import adminService from "../services/admin-service.js";

const loginController = async (req, res, next) => {
  try {
    const result = await adminService.login(req.body);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error); // teruskan error ke middleware
  }
};

const registController = async (req, res, next) => {
  try {
    const result = await adminService.regist(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { loginController, registController };
