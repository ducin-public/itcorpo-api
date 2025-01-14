import { Projects } from '../contract-types/ProjectsRoute';
import { DBProjectTeam } from '../lib/db/db-zod-schemas/project-team.schema';
import { DBProject } from '../lib/db/db-zod-schemas/project.schema';

/**
 * Filter projects based on provided criteria
 * 
 * @param criteria - Search criteria for filtering projects
 *   @see {@link Projects.GetProjects.RequestQuery}
 *   - projectName: Filter by project name (case-insensitive partial match)
 *   - status: Filter by project status
 *   - teamMembers: Filter by team member IDs (comma-separated)
 *   - teamMembersFiltering: How to match team members ('ANY' or 'ALL', defaults to 'ANY')
 *   - budgetFrom: Filter by minimum budget amount
 *   - budgetTo: Filter by maximum budget amount
 * 
 * @param collections - Collection of data required for filtering
 * 
 * @returns Filtered array of projects matching the criteria
 *   @see {@link DBProject}
 */
export function filterProjects(
    criteria: Projects.GetProjectsCount.RequestQuery,
    collections: {
        projects: DBProject[];
        projectTeams: DBProjectTeam[];
    }
): DBProject[] {
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

    // Filter by budget range if provided
    if (criteria.budgetFrom) {
        const minBudget = Number(criteria.budgetFrom);
        result = result.filter(project =>
            project.budget >= minBudget
        );
    }

    if (criteria.budgetTo) {
        const maxBudget = Number(criteria.budgetTo);
        result = result.filter(project =>
            project.budget <= maxBudget
        );
    }

    // Filter by team members if provided
    const teamMembers = criteria.teamMembers?.split(',').map(Number);
    if (teamMembers) {
        const filtering = criteria.teamMembersFiltering || 'ANY';
        const projectTeamsMap = new Map<string, number[]>();

        // Create a map of project IDs to employee IDs
        for (const pt of collections.projectTeams) {
            const employees = projectTeamsMap.get(pt.projectId) || [];
            employees.push(pt.employeeId);
            projectTeamsMap.set(pt.projectId, employees);
        }

        result = result.filter(project => {
            const projectTeamIds = projectTeamsMap.get(project.id) || [];
            return filtering === 'ANY'
                ? teamMembers.some(id => projectTeamIds.includes(id))
                : teamMembers.every(id => projectTeamIds.includes(id));
        });
    }

    return result;
}
