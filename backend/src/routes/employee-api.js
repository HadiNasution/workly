import express from "express";
import employeeController from "../controller/employee-controller.js";
import { employeeAuthMiddleware } from "../middleware/employee-auth-middleware.js";

const employeeRoute = new express.Router();
employeeRoute.use(employeeAuthMiddleware); // auth middleware

employeeRoute.delete("/employee/logout", employeeController.logout);

export { employeeRoute };
