import express from "express";
import cors from "cors";
import { publicRoute } from "../routes/public-api.js";
import { adminRoute } from "../routes/admin-api.js";
import { employeeRoute } from "../routes/employee-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://8v1mp609-5173.asse.devtunnels.ms",
];
web.use(express.json()); // body parser + url-encoded
web.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
  })
);
web.use("/uploads", express.static("./uploads"));
web.use("/api", publicRoute);
web.use("/api/admin", adminRoute);
web.use("/api/employee", employeeRoute);

web.use("/", (req, res) => {
  res.status(404).json({ data: "Endpoint does not exist" });
});
web.use(errorMiddleware); // error handli middleware
