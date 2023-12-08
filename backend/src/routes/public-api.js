// routing untuk akses bersifat publik, seperti daftar dan login
import express from "express";
import adminController from "../controller/admin-controller.js";
import employeeController from "../controller/employee-controller.js";

const publicRoute = new express.Router();
publicRoute.post("/api/admin/login", adminController.login);
publicRoute.post("/api/admin/regist", adminController.regist);
publicRoute.post("/api/employee/login", employeeController.login);

export { publicRoute };
