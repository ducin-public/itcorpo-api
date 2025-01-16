import { readFile, writeFile } from 'fs/promises';

import { logger } from '../logger';
import { measureTime } from '../perf';
import { ZodSchema } from 'zod';
import { DBError } from './db-error';
import { DB_FILE } from '../files';

// // an object type which accepts `TDatabase extends object` where keys are keys of TDatabase, but filtered: only the ones which values are an array, (2) the array item has an id property; the value of the result type is the type of an id (e.g. { employee: number, project: string, ... })
// type CollectionIdType<TDatabase extends object> = {
//     [K in keyof TDatabase]: TDatabase[K] extends Array<infer TItem> ? TItem extends { id: infer TId } ? TId : never : never;
// };
// // a union of only those keys which have 'number' values
// type OnlyNumbers<TDatabase extends object> = {
//     [K in keyof CollectionIdType<TDatabase>]: CollectionIdType<TDatabase>[K] extends number 
//         ? CollectionIdType<TDatabase>[K] extends never 
//             ? never 
//             : K 
//         : never;
// }[keyof CollectionIdType<TDatabase>];

type DBCollectionConfig = {
    name: string;
    accessMode: "R" | "RW"
    __IN_MEMORY__?: any
    collectionSchema: ZodSchema;
};

export class DBCollection<TCollection extends object> {
    private data: TCollection | null = null;

    protected async getAll(): Promise<TCollection> {
        if (this.data === null) {
            await this.read();
        }
        if (this.data === null) {
            throw new DBError(`Collection ${this.config.name} is empty even after read, something went very wrong`);
        }
        return this.data;
    }

    constructor(protected config: DBCollectionConfig) {
        if (config.accessMode === 'R' && !config.__IN_MEMORY__) {
            throw new DBError(`Collection ${config.name} is in read mode but no in-memory data provided`);
        }
    }

    protected postReadHook(collection: TCollection) {}

    private async getContent(): Promise<TCollection> {
        const config = this.config
        if (config.accessMode === 'RW') {
            const content = await measureTime(() => readFile(DB_FILE(config.name), 'utf-8'), 'db-read');
            return JSON.parse(content);
        } else {
            return config.__IN_MEMORY__;
        }
    }

    protected async read() {
        try {
            const parsed = await this.getContent();
            this.data = parsed;
            logger.debug(`Collection ${this.config.name} loaded`);
            this.postReadHook(parsed);
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
                config.name, 
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
