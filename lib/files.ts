import path from "path";
import fs from "fs";
import { logger } from "./logger";

const ROOT_DIR = path.join(__dirname, '../');

export const FILES = {
    CONTRACT_FILE: path.join(ROOT_DIR, 'contract/openapi.yml'),
    APP_CONFIG_FILE: path.join(ROOT_DIR, 'config.json'),
    ROUTES_FILE: path.join(ROOT_DIR, 'routes.json'),
    MAINTENANCE_FILE: path.join(ROOT_DIR, '.MAINTENANCE')
} as const;

export const DB_FILE = (collection: string) => path.join(ROOT_DIR, `database/${collection}.json`);

Object.entries(FILES).forEach(([key, filepath]) => {
    if (!fs.existsSync(filepath)) {
        logger.error(`Required ${key} file not found: ${filepath}`);
        process.exit(1);
    }
});
logger.info(`All required files found:\n${Object.entries(FILES).map(([key, filepath]) => `- ${key}: ${filepath}`).join('\n')}`);
