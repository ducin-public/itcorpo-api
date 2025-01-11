import { cliConfig } from "../lib/config";
import { logger } from "../lib/logger";
import { createServer } from "../server/server";

const app = createServer();

const URL = `http://localhost:${cliConfig.port}`
app.listen(cliConfig.port, () => {
  logger.info(`JSON Server is running on ${URL}`);
});
