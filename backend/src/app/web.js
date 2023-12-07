import express from "express";
import { publicRoute } from "../routes/public-api.js";
import { adminRouter } from "../routes/admin/api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();

web.use(express.json()); // body parser + url-encoded

// ADMIN
web.use(publicRoute);
web.use(adminRouter);

web.use(errorMiddleware); // handle error
