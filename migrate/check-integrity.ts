import { DBConnection } from "../lib/db/db-connection";
import { logger } from "../lib/logger";

export const checkProjectTeamIntegrity = async (dbConnection: DBConnection) => {
    const projectIds = await dbConnection.projects.findMany().then(projects => projects.map(p => p.id));
    const employeeIds = await dbConnection.employees.findMany().then(employees => employees.map(e => e.id));
    const projectTeams = await dbConnection.projectTeams.findMany();

    const projectIdsInTeam = projectTeams.map(t => t.projectId);
    const employeeIdsInTeam = projectTeams.map(t => t.employeeId);

    const missingProjects = projectIdsInTeam.filter(id => !projectIds.includes(id));
    const missingEmployees = employeeIdsInTeam.filter(id => !employeeIds.includes(id));

    let errors: string[] = [];
    if (missingProjects.length > 0) {
        errors.push(`Missing projects in project team (${missingProjects.length}): ${missingProjects.join(', ')}`);
    }

    if (missingEmployees.length > 0) {
        errors.push(`Missing employees in project team: (${missingEmployees.length}) ${missingEmployees.join(', ')}`);
    }

    return errors;
}

export const checkIntegrity = async (dbConnection: DBConnection) => {
    let errors: string[] = [];

    errors.push(...(await checkProjectTeamIntegrity(dbConnection)));

    if (errors.length > 0) {
        logger.error('Integrity check failed. Errors:');
        errors.forEach(e => logger.error(e));
        process.exit(1);
    } else {
        logger.info('Integrity check passed 💖');
    }
}
