import { logger } from '../lib/logger';
import { migrateOffices } from './migrate-offices';
import { migrateProjects } from './migrate-projects';
import { migrateEmployees } from './migrate-employees';
import { readDatabaseFile, writeDatabaseFile } from './file-utils';
import { DatabaseContent } from './migration-types';
import { FILES } from '../lib/files';

logger.info('Starting database migration...');
const dbContent: DatabaseContent = readDatabaseFile(FILES.DATABASE_FILE);
const updatedOffices = migrateOffices(dbContent);
const updatedProjects = migrateProjects(dbContent);
const updatedEmployees = migrateEmployees(dbContent);

const migrateToggles = {
    offices: false,
    projects: false,
    employees: false,
}

const migrationTargets = Object.entries(migrateToggles).filter(([_, value]) => value).map(([key]) => key)
if (migrationTargets.length === 0) {
    logger.warn('No migration targets selected. Exiting...');
    process.exit(0);
} else {
    logger.info(`Migrating: ${migrationTargets.join(', ')}.`);
}

const updatedContent: DatabaseContent = {
    ...dbContent,
    ...(migrateToggles.offices && { offices: updatedOffices }),
    ...(migrateToggles.projects && { projects: updatedProjects }),
    ...(migrateToggles.employees && { employees: updatedEmployees }),
};

writeDatabaseFile(FILES.DATABASE_FILE, updatedContent);
