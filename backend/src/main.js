import { logger } from "./app/logging.js";
import { web } from "./app/web.js";

web.listen(3000, () => {
  logger.info("App is listening on port 3000...");
});
