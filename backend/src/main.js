// import { prismaClient } from "./app/database.js";
import { logger } from "./app/logging.js";
import { web } from "./app/web.js";

const port = 3000;
web.listen(port, async () => {
  logger.info(`App is listening on port ${port}...`);
});
