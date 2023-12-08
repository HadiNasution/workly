import express from "express";
import { publicRoute } from "../routes/public-api.js";
import { adminRoute } from "../routes/admin-api.js";
import { employeeRoute } from "../routes/employee-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();

web.use(express.json()); // body parser + url-encoded

// ADMIN
web.use(publicRoute);
web.use(adminRoute);
web.use(employeeRoute);

web.use(errorMiddleware); // handle error
