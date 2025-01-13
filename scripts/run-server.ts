import { cliConfig } from "../lib/config";
import { FILES } from "../lib/files";
import { logger } from "../lib/logger";
import { createServer } from "../server/server";

const routesRewrite = require(FILES.ROUTES_FILE)
const { tenantRequired, contractValidation, port, delay, ...rest } = cliConfig

const app = createServer({
    ...rest,
    routesRewrite,
    delay,
    middlewares: {
        CONTRACT_VALIDATION: contractValidation,
        LOGGER: true,
        TENANT: tenantRequired
    }
});

const URL = `http://localhost:${cliConfig.port}`
app.listen(cliConfig.port, () => {
  logger.info(`JSON Server is running on ${URL}`);
});
