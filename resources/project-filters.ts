import { Projects } from '../contract-types/ProjectsRoute';
import { DBProjectTeam } from '../lib/db/db-zod-schemas/project-team.schema';
import { DBProject } from '../lib/db/db-zod-schemas/project.schema';

export type ProjectWithTeams = DBProject & { team: DBProjectTeam[] };

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
 * @param projects - Array of projects with their teams
 * @returns Filtered array of projects matching the criteria
 */
export function filterProjects(
    criteria: Projects.GetProjects.RequestQuery,
    projects: ProjectWithTeams[]
): ProjectWithTeams[] {
    let result = [...projects];

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

        result = result.filter(project => {
            const projectTeamIds = project.team.map(pt => pt.employeeId);
            return filtering === 'ANY'
                ? teamMembers.some(id => projectTeamIds.includes(id))
                : teamMembers.every(id => projectTeamIds.includes(id));
        });
    }

    return result;
}

export function sortProjects(
    { sortBy, sortOrder }: Pick<Projects.GetProjects.RequestQuery, 'sortBy' | 'sortOrder'>,
    projects: ProjectWithTeams[]
): ProjectWithTeams[] {
    const order = sortOrder === 'desc' ? -1 : 1;
    switch (sortBy) {
        case 'name':
            return projects.toSorted((a, b) => order * a.name.localeCompare(b.name));
        case 'status':
            return projects.toSorted((a, b) => order * a.status.localeCompare(b.status));
        case 'startDate':
            return projects.toSorted((a, b) => order * (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
        case 'endDate': // optional
            return projects.toSorted((a, b) => {
                const endDateA = a.endDate ? new Date(a.endDate).getTime() : Number.POSITIVE_INFINITY;
                const endDateB = b.endDate ? new Date(b.endDate).getTime() : Number.POSITIVE_INFINITY;
                return order * (endDateA - endDateB);
            });
        case 'teamSize':
            return projects.toSorted((a, b) => order * (a.team.length - b.team.length));
        default: // unsorted
            return projects;
    }
}
