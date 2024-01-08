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
employeeRoute.put("/change/password", employeeController.changePassword);
employeeRoute.get(
  "/absenIn/:latitude/:longitude/:wfh",
  employeeController.absenIn
);
employeeRoute.get(
  "/absenOut/:latitude/:longitude",
  employeeController.absenOut
);
employeeRoute.post(
  "/upload",
  upload.single("profile"),
  employeeController.upload
);
employeeRoute.post(
  "/create/permission",
  upload.single("surat"),
  employeeController.createPermission
);
employeeRoute.get("/permission", employeeController.getPermission);
employeeRoute.get("/attendance/day", employeeController.getAttendanceByDay);
employeeRoute.get("/attendance/month", employeeController.getAttendanceByMonth);
employeeRoute.get("/setting", employeeController.getSetting);
employeeRoute.get("/recap", employeeController.getRecap);
employeeRoute.get("/shot", employeeController.getShot);

export { employeeRoute };
