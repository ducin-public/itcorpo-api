import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { Department, Geo, Office, OfficeAmenity } from '../contract-types/data-contracts';
import { logger } from './logger';
import { FILES } from './files';
import { measureTime } from './perf';

export interface DbSchema {
    departments: Department[];
    geo: Geo;
    officeAmenities: OfficeAmenity[];
    offices: Office[];
}

class FileDb<T extends object> {
    data: T;

    constructor(private config: {
        path: string;
        requiredCollections: readonly (keyof T)[];
    }) {
        this.data = {} as T;
    }

    private validateData(data: unknown): asserts data is T {
        if (!data || typeof data !== 'object') {
            throw new Error('Database content must be an object');
        }

        for (const collection of this.config.requiredCollections) {
            if (!Array.isArray((data as any)[collection])) {
                throw new Error(
                    `Database must contain collection "${String(collection)}" as an array`
                );
            }
        }
    }

    async read() {
        try {
            const content = await measureTime(() => readFile(this.config.path, 'utf-8'), 'db-read');
            const parsed = JSON.parse(content);
            this.validateData(parsed);
            this.data = parsed;
            logger.debug(`Database loaded`);
        } catch (error) {
            logger.error('Failed to initialize database:', error);
            process.exit(1);
        }
    }

    async write() {
        try {
            await measureTime(() => writeFile(
                this.config.path, 
                JSON.stringify(this.data, null, 2), 
                'utf-8'
            ), 'db-write');
            logger.debug(`Database overwritten`);
        } catch (error) {
            logger.error('Failed to write to database:', error);
            process.exit(1);
        }
    }
}

export const db = new FileDb<DbSchema>({
    path: FILES.DATABASE_FILE,
    requiredCollections: ['departments', 'offices', 'officeAmenities'] as const
});

export async function initDb() {
    await db.read();
    return db
}