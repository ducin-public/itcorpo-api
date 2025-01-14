import { readFile, writeFile } from 'fs/promises';

import { logger } from '../logger';
import { measureTime } from '../perf';
import { ZodObject, ZodSchema } from 'zod';
import { DBError } from './db-error';
import { randomUUID } from 'crypto';

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
    path: string;
    accessMode: "R" | "RW";
    /** whether the object type has id:number property */
    autoIncrement: boolean;
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

    constructor(protected config: DBCollectionConfig) {}

    canWrite() {
        return this.config.accessMode === 'RW';
    }

    protected postReadHook(collection: TCollection) {}

    protected async read() {
        try {
            const content = await measureTime(() => readFile(this.config.path, 'utf-8'), 'db-read');
            const parsed = JSON.parse(content);
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
        if (!this.canWrite()) {
            const message = `Cannot write to collection ${this.config.name} in read-only mode`;
            logger.error(message);
            throw new DBError(message);
        }

        try {
            await measureTime(() => writeFile(
                this.config.path, 
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

export class ArrayCollection<TItem extends object> extends DBCollection<TItem[]> {
    private nextId: number = 1;

    private hasIDColumn(){
        const zodShape = (this.config.collectionSchema as any).shape;
        return 'id' in zodShape;
    }

    protected override postReadHook(items: TItem[]) {
        if (this.config.autoIncrement) {
            this.nextId = Math.max(...items.map(item => (item as any).id), 0) + 1;
        }
    }

    private insertionId() {
        if (this.config.autoIncrement) {
            return this.nextId++;
        } else {
            return randomUUID();
        }
    }

    // private assertCollectionData(data: unknown): asserts data is TItem[];

    async validateInMemory() {
        const itemSchema = this.config.collectionSchema;
        const data = await this.getAll();
        for (const item of data) {
            const result = itemSchema.safeParse(item);
            if (result.error) {
                const obj = JSON.stringify(item, null, 2);
                throw new DBError(`Collection validation (${this.config.name}) failed for object (${obj}): ${result.error.errors.map(e => e.message).join('\n- ')}`);
            }
        }
    }

    async count(predicate?: (item: TItem) => unknown) {
        const collection = await this.getAll();

        if (!predicate) {
            return collection.length;
        }
        return collection.filter(predicate).length;
    }

    async findOne(predicate: (item: TItem) => unknown) {
        const collection = await this.getAll();
        return collection.find(predicate);
    }

    async findMany(predicate?: (item: TItem) => unknown) {
        const collection = await this.getAll();

        if (!predicate) {
            return collection;
        }

        return collection.filter(predicate);
    }

    async replaceOne(predicate: (item: TItem) => unknown, replaced: TItem) {
        const collection = await this.getAll();

        const idx = collection.findIndex(predicate);
        if (idx !== -1) {
            collection[idx] = replaced;
        } else {
            throw new DBError(`Item not found in collection ${this.config.name}`);
        }
    }

    async updateOne(predicate: (item: TItem) => unknown, data: Partial<TItem>) {
        const collection = await this.getAll();
        
        const item = collection.find(predicate);
        if (item) {
            Object.assign(item, data);
        }
    }

    async insertOne(document: TItem | Omit<TItem, 'id'>) {
        const collection = await this.getAll();

        let item = document;
        if (this.hasIDColumn()) {
            Object.assign(item, { id: this.insertionId() });
        }

        collection.push(item as TItem);
        return item as TItem;
    }

    async insertMany(documents: TItem[]) {
        const collection = await this.getAll();

        if (this.hasIDColumn()) {
            for (const doc of documents) {
                Object.assign(doc, { id: this.insertionId() });
            }
        }

        collection.push(...documents);
    }

    async deleteOne(predicate: (item: TItem) => unknown) {
        const collection = await this.getAll();
        
        const idx = collection.findIndex(predicate);
        if (idx !== -1) {
            collection.splice(idx, 1);
        } else {
            throw new DBError(`Item not found in collection ${this.config.name}`);
        }
    }

    async deleteMany(predicate?: (item: TItem) => unknown) {
        const collection = await this.getAll();
        // clear
        if (!predicate) {
            collection.splice(0);
            return;
        }

        // iterating in reverse order to avoid index shifting
        const items = await this.getAll();
        const size = items.length;
        for (let i = size - 1; i >= 0; i--) {
            if (predicate(items[i])) {
                items.splice(i, 1);
            }
        }
    }
}
