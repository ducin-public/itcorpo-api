import path from "path";
import fs from "fs";
import { logger } from "./logger";

const ROOT_DIR = path.join(__dirname, '../');

export const FILES = {
    DATABASE_FILE: path.join(ROOT_DIR, 'db.json'),
    SWAGGER_FILE: path.join(ROOT_DIR, 'contract/swagger.yml'),
    APP_CONFIG_FILE: path.join(ROOT_DIR, 'config.json')
} as const;

Object.entries(FILES).forEach(([key, filepath]) => {
    if (!fs.existsSync(filepath)) {
        logger.error(`Required ${key} file not found: ${filepath}`);
        process.exit(1);
    }
});
logger.info(`All required files found:\n${Object.entries(FILES).map(([key, filepath]) => `- ${key}: ${filepath}`).join('\n')}`);
