import { Project } from '../contract-types/data-contracts';
import { DBProject, DBProjectTeam } from '../lib/db-schema';

export const attachTeamToProject = (project: DBProject, projectTeams: DBProjectTeam[]): Project => {
    const teamMembers = projectTeams
        .filter(pt => pt.projectId === project.id)
        .map(pt => ({
            id: pt.employeeId,
            name: pt.employeeName
        }));
    
    return {
        ...project,
        team: teamMembers
    };
};

export const attachTeamToAllProjects = (projects: DBProject[], projectTeams: DBProjectTeam[]): Project[] => {
    // Create a Map of project teams grouped by projectId for O(1) lookup
    const teamsByProject = new Map<string, { id: number; name: string; }[]>();
    
    // Group team members by project - O(n) where n is number of team members
    projectTeams.forEach(pt => {
        const team = teamsByProject.get(pt.projectId) || [];
        team.push({
            id: pt.employeeId,
            name: pt.employeeName
        });
        teamsByProject.set(pt.projectId, team);
    });
    
    // Attach teams to projects - O(m) where m is number of projects
    return projects.map(project => ({
        ...project,
        team: teamsByProject.get(project.id) || []
    }));
};
