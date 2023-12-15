import express from "express";
import employeeController from "../controller/employee-controller.js";
import { employeeAuthMiddleware } from "../middleware/employee-auth-middleware.js";
import multer from "multer";
import { storage, fileFilter } from "../middleware/multer-validation.js";

const upload = multer({ storage, fileFilter });
const employeeRoute = new express.Router();
employeeRoute.use(employeeAuthMiddleware); // auth middleware

employeeRoute.delete("/logout", employeeController.logout);
employeeRoute.get("/profile", employeeController.detail);
employeeRoute.put("/absenIn", employeeController.absenIn);
employeeRoute.put("/absenOut", employeeController.absenOut);
employeeRoute.post(
  "/upload",
  upload.single("profile"),
  employeeController.upload
);

export { employeeRoute };
