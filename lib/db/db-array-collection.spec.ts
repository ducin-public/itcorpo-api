import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';

import { ArrayCollection } from './db-array-collection';

describe('ArrayCollection', () => {
    type TestItem = { id: number; name: string };
    let collection: ArrayCollection<TestItem>;
    const createTestData = () => [
        { id: 1, name: 'item1' },
        { id: 2, name: 'item2' },
        { id: 3, name: 'item3' },
        { id: 4, name: 'item4' },
        { id: 5, name: 'item5' }
    ];

    const reset = () => {
        collection = new ArrayCollection({
            name: 'test',
            accessMode: 'R',
            __IN_MEMORY__: createTestData(),
            autoIncrement: true,
            collectionSchema: z.object({
                id: z.number(),
                name: z.string()
            })
        });
    }

    describe('findMany', () => {
        beforeEach(reset);

        it('should return all items when no predicate or params provided', async () => {
            const result = await collection.findMany();
            expect(result).toEqual(createTestData());
        });

        it('should filter items based on predicate', async () => {
            const result = await collection.findMany(item => item.id > 3);
            expect(result).toEqual([
                { id: 4, name: 'item4' },
                { id: 5, name: 'item5' }
            ]);
        });

        it('should skip items when $skip parameter is provided', async () => {
            const result = await collection.findMany(undefined, { $skip: 2 });
            expect(result).toEqual([
                { id: 3, name: 'item3' },
                { id: 4, name: 'item4' },
                { id: 5, name: 'item5' }
            ]);
        });

        it('should limit items when $limit parameter is provided', async () => {
            const result = await collection.findMany(undefined, { $limit: 2 });
            expect(result).toEqual([
                { id: 1, name: 'item1' },
                { id: 2, name: 'item2' }
            ]);
        });

        it('should apply both $skip and $limit when provided', async () => {
            const result = await collection.findMany(undefined, { $skip: 1, $limit: 2 });
            expect(result).toEqual([
                { id: 2, name: 'item2' },
                { id: 3, name: 'item3' }
            ]);
        });

        it('should throw error when invalid query params are provided', async () => {
            await expect(collection.findMany(undefined, { 
                $skip: -1 
            } as any)).rejects.toThrow();
            
            await expect(collection.findMany(undefined, { 
                $limit: -1 
            } as any)).rejects.toThrow();
        });
    });

    describe('findOne', () => {
        beforeEach(reset);
        it('should find item by predicate', async () => {
            const result = await collection.findOne(item => item.id === 3);
            expect(result).toEqual({ id: 3, name: 'item3' });
        });

        it('should return undefined when no item matches predicate', async () => {
            const result = await collection.findOne(item => item.id === 99);
            expect(result).toBeUndefined();
        });
    });

    describe('count', () => {
        it('should return total count when no predicate provided', async () => {
            const count = await collection.count();
            expect(count).toBe(5);
        });

        it('should return filtered count when predicate provided', async () => {
            const count = await collection.count(item => item.id > 3);
            expect(count).toBe(2);
        });
    });

    describe('replaceOne', () => {
        beforeEach(reset);

        it('should replace matching item', async () => {
            const replaced = await collection.replaceOne(
                item => item.id === 3,
                { id: 3, name: 'replaced' }
            );
            expect(replaced).toEqual({ id: 3, name: 'replaced' });
            
            const found = await collection.findOne(item => item.id === 3);
            expect(found).toEqual({ id: 3, name: 'replaced' });
        });

        it('should throw when no item matches predicate', async () => {
            await expect(
                collection.replaceOne(
                    item => item.id === 99,
                    { id: 99, name: 'new' }
                )
            ).rejects.toThrow();
        });
    });

    describe('updateOne', () => {
        beforeEach(reset);

        it('should update matching item', async () => {
            await collection.updateOne(
                item => item.id === 3,
                { name: 'updated' }
            );
            
            const found = await collection.findOne(item => item.id === 3);
            expect(found).toEqual({ id: 3, name: 'updated' });
        });

        it('should do nothing when no item matches predicate', async () => {
            await collection.updateOne(
                item => item.id === 99,
                { name: 'updated' }
            );
            
            const items = await collection.findMany();
            expect(items).toEqual(createTestData());
        });
    });

    describe('deleteOne', () => {
        beforeEach(reset);

        it('should delete matching item', async () => {
            await collection.deleteOne(item => item.id === 3);
            
            const items = await collection.findMany();
            expect(items).toHaveLength(4);
            expect(items.find(item => item.id === 3)).toBeUndefined();
        });

        it('should throw when no item matches predicate', async () => {
            await expect(
                collection.deleteOne(item => item.id === 99)
            ).rejects.toThrow();
        });
    });

    describe('deleteMany', () => {
        beforeEach(reset);

        it('should delete all matching items', async () => {
            const itemsBefore = await collection.findMany();
            expect(itemsBefore).toHaveLength(5);

            await collection.deleteMany(item => item.id > 3);
            
            const items = await collection.findMany();
            expect(items).toHaveLength(3);
            expect(items.every(item => item.id <= 3)).toBe(true);
        });

        it('should delete all items when no predicate provided', async () => {
            await collection.deleteMany();
            
            const items = await collection.findMany();
            expect(items).toHaveLength(0);
        });
    });
});
