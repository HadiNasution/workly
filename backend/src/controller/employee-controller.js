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

const detail = async (req, res, next) => {
  try {
    const nip = req.employee.nip;
    const result = await employeeService.detail(nip);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const absenIn = async (req, res, next) => {
  try {
    const employee = req.employee;
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;
    const wfh = req.params.wfh;
    await employeeService.absenIn(latitude, longitude, wfh, employee);
    res.status(201).json({ data: "Absen masuk berhasil" });
  } catch (error) {
    next(error);
  }
};

const absenOut = async (req, res, next) => {
  try {
    const employee = req.employee;
    const latitude = req.params.latitude;
    const longitude = req.params.longitude;
    await employeeService.absenOut(latitude, longitude, employee);
    res.status(200).json({ data: "Absen keluar berhasil" });
  } catch (error) {
    next(error);
  }
};

const upload = async (req, res, next) => {
  try {
    const employee = req.employee;
    const filePath = req.file.path;
    const result = await employeeService.upload(filePath, employee);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const createPermission = async (req, res, next) => {
  try {
    const request = req.body;
    const employee = req.employee;
    const filePath = req.file.path;
    await employeeService.createPermission(request, employee, filePath);
    res.status(201).json({ data: "Pengajuan berhasil" });
  } catch (error) {
    next(error);
  }
};

const getPermission = async (req, res, next) => {
  try {
    const employee = req.employee;
    const result = await employeeService.getPermission(employee);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getAttendanceRecapByDay = async (req, res, next) => {
  try {
    const employee = req.employee;
    const result = await employeeService.getAttendanceRecapByDay(employee);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getAttendanceRecapByMonth = async (req, res, next) => {
  try {
    const employee = req.employee;
    const year = req.query.year;
    const month = req.query.month;
    const result = await employeeService.getAttendanceRecapByMonth(
      employee,
      year,
      month
    );
    console.log(result);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  logout,
  reset,
  detail,
  absenIn,
  absenOut,
  upload,
  createPermission,
  getPermission,
  getAttendanceRecapByDay,
  getAttendanceRecapByMonth,
};
