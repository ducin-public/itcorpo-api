import { DbSchema } from '../lib/db-schema';
import { EngagementLevel } from '../contract-types/data-contracts';

// export enum EngagementLevel {
//     FULL_TIME = 'FULL_TIME',       // 100%-75%
//     PARTIAL_PLUS = 'PARTIAL_PLUS', // 75%-50%
//     HALF_TIME = 'HALF_TIME',       // 50%-25%
//     ON_DEMAND = 'ON_DEMAND'        // <25%
// }

type TeamRoleCode = 
    | 'DEVELOPER' 
    | 'TECH_LEAD' 
    | 'PROJECT_MANAGER'
    | 'SCRUM_MASTER'
    | 'BUSINESS_ANALYST'
    | 'QA_ENGINEER'
    | 'DEVOPS_ENGINEER';

interface TeamRole {
    code: TeamRoleCode;
    name: string;
}

const TEAM_ROLES: TeamRole[] = [
    { code: 'DEVELOPER', name: 'Developer' },
    { code: 'TECH_LEAD', name: 'Technical Lead' },
    { code: 'PROJECT_MANAGER', name: 'Project Manager' },
    { code: 'SCRUM_MASTER', name: 'Scrum Master' },
    { code: 'BUSINESS_ANALYST', name: 'Business Analyst' },
    { code: 'QA_ENGINEER', name: 'Quality Assurance Engineer' },
    { code: 'DEVOPS_ENGINEER', name: 'DevOps Engineer' }
];

interface AllocationRate {
    employeeId: string;
    projectId: string;
    engagementLevel: EngagementLevel;
}

interface EmployeeProjectInvolvement {
    employeeId: string;
    projectId: string;
    teamRole: TeamRole;
    allocation: AllocationRate;
    startDate: string;
    endDate: string | null;
}

const generateRandomEngagementLevel = (): EngagementLevel => {
    const percentage = Math.floor(Math.random() * 100) + 1;
    return percentage >= 75 ? EngagementLevel.FULL_TIME
         : percentage >= 50 ? EngagementLevel.PARTIAL_PLUS
         : percentage >= 25 ? EngagementLevel.HALF_TIME
         : EngagementLevel.ON_DEMAND;
};

const generateAllocation = (employeeId: string, projectId: string): AllocationRate => ({
    employeeId,
    projectId,
    engagementLevel: generateRandomEngagementLevel()
});

const generateEmployeeProjectInvolvement = (dbContent: DbSchema): EmployeeProjectInvolvement[] => {
    const involvements: EmployeeProjectInvolvement[] = [];
    
    dbContent.projects.forEach(project => {
        project.team.forEach((employeeId, index) => {
            const teamRole = index === 0 ? TEAM_ROLES.find(r => r.code === 'PROJECT_MANAGER')!
                         : index === 1 ? TEAM_ROLES.find(r => r.code === 'TECH_LEAD')!
                         : index === 2 ? TEAM_ROLES.find(r => r.code === 'DEVELOPER')!
                         : TEAM_ROLES[Math.floor(Math.random() * TEAM_ROLES.length)];
            
            const startDate = new Date();
            startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 24));
            
            involvements.push({
                employeeId,
                projectId: project.id,
                teamRole,
                allocation: generateAllocation(employeeId, project.id),
                startDate: startDate.toISOString().split('T')[0],
                endDate: null
            });
        });
    });
    
    console.log(`Generated ${involvements.length} employee project involvements`);
    return involvements;
}

export { 
    generateEmployeeProjectInvolvement, 
    generateAllocation,
    generateRandomEngagementLevel,
    TeamRole, 
    TeamRoleCode, 
    TEAM_ROLES, 
    AllocationRate, 
    EngagementLevel 
};
