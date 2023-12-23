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
    const adminName = req.admin.name;
    await adminService.update(employee, adminId);
    res.status(200).json({ data: `Data ${adminName} berhasil di update` });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const adminId = req.params.adminId;
    const adminName = req.admin.name;
    await adminService.deleteAdmin(adminId);
    res.status(200).json({ data: `Admin ${adminName} berhasil dihapus` });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const admin = req.admin;
    const employee = req.body;
    const result = await adminService.createEmployee(employee, admin);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const result = await adminService.getEmployee();
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const nip = req.body.nip;
    await adminService.updateEmployee(req.body);
    res.status(201).json({ data: `Data ${nip} sudah di update` });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { employeeNip } = req.params;
    await adminService.deleteEmployee(employeeNip);
    res.status(200).json({ data: `Data ${employeeNip} sudah di hapus` });
  } catch (error) {
    next(error);
  }
};

const detailEmployee = async (req, res, next) => {
  try {
    const { employeeNip } = req.params;
    const result = await adminService.detailEmployee(employeeNip);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const attendanceRecapByDay = async (req, res, next) => {
  try {
    const result = await adminService.attendanceRecapByDay();
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const attendanceRecapByMonth = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const result = await adminService.attendanceRecapByMonth(year, month);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const searchEmployee = async (req, res, next) => {
  try {
    const request = {
      name: req.query.name,
      nip: req.query.nip,
      email: req.query.email,
      page: req.query.page,
      size: req.query.size,
    };
    const result = await adminService.searchEmployee(request);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const getPermission = async (req, res, next) => {
  try {
    const result = await adminService.getPermission();
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const approvePermission = async (req, res, next) => {
  try {
    const id = req.params.permissionId;
    const admin = req.admin;
    const result = await adminService.approvePermission(id, admin);
    if (result) {
      res.status(201).json({ data: "Approved" });
    } else {
      res.status(400).json({ data: "Gagal approve" });
    }
  } catch (error) {
    next(error);
  }
};

const rejectPermission = async (req, res, next) => {
  try {
    const id = req.params.permissionId;
    const admin = req.admin;
    await adminService.rejectPermission(id, admin);
    res.status(201).json({ data: "Rejected" });
  } catch (error) {
    next(error);
  }
};

const log = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const result = await adminService.log(year, month);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  regist,
  logout,
  reset,
  get,
  update,
  deleteAdmin,
  create,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  detailEmployee,
  attendanceRecapByDay,
  attendanceRecapByMonth,
  searchEmployee,
  getPermission,
  approvePermission,
  rejectPermission,
  log,
};
