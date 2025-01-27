import { Employee } from "../contract-types/data-contracts";
import { DBDepartment } from "../lib/db/db-zod-schemas/department.schema";
import { DBEmployee } from "../lib/db/db-zod-schemas/employee.schema";
import { DBOffice } from "../lib/db/db-zod-schemas/office.schema";
import { getDuration } from "./core/time";

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

export const mergeWithOffice = (employee: DBEmployee, offices: DBOffice[]) => {
    const office = offices.find(o => o.code === employee.officeCode);
    if (!office) {
        throw new Error(`Office not found for code: ${employee.officeCode}`);
    }
    const { officeCode, ...rest } = employee;

    return {
        ...rest,
        office: `${office.city}, ${office.country}`
    };
}

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

type FactoryParams = {
  departments: DBDepartment[];
  offices: DBOffice[];
}
export const employeeDTOFactory = ({ departments, offices }: FactoryParams) =>
    (employee: DBEmployee): Employee => {
        // department
        const department = departments.find(d => d.id === employee.departmentId);
        if (!department) {
            throw new Error(`Department not found for ID: ${employee.departmentId}`);
        }

        // office
        const office = offices.find(o => o.code === employee.officeCode);
        if (!office) {
            throw new Error(`Office not found for code: ${employee.officeCode}`);
        }

        const {
            officeCode, departmentId, firstName, lastName,
            personalInfo: { dateOfBirth, ...personalInfoRest},
            employment,
            ...employeeRest
        } = employee;

        const result = {
            ...employeeRest,
            department: department.name,
            office: `${office.city}, ${office.country}`,
            name: employeeName(employee),
            employment: {
                ...employment,
                employedFor: employeeEmployedFor(employee)
            },
            personalInfo: {
                ...personalInfoRest,
                age: employeeAge(employee)
            }
        } satisfies Employee;

        return reorderProperties(result);
    }
