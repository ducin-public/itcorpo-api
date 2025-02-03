import { readFile, writeFile } from 'fs/promises';
import { z } from 'zod';
import { Database } from './db-connection';

import { logger } from '../logger';
import { measureTime } from '../perf';
import { DBError } from './db-error';
import { DB_FILE } from '../files';

export type CollectionConfig<TCollectionItem extends object> = {
    name: string;
    accessMode: "RW" | "R";
    collectionSchema: z.ZodType<TCollectionItem>;
    db: Database;
    __IN_MEMORY__?: TCollectionItem[];
};

export abstract class DBCollection<TCollectionItem extends object> {
    private data: TCollectionItem[] | null = null;

    protected async getAll(): Promise<TCollectionItem[]> {
        if (this.data === null) {
            await this.read();
        }
        if (this.data === null) {
            throw new DBError(`Collection ${this.config.name} is empty even after read, something went very wrong`);
        }
        return this.data;
    }

    constructor(protected config: CollectionConfig<TCollectionItem>) {
        if (config.accessMode === 'R' && !config.__IN_MEMORY__) {
            throw new DBError(`Collection ${config.name} is in read mode but no in-memory data provided`);
        }
    }

    private async getContent(): Promise<TCollectionItem[]> {
        const config = this.config
        if (config.accessMode === 'RW') {
            const content = await measureTime(() => readFile(DB_FILE(config.name), 'utf-8'), 'db-read');
            return JSON.parse(content);
        } else {
            return config.__IN_MEMORY__!;
        }
    }

    protected async read() {
        try {
            const parsed = await this.getContent();
            this.data = parsed;
            logger.debug(`Collection ${this.config.name} loaded`);
        } catch (error) {
            const message = `Failed to read collection ${this.config.name}: ${error}`;
            logger.error(message);
            throw new DBError(message);
        }
    }

    async flush() {
        const config = this.config;
        if (config.accessMode === 'R') {
            const message = `Cannot write to collection ${this.config.name} in read-only mode`;
            logger.error(message);
            throw new DBError(message);
        }

        try {
            await measureTime(() => writeFile(
                DB_FILE(config.name), 
                JSON.stringify(this.data, null, 2), 
                'utf-8'
            ), 'db-write');
            logger.debug(`Collection ${this.config.name} write completed successfully`);
        } catch (error) {
            const message = `Failed to write collection ${this.config.name}: ${error}`;
            logger.error(message);
            throw new DBError(message);
        }
    }

    async close() {
        await this.flush();
    }
}
