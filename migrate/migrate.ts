import logger from '../utils/logger';
import { migrateOffices } from './migrate-offices';
import { migrateProjects } from './migrate-projects';
import { dbPath, readDatabaseFile, writeDatabaseFile } from './file-utils';
import { DatabaseContent } from './types';

logger.info('Starting database migration...');
const dbContent: DatabaseContent = readDatabaseFile(dbPath);
// const updatedOffices = migrateOffices(dbContent.offices, dbContent.officeAmenities || []);
const updatedProjects = migrateProjects(dbContent.projects || []);

const updatedContent: DatabaseContent = {
    ...dbContent,
    // offices: updatedOffices,
    projects: updatedProjects
};

writeDatabaseFile(dbPath, updatedContent);
