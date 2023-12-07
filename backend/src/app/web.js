import express from "express";
import { publicRoute } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();

// API ADMIN
web.use(express.json());

web.use(publicRoute);

web.use(errorMiddleware); // handle error
