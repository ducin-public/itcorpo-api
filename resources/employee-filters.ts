import { Employees } from '../contract-types/EmployeesRoute';
import { DBDepartment } from '../lib/db/db-zod-schemas/department.schema';
import { DBEmployee } from '../lib/db/db-zod-schemas/employee.schema';
import { DBProjectTeam } from '../lib/db/db-zod-schemas/project-team.schema';

type EmployeeWithDepartmentAndProjectTeams = DBEmployee & {
    _department: DBDepartment[];
    _projectTeams: DBProjectTeam[];
};

/**
 * Filters employees based on provided criteria
 *
 * @param criteria - Search criteria for filtering employees
 *   @see {@link Employees.GetEmployees.RequestQuery}
 *   - group: Filter by employee group
 *   - employeeName: Filter by employee name (case-insensitive partial match)
 *   - departmentId: Filter by department ID
 *   - skills: Filter by required skills (comma-separated)
 *   - skillsFiltering: How to match skills ('ANY' or 'ALL', defaults to 'ANY')
 *   - salaryFrom: Filter by minimum salary
 *   - salaryTo: Filter by maximum salary
 * 
 * @param employees - Array of employees with their departments and project teams
 * @returns Filtered array of employees matching the criteria
 */
export function filterEmployees<TItem extends EmployeeWithDepartmentAndProjectTeams>(
    criteria: Employees.GetEmployees.RequestQuery,
    employees: TItem[]
): TItem[] {
    let result = [...employees];

    // Filter by employee name if provided
    if (criteria.employeeName) {
        const searchName = criteria.employeeName.toLowerCase();
        result = result.filter(employee => 
            `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchName)
        );
    }

    // Filter by department if provided
    if (criteria.departmentId) {
        const deptId = Number(criteria.departmentId);
        result = result.filter(employee => 
            employee._department.some(d => d.id === deptId)
        );
    }

    // Filter by skills if provided
    const skills = criteria.skills?.split(',');
    if (skills?.length) {
        const filtering = criteria.skillsFiltering || 'ANY';
        result = result.filter(employee =>
            filtering === 'ANY'
                ? skills.some(skill => employee.skills.includes(skill))
                : skills.every(skill => employee.skills.includes(skill))
        );
    }

    // Filter by salary range if provided
    if (criteria.salaryFrom) {
        const minSalary = Number(criteria.salaryFrom);
        result = result.filter(employee => employee.employment.currentSalary >= minSalary);
    }
    if (criteria.salaryTo) {
        const maxSalary = Number(criteria.salaryTo);
        result = result.filter(employee => employee.employment.currentSalary <= maxSalary);
    }

    // Filter by employee group if provided
    const group = (criteria.group || 'ACTIVE');
    type Group = typeof group;
    const UCGroup = group.toUpperCase() as Group;

    switch (UCGroup) {
        case 'ACTIVE':
            result = result.filter(employee => {
                return !employee.employment.endDate || new Date(employee.employment.endDate) >= new Date();
            });
            break;
        case "PAST":
            result = result.filter(employee => {
                return employee.employment.endDate && new Date(employee.employment.endDate) < new Date();
            });
            break;
        case "DEPARTING":
            result = result.filter(employee => {
                return employee.employment.endDate && new Date(employee.employment.endDate) >= new Date();
            });
            break;
        case "NEW_HIRES":
            result = result.filter(employee => {
                return employee.employment.startDate && new Date(employee.employment.startDate) > new Date();
            });
            break;
        case "JOBLESS":
            result = result.filter(employee => employee._projectTeams.length === 0);
            break;
        case "INVOLVED":
            result = result.filter(employee => employee._projectTeams.length > 0);
            break;
        default:
            let n: never = UCGroup;
            throw new Error(`Invalid group: ${UCGroup}`);
    }

    return result;
}
