import { DBError } from './db-error';

import { DBCollection } from "./db-collection";
import { QueryParams, validateQueryParams, createPredicateFromCriteria } from './db-query-params';
import { AggregateStage, InferAggregateResult } from './db-aggregate-types';
import { MatchParams } from './db-match-types';

export class ArrayCollection<TCollectionItem extends object> extends DBCollection<TCollectionItem> {
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

    private getMatchPredicate({ $match }: MatchParams<TCollectionItem>) {
        if (!$match) {
            return () => true;
        }
        return createPredicateFromCriteria($match);
    }

    async count(params: MatchParams<TCollectionItem> = {}) {
        validateQueryParams(params);
        const collection = await this.getAll();

        if (!params.$match) {
            return collection.length;
        }
        const $matchPredicate = this.getMatchPredicate(params);
        return collection.filter($matchPredicate).length;
    }

    async findOne(params: MatchParams<TCollectionItem> = {}) {
        validateQueryParams(params);
        const $matchPredicate = this.getMatchPredicate(params);
        const collection = await this.getAll();
        return collection.find($matchPredicate);
    }

    async findMany(params: QueryParams<TCollectionItem> = {}) {
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

    async replaceOne(params: QueryParams<TCollectionItem>, replaced: TCollectionItem) {
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

    async updateOne(params: QueryParams<TCollectionItem>, data: Partial<TCollectionItem>) {
        validateQueryParams(params);
        const $matchPredicate = this.getMatchPredicate(params);

        let collection = await this.getAll();

        const item = collection.find($matchPredicate);
        if (item) {
            Object.assign(item, data);
        }
    }

    async insertOne(document: TCollectionItem) {
        const collection = await this.getAll();
        collection.push(document);
        return document;
    }

    async insertMany(documents: TCollectionItem[]) {
        const collection = await this.getAll();
        collection.push(...documents);
    }

    async deleteOne(params: QueryParams<TCollectionItem> = {}) {
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

    async deleteMany(params: QueryParams<TCollectionItem> = {}) {
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

    async aggregate<
        TOutputKey extends string,
        TStages extends readonly AggregateStage<TCollectionItem, TOutputKey>[]
    >(
        pipeline: [...TStages]
    ): Promise<InferAggregateResult<TCollectionItem, TStages>[]> {
        let result = await this.getAll();

        for (const stage of pipeline) {
            if ('$match' in stage) {
                const predicate = createPredicateFromCriteria(stage.$match);
                result = result.filter(predicate);
            }
            if ('$lookup' in stage) {
                const lookup = stage.$lookup;
                const foreignCollection = this.config.db[lookup.from];
                const foreignData = await foreignCollection.findMany();

                result = result.map(item => {
                    const localValue = item[lookup.localField as keyof typeof item]
                    
                    return {
                        ...item,
                        [lookup.as]: foreignData.filter(foreign => {
                            const foreignValue = foreign[lookup.foreignField as keyof typeof foreign]
                            if (Array.isArray(localValue)) {
                                return localValue.includes(foreignValue)
                            } else {
                                return localValue === foreignValue
                            }
                        })
                    }
                });
            }
        }

        return result as InferAggregateResult<TCollectionItem, TStages>[];
    }
}
