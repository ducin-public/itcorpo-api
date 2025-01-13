import { Project } from "../contract-types/data-contracts";
import { DBProject } from "../lib/db-schema";
import { migrationBuffer } from "./migration-buffer";

// IMPORTANT: This function mutates migrationBuffer
export const extractTeamMembersFromProject = (project: DBProject) => {
    const projectBeforeMigration = project as Project;
    if ((projectBeforeMigration).team) {
        migrationBuffer.projectTeams.push(...projectBeforeMigration.team.map(member => ({
            employeeId: member.id,
            projectId: project.id,
            employeeName: member.name,
            projectName: project.name
        })));
        delete (project as any).team;
    }
    return project;
}
