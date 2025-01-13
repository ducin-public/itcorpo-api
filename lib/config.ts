import { z } from 'zod';

import { logger } from '../lib/logger';
import { FILES } from './files';
import { argv } from './cli';

const { port, delayRange, fail, failUrls, jwtAuth, tenantRequired, contractValidation } = argv;
export const cliConfig = {
  port, jwtAuth, tenantRequired, contractValidation,
  chaos: fail ? {
    probability: fail,
    urls: failUrls == "ALL" ? "ALL" as const : failUrls!.split(',')
  } : false as const,
  delay: !delayRange? false as const : delayRange.split('-').map(n => parseInt(n)) as [number, number]
};

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
