import { checkIntegrity } from './check-integrity';
import { logger } from '../lib/logger';

import { migrateOffices } from './migrate-offices';
import { migrateProjects } from './migrate-projects';
import { migrateEmployees } from './migrate-employees';
import { migrateProjectTeams } from './migrate-project-teams';
import { generateBenefits } from './generate-benefits';
import { generateTimesheets } from './generate-timesheets';
import { dbConnection, DBConnection } from '../lib/db/db-connection';
import { DBError } from '../lib/db/db-error';

process.env.TZ = 'UTC';

logger.info('Starting database migration...');

const migrationSettings: {
    [collection in string]: {
        enabled: boolean;
        processFn: (dbConnection: DBConnection) => Promise<void>;
    }
} = {
    employees: {
        enabled: false,
        processFn: migrateEmployees,
    },
    benefits: {
        enabled: false,
        processFn: generateBenefits,
    },
    offices: {
        enabled: true,
        processFn: migrateOffices,
    },
    projects: {
        enabled: false,
        processFn: migrateProjects,
    },
    projectTeams: {
        enabled: false,
        processFn: migrateProjectTeams,
    },
    timesheets: {
        enabled: false,
        processFn: generateTimesheets,
    }
}

const migrationTargets = Object.entries(migrationSettings).filter(([_, { enabled }]) => enabled).map(([key]) => key)
if (migrationTargets.length === 0) {
    logger.warn('No migration targets selected. Exiting...');
    process.exit(0);
} else {
    logger.info(`Migrating: ${migrationTargets.join(', ')}.`);
}

for (const [collectionName, { processFn }] of  Object.entries(migrationSettings)){
    try {
        logger.info(`Migrating ${collectionName}...`);
        processFn(dbConnection);
        logger.info(`Migration successfully finished for ${collectionName}.`);
    } catch (e) {
        if (e instanceof DBError) {
            logger.error(`DBError occurred while migrating ${collectionName}:`, e);
            process.exit(1);
        }
        logger.error(`Other error occurred while migrating ${collectionName}:`, e);
    }
}

// check integrity before writing the database file
checkIntegrity(dbConnection);
