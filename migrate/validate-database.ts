import { DbSchema, zodDatabaseSchemas } from "../lib/db/db-schema";

// use zod schemas (from lib/db/db-schema.ts) to validate the projects and projectTeams collections
export const validateDatabase = (dbContent: DbSchema): void => {
    for (const project of dbContent.projects) {
        const result = zodDatabaseSchemas.project.safeParse(project);
        if (result.error) {
            throw new Error(`Project validation failed (id: ${project.id}): ${result.error.errors.map(e => e.message).join('\n- ')}`);
        }
    }

    for (const projectTeam of dbContent.projectTeams) {
        const result = zodDatabaseSchemas.projectTeam.safeParse(projectTeam);
        if (result.error) {
            throw new Error(`ProjectTeam validation failed: ${result.error.errors.map(e => JSON.stringify(e, null, 2)).join('\n- ')}`);
        }
    }
}
