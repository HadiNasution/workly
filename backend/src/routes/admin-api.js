// routing untuk akses bersifat publik, seperti daftar
import express from "express";
import adminController from "../controller/admin-controller.js";
import { adminAuthMiddleware } from "../middleware/admin-auth-middleware.js";

const adminRoute = new express.Router();
adminRoute.use(adminAuthMiddleware); // auth middleware

adminRoute.delete("/admin/logout", adminController.logout);

export { adminRoute };
