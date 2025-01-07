import { z } from 'zod';

import { logger } from '../lib/logger';
import { FILES } from './files';
import { argv } from './cli';

const { port, delay, fail, failUrls, jwtAuth, tenantRequired, contractValidation } = argv;
export const cliConfig = { port, delay, fail, failUrls, jwtAuth, tenantRequired, contractValidation };

const AppConfigSchema = z.object({
  NAME: z.string(),
  SECRET: z.string(),
  OPEN_RESOURCES: z.array(z.string()),
  TENANT_ID_HEADER: z.string()
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

const rawConfig = require(FILES.APP_CONFIG_FILE) as unknown;
const getAppConfig = (): AppConfig => {
  try {
    return AppConfigSchema.parse(rawConfig);
  } catch (error) {
    logger.error('Invalid configuration:', error);
    process.exit(1);
  }
}

export const appConfig = getAppConfig();
