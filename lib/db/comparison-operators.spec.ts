import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';

import { ArrayCollection } from './db-array-collection';

describe('ArrayCollection : Comparison Operators', () => {
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
            collectionSchema: z.object({
                id: z.number(),
                name: z.string()
            })
        });
    }

    beforeEach(reset);

    describe('findMany with comparison operators', () => {
        it('should filter items using $eq operator', async () => {
            const results = await collection.findMany({ $match: { id: { $eq: 1 } } });
            expect(results).toHaveLength(1);
            expect(results[0].id).toBe(1);
        });

        it('should filter items using $gt operator', async () => {
            const results = await collection.findMany({ $match: { id: { $gt: 3 } } });
            expect(results).toHaveLength(2);
            expect(results.map(r => r.id)).toEqual([4, 5]);
        });

        it('should filter items using $gte operator', async () => {
            const results = await collection.findMany({ $match: { id: { $gte: 4 } } });
            expect(results).toHaveLength(2);
            expect(results.map(r => r.id)).toEqual([4, 5]);
        });

        it('should filter items using $lt operator', async () => {
            const results = await collection.findMany({ $match: { id: { $lt: 3 } } });
            expect(results).toHaveLength(2);
            expect(results.map(r => r.id)).toEqual([1, 2]);
        });

        it('should filter items using $lte operator', async () => {
            const results = await collection.findMany({ $match: { id: { $lte: 2 } } });
            expect(results).toHaveLength(2);
            expect(results.map(r => r.id)).toEqual([1, 2]);
        });

        it('should filter items using $ne operator', async () => {
            const results = await collection.findMany({ $match: { id: { $ne: 3 } } });
            expect(results).toHaveLength(4);
            expect(results.map(r => r.id)).toEqual([1, 2, 4, 5]);
        });

        
        it('should combine multiple operators using $and', async () => {
            const results = await collection.findMany({
                $match: {
                    $and: [
                        { id: { $gt: 2 } },
                        { id: { $lt: 5 } }
                    ]
                }
            });
            expect(results).toHaveLength(2);
            expect(results.map(r => r.id)).toEqual([3, 4]);
        });

        it('should combine multiple operators using $or', async () => {
            const results = await collection.findMany({
                $match: {
                    $or: [
                        { id: { $lt: 2 } },
                        { id: { $gt: 4 } }
                    ]
                }
            });
            expect(results).toHaveLength(2);
            expect(results.map(r => r.id)).toEqual([1, 5]);
        });

        it('should handle complex nested operators', async () => {
            const results = await collection.findMany({
                $match: {
                    $or: [
                        { id: { $lt: 2 } },
                        {
                            $and: [
                                { id: { $gt: 2 } },
                                { id: { $lt: 5 } }
                            ]
                        }
                    ]
                }
            });
            expect(results).toHaveLength(3);
            expect(results.map(r => r.id)).toEqual([1, 3, 4]);
        });
    });
});
