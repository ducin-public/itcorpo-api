import { DBProjectTeam, DbSchema } from "../lib/db/db-schema";
import { logger } from "../lib/logger";
import { randomDate, randomFromArray } from "./lib/random";

export enum EngagementLevel {
    FULL_TIME = 'FULL_TIME',       // 100%-75%
    PARTIAL_PLUS = 'PARTIAL_PLUS', // 75%-50%
    HALF_TIME = 'HALF_TIME',       // 50%-25%
    ON_DEMAND = 'ON_DEMAND'        // <25%
}

export const migrateProjectTeams = (dbContent: DbSchema): DBProjectTeam[] => {
    const projectTeams = dbContent.projectTeams;
    logger.debug(`Found ${projectTeams.length} projectTeams to process`);

    const migratedProjectTeams = projectTeams.map(projectTeam => {
        const randomFullDate = randomDate(new Date(2020, 0, 1), new Date());
        const firstDayOfMonth = new Date(
            randomFullDate.getFullYear(),
            randomFullDate.getMonth(),
            1
        ).toISOString();
        
        let updatedProjectTeam = {
            ...projectTeam,
            engagementLevel: randomFromArray(Object.values(EngagementLevel)),
            since: firstDayOfMonth
        };
        return updatedProjectTeam;
    });

    return migratedProjectTeams;
}