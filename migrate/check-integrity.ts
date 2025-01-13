import { DbSchema } from "../lib/db-schema";
import { logger } from "../lib/logger";

export const checkProjectTeamIntegrity = (dbContent: DbSchema) => {
    const projectIds = dbContent.projects.map(p => p.id);
    const employeeIds = dbContent.employees.map(e => e.id);
    const projectTeams = dbContent.projectTeams;

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

export const checkIntegrity = (dbContent: DbSchema) => {
    let errors: string[] = [];
    errors.push(...checkProjectTeamIntegrity(dbContent));

    if (errors.length > 0) {
        logger.error('Integrity check failed. Errors:');
        errors.forEach(e => logger.error(e));
        process.exit(1);
    } else {
        logger.info('Integrity check passed 💖');
    }
}
