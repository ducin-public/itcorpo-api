import { readFile, writeFile } from 'fs/promises';

import { FILES } from './files';
import { BenefitCharge, BenefitService, BenefitSubscription, Department, Employee, Expense, Geo, Office, OfficeAmenity, Project } from '../contract-types/data-contracts';
import { logger } from './logger';
import { measureTime } from './perf';

export interface DbSchema {
    benefitServices: BenefitService[];
    benefits: BenefitSubscription[];
    benefitCharges: BenefitCharge[];
    departments: Department[];
    employees: Employee[];
    expenses: Expense[];
    geo: Geo;
    officeAmenities: OfficeAmenity[];
    offices: Office[];
    projects: Project[];
}

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

class FileDb<TDatabase extends object> {
    data: TDatabase;

    constructor(private config: {
        path: string;
        requiredCollections: readonly (keyof TDatabase)[];
    }) {
        this.data = {} as TDatabase;
    }

    private validateData(data: unknown): asserts data is TDatabase {
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

    getNextId<TCollection extends OnlyNumbers<TDatabase>>(collection: TCollection): number {
        if (!Array.isArray(this.data[collection])) {
            throw new Error(`Collection ${String(collection)} is not an array`);
        }

        const items = this.data[collection] as unknown as Array<{ id: number }>;
        return Math.max(...items.map(item => item.id), 0) + 1;
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
