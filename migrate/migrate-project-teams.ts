import { DBConnection } from "../lib/db/db-connection";
import { DBProjectTeam } from "../lib/db/db-zod-schemas/project-team.schema";
import { logger } from "../lib/logger";
import { randomDate, randomFromArray } from "./lib/random";

export enum EngagementLevel {
    FULL_TIME = 'FULL_TIME',       // 100%-75%
    PARTIAL_PLUS = 'PARTIAL_PLUS', // 75%-50%
    HALF_TIME = 'HALF_TIME',       // 50%-25%
    ON_DEMAND = 'ON_DEMAND'        // <25%
}

const updateProjectTeam = (projectTeam: DBProjectTeam): DBProjectTeam => {
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
}

export async function migrateProjectTeams(dbConnection: DBConnection) {
    const allProjectTeams = await dbConnection.projectTeams.findMany();
    logger.debug(`Found ${allProjectTeams.length} projectTeams to process`);

    const newProjectTeams = allProjectTeams.map(updateProjectTeam);
    await dbConnection.projectTeams.deleteMany();
    await dbConnection.projectTeams.insertMany(newProjectTeams);
    await dbConnection.projectTeams.validateInMemory();

    await dbConnection.projectTeams.flush();
    logger.info(`Migrated ${newProjectTeams.length} projectTeams`);
}
