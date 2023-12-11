import employeeService from "../services/employee-service.js";

const login = async (req, res, next) => {
  try {
    const result = await employeeService.login(req.body);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await employeeService.logout(req.employee.email);
    res.status(200).json({ data: "Logout Berhasil" });
  } catch (error) {
    next(error);
  }
};

const reset = async (req, res, next) => {
  try {
    const result = await employeeService.reset(req.body);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default { login, logout, reset };
