import { logger } from '../lib/logger';
import { migrateOffices } from './migrate-offices';
import { migrateProjects } from './migrate-projects';
import { readDatabaseFile, writeDatabaseFile } from './file-utils';
import { DatabaseContent } from './types';
import { FILES } from '../lib/files';

logger.info('Starting database migration...');
const dbContent: DatabaseContent = readDatabaseFile(FILES.DATABASE_FILE);
// const updatedOffices = migrateOffices(dbContent.offices, dbContent.officeAmenities || []);
const updatedProjects = migrateProjects(dbContent.projects || []);

const updatedContent: DatabaseContent = {
    ...dbContent,
    // offices: updatedOffices,
    projects: updatedProjects
};

writeDatabaseFile(FILES.DATABASE_FILE, updatedContent);
