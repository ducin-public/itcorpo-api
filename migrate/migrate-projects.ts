import { DBProject, DbSchema } from '../lib/db/db-schema';
import { migrationBuffer } from './migration-buffer';
import { logger } from '../lib/logger';

export const migrateProjects = (dbContent: DbSchema): DBProject[] => {
    const projects = dbContent.projects;
    logger.debug(`Found ${projects.length} projects to process`);
    
    migrationBuffer.projectTeams = [];

    // Process projects and extract teams
    const processedProjects = projects.map(project => {
        let updatedProject = {
            ...project,
            // name: generateNewProjectName()
        };
        // updatedProject = extractTeamMembersFromProject(updatedProject);
        return updatedProject;
    });
    
    return processedProjects;
};
