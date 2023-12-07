import express from "express";
import { publicRoute } from "../routes/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();

web.use(express.json()); // body parser + url-encoded

// API ADMIN
web.use(publicRoute);

web.use(errorMiddleware); // handle error
