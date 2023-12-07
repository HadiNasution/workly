// routing untuk akses bersifat publik, seperti daftar
import express from "express";
import adminController from "../../controller/admin-controller.js";
import { adminAuthMiddleware } from "../../middleware/admin-auth-middleware.js";

const adminRouter = new express.Router();
adminRouter.use(adminAuthMiddleware);

adminRouter.delete("/api/admin/logout", adminController.logout);

export { adminRouter };
