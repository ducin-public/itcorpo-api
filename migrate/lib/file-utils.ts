import fs from 'fs';

import { DbSchema } from '../../lib/db/db-schema';
import { logger } from '../../lib/logger';

export function readDatabaseFile(filePath: string): DbSchema {
    try {
        logger.info(`Reading database from ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data: DbSchema = JSON.parse(content);
        logger.info(`Database contains following keys: ${Object.keys(data).map(name => `\n- ${name}`).join('')}`);
        return data;
    } catch (error) {
        logger.error('Failed to read database:', (error as Error).message);
        throw error;
    }
}

export function writeDatabaseFile(filePath: string, data: DbSchema): void {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        logger.info('Database write completed successfully');
    } catch (error) {
        logger.error('Failed to write database:', (error as Error).message);
        throw error;
    }
}
