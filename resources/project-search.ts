import { Project, ProjectsSearchCriteria } from '../contract-types/data-contracts';
import { DbSchema } from '../lib/db';

/**
 * Processes projects search criteria and filters projects based on provided criteria
 * 
 * @param collections - Database collections required for project search
 *   @see {@link DbSchema}
 * 
 * @param criteria - Search criteria for filtering projects
 *   @see {@link ProjectsSearchCriteria}
 *   - projectName: Filter by project name (case-insensitive partial match)
 *   - status: Filter by project status
 *   - teamMembers: Filter by team member IDs (comma-separated)
 *   - budgetFrom: Filter by minimum budget amount
 *   - budgetTo: Filter by maximum budget amount
 * 
 * @returns Filtered array of projects matching the criteria
 *   @see {@link Project}
 */
export function processProjectsSearchCriteria(
    collections: Pick<DbSchema, 'projects'>,
    criteria: ProjectsSearchCriteria
): Project[] {
    let result = [...collections.projects];

    // Filter by project name if provided
    if (criteria.projectName) {
        const searchName = criteria.projectName.toLowerCase();
        result = result.filter(project => 
            project.name.toLowerCase().includes(searchName)
        );
    }

    // Filter by status if provided
    if (criteria.status) {
        result = result.filter(project => 
            project.status === criteria.status
        );
    }

    // Filter by team members if provided
    const teamMembers = criteria.teamMembers?.split(',').map(Number);
    if (teamMembers?.length) {
        result = result.filter(project => 
            project.team.some(member => teamMembers.includes(member.id))
        );
    }

    // Filter by budget range if provided
    if (criteria.budgetFrom) {
        const minBudget = Number(criteria.budgetFrom);
        result = result.filter(project => project.budget >= minBudget);
    }
    if (criteria.budgetTo) {
        const maxBudget = Number(criteria.budgetTo);
        result = result.filter(project => project.budget <= maxBudget);
    }

    return result;
}
