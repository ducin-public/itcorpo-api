import fs from 'fs';
import { DatabaseContent } from './migration-types';
import { logger } from '../lib/logger';

export function readDatabaseFile(filePath: string): DatabaseContent {
    try {
        logger.info(`Reading database from ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data: DatabaseContent = JSON.parse(content);
        logger.info(`Database contains following keys: ${Object.keys(data).map(name => `\n- ${name}`).join('')}`);
        return data;
    } catch (error) {
        logger.error('Failed to read database:', (error as Error).message);
        throw error;
    }
}

export function writeDatabaseFile(filePath: string, data: DatabaseContent): void {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        logger.info('Database write completed successfully');
    } catch (error) {
        logger.error('Failed to write database:', (error as Error).message);
        throw error;
    }
}
