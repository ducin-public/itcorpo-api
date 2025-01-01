const logger = require('../utils/logger');
const { migrateOffices } = require('./migrate-offices');
const { migrateProjects } = require('./migrate-projects');
const { dbPath, readDatabaseFile, writeDatabaseFile } = require('./file-utils');

logger.info('Starting database migration...');
const dbContent = readDatabaseFile(dbPath);
// const updatedOffices = migrateOffices(dbContent.offices, dbContent.officeAmenities || []);
const updatedProjects = migrateProjects(dbContent.projects || []);

const updatedContent = {
    ...dbContent,
    // offices: updatedOffices,
    projects: updatedProjects
};

writeDatabaseFile(dbPath, updatedContent);
