import { Employee } from '../contract-types/data-contracts';
import { Employees } from '../contract-types/EmployeesRoute';
import { DbSchema } from '../lib/db/db-schema';

/**
 * Processes employees search criteria and filters employees based on provided criteria
 * 
 * @param collections - Database collections required for employee search
 *   @see {@link DbSchema}
 * 
 * @param criteria - Search criteria for filtering employees
 *   @see {@link Employees.GetEmployees.RequestQuery}
 *   - employeeName: Filter by employee name (case-insensitive partial match)
 *   - departmentId: Filter by department ID
 *   - skills: Filter by required skills (comma-separated)
 *   - skillsFiltering: How to match skills ('ANY' or 'ALL', defaults to 'ANY')
 *   - salaryFrom: Filter by minimum salary
 *   - salaryTo: Filter by maximum salary
 * 
 * @returns Filtered array of employees matching the criteria
 *   @see {@link Employee}
 */
export function processEmployeesSearchCriteria(
    collections: Pick<DbSchema, 'employees' | 'departments'>,
    criteria: Employees.GetEmployees.RequestQuery
): Employee[] {
    let result = [...collections.employees];

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
            employee.department === collections.departments.find(d => d.id === deptId)?.name
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
        result = result.filter(employee => employee.salary >= minSalary);
    }
    if (criteria.salaryTo) {
        const maxSalary = Number(criteria.salaryTo);
        result = result.filter(employee => employee.salary <= maxSalary);
    }

    return result;
}
