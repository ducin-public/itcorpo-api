import { DBError } from './db-error';
import { randomUUID } from 'crypto';

import { DBCollection } from "./db-collection";
import { QueryParams, validateQueryParams } from './db-query-params';

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
                throw new DBError(`Collection validation (${this.config.name}) failed for object (${obj}): ${JSON.stringify(result.error.format(), null, 2)}`);
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

    async findMany(predicate?: (item: TItem) => unknown, params: Partial<QueryParams> = {}) {
        validateQueryParams(params);

        let collection = await this.getAll();

        if (predicate) {
            collection = collection.filter(predicate);
        }

        if (params.$skip) {
            collection = collection.slice(params.$skip);
        }

        if (params.$limit) {
            collection = collection.slice(0, params.$limit);
        }

        return collection;
    }

    async replaceOne(predicate: (item: TItem) => unknown, replaced: TItem) {
        const collection = await this.getAll();

        const idx = collection.findIndex(predicate);
        if (idx !== -1) {
            collection[idx] = replaced;
            return replaced;
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
        if (this.hasIDColumn() && !('id' in item)) {
            Object.assign(item, { id: this.insertionId() });
        }

        collection.push(item as TItem);
        return item as TItem;
    }

    async insertMany(documents: TItem[]) {
        const collection = await this.getAll();

        if (this.hasIDColumn()) {
            for (const doc of documents) {
                if (!('id' in doc)) {
                    Object.assign(doc, { id: this.insertionId() });
                }
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
