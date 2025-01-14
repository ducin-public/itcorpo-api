import { logger } from '../lib/logger';
import { DBConnection } from '../lib/db/db-connection';
import { DBProject } from '../lib/db/db-zod-schemas/project.schema';

const updateProject = (project: DBProject) => {
    let updatedProject = {
        ...project,
        // name: generateNewProjectName()
    };
    // updatedProject = extractTeamMembersFromProject(updatedProject);
    return updatedProject;
}

export async function migrateProjects(dbConnection: DBConnection) {
    const allProjects = await dbConnection.projects.findMany();
    logger.debug(`Found ${allProjects.length} projects to process`);
    
    const newProjects = allProjects.map(updateProject);
    await dbConnection.projects.deleteMany();
    await dbConnection.projects.insertMany(newProjects);
    await dbConnection.projects.validateInMemory();
    
    await dbConnection.projects.flush();
    logger.info(`Migrated ${allProjects.length} projects`);
};
