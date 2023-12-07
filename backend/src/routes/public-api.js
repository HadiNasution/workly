// routing untuk akses bersifat publik, seperti daftar dan login
import express from "express";
import adminController from "../controller/admin-controller.js";

const publicRoute = new express.Router();
publicRoute.post("/api/admin/login", adminController.loginController);

export { publicRoute };
