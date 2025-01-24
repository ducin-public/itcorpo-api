import { Employees } from '../contract-types/EmployeesRoute';
import { DBDepartment } from '../lib/db/db-zod-schemas/department.schema';
import { DBEmployee } from '../lib/db/db-zod-schemas/employee.schema';

/**
 * Filters employees based on provided criteria
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
 * @param collections - Collection of data required for filtering
 * 
 * @returns Filtered array of employees matching the criteria
 *   @see {@link DBEmployee}
 */
export function filterEmployees(
    criteria: Employees.GetEmployees.RequestQuery,
    collections: {
        departments: DBDepartment[];
        employees: DBEmployee[];
    }
): DBEmployee[] {
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
        result = result.filter(employee => employee.departmentId === deptId);
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

    return result;
}
