import { DBDepartment } from "../lib/db/db-zod-schemas/department.schema";
import { DBEmployee } from "../lib/db/db-zod-schemas/employee.schema";

export const mergeWithDepartment = (employee: DBEmployee, departments: DBDepartment[]) => {
    const department = departments.find(d => d.id === employee.departmentId);
    if (!department) {
        throw new Error(`Department not found for ID: ${employee.departmentId}`);
    }
    const { departmentId, ...rest } = employee;
    
    return {
        ...rest,
        department: department.name
    };
}
