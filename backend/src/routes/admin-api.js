// routing untuk akses bersifat publik, seperti daftar
import express from "express";
import adminController from "../controller/admin-controller.js";
import { adminAuthMiddleware } from "../middleware/admin-auth-middleware.js";

const adminRoute = new express.Router();
adminRoute.use(adminAuthMiddleware); // auth middleware

adminRoute.delete("/admin/logout", adminController.logout);
adminRoute.get("/admin", adminController.get);
adminRoute.put("/admin/update/:adminId", adminController.update);
adminRoute.post("/admin/create/employee", adminController.create);

export { adminRoute };
