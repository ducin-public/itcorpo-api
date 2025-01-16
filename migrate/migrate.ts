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
        enabled: true,
        processFn: migrateEmployees,
    },
    benefits: {
        enabled: false,
        processFn: generateBenefits,
    },
    offices: {
        enabled: false,
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
const runMigration = async () => {
    const migrationTargets = Object.entries(migrationSettings).filter(([_, { enabled }]) => enabled).map(([key]) => key)
    if (migrationTargets.length === 0) {
        logger.warn('No migration targets selected. Exiting...');
        process.exit(0);
    } else {
        logger.info(`Migrating: ${migrationTargets.join(', ')}.`);
    }

    for (const [collectionName, { enabled, processFn }] of  Object.entries(migrationSettings)){
        if (!enabled) {
            continue;
        }

        try {
            logger.info(`Migrating ${collectionName}...`);
            await processFn(dbConnection);
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
    await checkIntegrity(dbConnection);
}

runMigration();
