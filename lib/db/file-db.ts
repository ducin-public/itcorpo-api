import { readFile, writeFile } from 'fs/promises';

import { logger } from '../logger';
import { measureTime } from '../perf';
import { ZodType } from 'zod';

// an object type which accepts `TDatabase extends object` where keys are keys of TDatabase, but filtered: only the ones which values are an array, (2) the array item has an id property; the value of the result type is the type of an id (e.g. { employee: number, project: string, ... })
type CollectionIdType<TDatabase extends object> = {
    [K in keyof TDatabase]: TDatabase[K] extends Array<infer TItem> ? TItem extends { id: infer TId } ? TId : never : never;
};
// a union of only those keys which have 'number' values
type OnlyNumbers<TDatabase extends object> = {
    [K in keyof CollectionIdType<TDatabase>]: CollectionIdType<TDatabase>[K] extends number 
        ? CollectionIdType<TDatabase>[K] extends never 
            ? never 
            : K 
        : never;
}[keyof CollectionIdType<TDatabase>];

type FileDbConfig = {
    path: string;
    accessMode: "R" | "RW";
};

export class FileDb<TDatabase extends object> {
    data: TDatabase;

    constructor(private config: FileDbConfig) {
        this.data = {} as TDatabase;
    }

    // private validateData(zodSchema: ZodType): asserts data is TDatabase {
        // TODO: implement this
    // }

    canWrite() {
        return this.config.accessMode === 'RW';
    }

    async read() {
        try {
            const content = await measureTime(() => readFile(this.config.path, 'utf-8'), 'db-read');
            const parsed = JSON.parse(content);
            this.data = parsed;
            logger.debug(`Database loaded`);
        } catch (error) {
            logger.error('Failed to initialize database:', error);
            process.exit(1);
        }
    }

    async write() {
        if (!this.canWrite()) {
            const message = 'Cannot write to database in read-only mode';
            logger.error(message);
            throw new Error(message);
        }

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

    async close() {
        await this.write();
    }

    getNextId<TCollection extends OnlyNumbers<TDatabase>>(collection: TCollection): number {
        if (!Array.isArray(this.data[collection])) {
            throw new Error(`Collection ${String(collection)} is not an array`);
        }

        const items = this.data[collection] as unknown as Array<{ id: number }>;
        return Math.max(...items.map(item => item.id), 0) + 1;
    }
}
