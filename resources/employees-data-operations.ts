/**
 * Merges an employee object with department data, assigning department name.
 * @see {@link DBDepartment}
 */
export function mergeWithDepartment(employee: DBEmployee, departments: DBDepartment[]): DBEmployee & { department: string | null } {
  const dept = departments.find(d => d.id === employee.departmentId);
  if (!dept) {
    // Optionally log a warning here if needed
    return { ...employee, department: null };
  }
  return { ...employee, department: dept.name };
}

import { Employee, EmployeeSearchFeed } from "../contract-types/data-contracts";
import { DBDepartment } from "../lib/db/db-zod-schemas/department.schema";
import { DBEmployee } from "../lib/db/db-zod-schemas/employee.schema";
import { DBOffice } from "../lib/db/db-zod-schemas/office.schema";
import { stripObjectProps } from "./core/objects";
import { getDuration } from "./core/time";
import { DBProjectTeam } from "../lib/db/db-zod-schemas/project-team.schema";

export const employeeAge = (employee: DBEmployee) => {
    const age = new Date().getFullYear() - new Date(employee.personalInfo.dateOfBirth).getFullYear();
    return age;
}

export const employeeName = (employee: DBEmployee) => {
    const name = `${employee.firstName} ${employee.lastName}`;
    return name;
}

export const employeeEmployedFor = (employee: DBEmployee) => {
  return getDuration({
    startDate: new Date(employee.employment.startDate),
    endDate: employee.employment.endDate ? new Date(employee.employment.endDate) : new Date()
  })
}

export const reorderPersonalInfo = (personalInfo: Employee['personalInfo']) => {
  const { email, phone, age, address, ...rest } = personalInfo;
  return { email, phone, age, address, ...rest };
}
  
const reorderProperties = (employee: Employee): Employee => {
  const { id, nationality, department, office, keycardId, name, position, email, personalInfo, ...rest } = employee;
  return { id, nationality, department, office, keycardId, name, position, email, ...rest, personalInfo: reorderPersonalInfo(personalInfo) };
}

type EmployeeWithDepartmentAndOffice = DBEmployee & {
    _department: DBDepartment[];
    _office: DBOffice[];
    _projectTeams?: DBProjectTeam[];
};

export const employeeDTOFactory = (employee: EmployeeWithDepartmentAndOffice): Employee => {
    const result = {
        ...employee,
        department: employee._department[0].name,
        office: `${employee._office[0].city}, ${employee._office[0].country}`,
        name: employeeName(employee),
        employment: {
            ...employee.employment,
            employedFor: employeeEmployedFor(employee)
        },
        personalInfo: {
            ...stripObjectProps(employee.personalInfo, ['dateOfBirth']),
            age: employeeAge(employee)
        }
    } satisfies Employee;

    const stripped = stripObjectProps(result, ['_department', '_office', '_projectTeams']);

    return reorderProperties(stripped);
}

export const employeeSearchFeedDTOFactory = (employee: DBEmployee): EmployeeSearchFeed => {
  return {
    id: employee.id,
    name: employeeName(employee),
  }
}
