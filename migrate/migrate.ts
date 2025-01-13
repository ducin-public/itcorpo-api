import { logger } from '../lib/logger';
import { migrateOffices } from './migrate-offices';
import { migrateProjects } from './migrate-projects';
import { migrateEmployees } from './migrate-employees';
import { readDatabaseFile, writeDatabaseFile } from './lib/file-utils';
import { generateBenefits } from './generate-benefits';
import { FILES } from '../lib/files';
import { DbSchema } from '../lib/db/db-schema';
import { checkIntegrity } from './check-integrity';
import { validateDatabase } from './validate-database';
import { migrateProjectTeams } from './migrate-project-teams';
import { generateTimesheets } from './generate-timesheets';

process.env.TZ = 'UTC';

logger.info('Starting database migration...');
const dbContent: DbSchema = readDatabaseFile(FILES.DATABASE_FILE);

const migrateToggles = {
    employees: false,
    benefits: false,
    offices: false,
    projects: false,
    projectTeams: false,
    timesheets: false,
}

const migrationTargets = Object.entries(migrateToggles).filter(([_, value]) => value).map(([key]) => key)
if (migrationTargets.length === 0) {
    logger.warn('No migration targets selected. Exiting...');
    process.exit(0);
} else {
    logger.info(`Migrating: ${migrationTargets.join(', ')}.`);
}

function reorderDatabaseContentKeys(content: DbSchema): DbSchema {
    const { logs, benefitServices, benefitSubscriptions, benefitCharges, ...rest } = content;
    return {
        logs,
        benefitServices,
        benefitSubscriptions,
        benefitCharges,
        ...rest,
    };
}

const updatedContent: DbSchema = {
    ...dbContent,
    ...(migrateToggles.offices && { offices: migrateOffices(dbContent) }),
    ...(migrateToggles.projects && { projects: migrateProjects(dbContent) }),
    ...(migrateToggles.employees && { employees: migrateEmployees(dbContent) }),
    ...(migrateToggles.benefits && generateBenefits(dbContent)),
    ...(migrateToggles.projectTeams && { projectTeams: migrateProjectTeams(dbContent) }),
    ...(migrateToggles.timesheets && generateTimesheets(dbContent)),
};

// check integrity before writing the database file
checkIntegrity(updatedContent);
// validate schemas before writing the database file
validateDatabase(updatedContent);

writeDatabaseFile(FILES.DATABASE_FILE, reorderDatabaseContentKeys(updatedContent));
