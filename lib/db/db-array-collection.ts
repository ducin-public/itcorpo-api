import { DBError } from './db-error';
import { randomUUID } from 'crypto';

import { DBCollection } from "./db-collection";
import { MatchParams, QueryParams, validateQueryParams, createPredicateFromCriteria } from './db-query-params';
import { all } from '../../resources/core/filtering';

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

    private getMatchPredicate({ $match }: MatchParams<TItem>) {
        if (!$match) {
            return () => true;
        }
        return createPredicateFromCriteria($match);
    }

    async count(params: MatchParams<TItem> = {}) {
        const collection = await this.getAll();

        if (!params.$match) {
            return collection.length;
        }
        const $matchPredicate = this.getMatchPredicate(params);
        return collection.filter($matchPredicate).length;
    }

    async findOne(params: MatchParams<TItem> = {}) {
        validateQueryParams(params);
        const $matchPredicate = this.getMatchPredicate(params);
        const collection = await this.getAll();
        return collection.find($matchPredicate);
    }

    async findMany(params: QueryParams<TItem> = {}) {
        validateQueryParams(params);
        let collection = await this.getAll();
        
        if (params.$match) {
            const $matchPredicate = this.getMatchPredicate(params);
            collection = collection.filter($matchPredicate);
        }

        if (params.$skip) {
            collection = collection.slice(params.$skip);
        }

        if (params.$limit) {
            collection = collection.slice(0, params.$limit);
        }

        return collection;
    }

    async replaceOne(params: QueryParams<TItem>, replaced: TItem) {
        validateQueryParams(params);
        const $matchPredicate = this.getMatchPredicate(params);

        let collection = await this.getAll();

        const idx = collection.findIndex($matchPredicate);
        if (idx !== -1) {
            collection[idx] = replaced;
            return replaced;
        } else {
            throw new DBError(`Item not found in collection ${this.config.name}`);
        }
    }

    async updateOne(params: QueryParams<TItem>, data: Partial<TItem>) {
        validateQueryParams(params);
        const $matchPredicate = this.getMatchPredicate(params);

        let collection = await this.getAll();

        const item = collection.find($matchPredicate);
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

    async deleteOne(params: QueryParams<TItem> = {}) {
        validateQueryParams(params);
        const $matchPredicate = this.getMatchPredicate(params);

        let collection = await this.getAll();
        
        const idx = collection.findIndex($matchPredicate);
        if (idx !== -1) {
            collection.splice(idx, 1);
        } else {
            throw new DBError(`Item not found in collection ${this.config.name}`);
        }
    }

    async deleteMany(params: QueryParams<TItem> = {}) {
        validateQueryParams(params);

        let collection = await this.getAll();
        // clear
        if (!params.$match) {
            collection.splice(0);
            return;
        }

        const $matchPredicate = this.getMatchPredicate(params);

        // iterating in reverse order to avoid index shifting
        const items = await this.getAll();
        const size = items.length;
        for (let i = size - 1; i >= 0; i--) {
            if ($matchPredicate(items[i])) {
                items.splice(i, 1);
            }
        }
    }
}
