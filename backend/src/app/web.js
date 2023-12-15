import express from "express";
import cors from "cors";
import { publicRoute } from "../routes/public-api.js";
import { adminRoute } from "../routes/admin-api.js";
import { employeeRoute } from "../routes/employee-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const web = express();

web.use(express.json()); // body parser + url-encoded
web.use(cors()); // implementasi CORS
web.use("/uploads", express.static("./uploads"));

// ADMIN
web.use("/api", publicRoute);
web.use("/api/admin", adminRoute);
web.use("/api/employee", employeeRoute);

web.use("/", (req, res) => {
  res.status(404).json({ data: "Endpoint does not exist" });
});
web.use(errorMiddleware); // error handli middleware
