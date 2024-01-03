// routing untuk akses bersifat publik, seperti daftar dan login
import express from "express";
import adminController from "../controller/admin-controller.js";
import employeeController from "../controller/employee-controller.js";

const publicRoute = new express.Router();
publicRoute.post("/admin/login", adminController.login);
publicRoute.post("/admin/regist", adminController.regist);
publicRoute.post("/employee/login", employeeController.login);
publicRoute.post("/admin/resetpassword", adminController.reset);
publicRoute.post("/employee/resetpassword", employeeController.reset);
publicRoute.put("/shot/generate", adminController.generateShot);
export { publicRoute };
