import { Project } from "../contract-types/data-contracts";
import { DBProject } from "../lib/db/db-zod-schemas/project.schema";

// IMPORTANT: This function mutates migrationBuffer
export const extractTeamMembersFromProject = (project: DBProject) => {
    const projectTeams = []

    const projectBeforeMigration = project as Project
    if ((projectBeforeMigration).team) {
        projectTeams.push(...projectBeforeMigration.team.map(member => ({
            employeeId: member.id,
            projectId: project.id,
            employeeName: member.name,
            projectName: project.name
        })));
        delete (project as any).team;
    }
    return project;
}
