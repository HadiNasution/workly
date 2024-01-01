// routing untuk akses bersifat publik, seperti daftar
import express from "express";
import adminController from "../controller/admin-controller.js";
import { adminAuthMiddleware } from "../middleware/admin-auth-middleware.js";

const adminRoute = new express.Router();
adminRoute.use(adminAuthMiddleware); // auth middleware

adminRoute.delete("/logout", adminController.logout);
adminRoute.get("/get/admin", adminController.getAdmin);
adminRoute.get("/get/admin/:adminId", adminController.getAdminById);
adminRoute.post("/create/admin", adminController.regist);
adminRoute.post("/update/admin", adminController.update);
adminRoute.delete("/delete/admin/:adminNip", adminController.deleteAdmin);
adminRoute.post("/create/employee", adminController.create);
adminRoute.get("/get/employee", adminController.getEmployee);
adminRoute.get("/get/employee/:employeeId", adminController.getEmployeeById);
adminRoute.post("/update/employee", adminController.updateEmployee);
adminRoute.delete(
  "/delete/employee/:employeeNip",
  adminController.deleteEmployee
);
adminRoute.get("/recap/day", adminController.attendanceRecapByDay);
adminRoute.get("/recap/month", adminController.attendanceRecapByMonth);
adminRoute.get("/search", adminController.searchEmployee);
adminRoute.get("/permission", adminController.getPermission);
adminRoute.put("/permission/:permissionId", adminController.approvePermission);
adminRoute.put(
  "/permission/reject/:permissionId",
  adminController.rejectPermission
);
adminRoute.get("/log", adminController.log);
adminRoute.get("/setting", adminController.getSetting);
adminRoute.post("/setting", adminController.updateSetting);

export { adminRoute };
