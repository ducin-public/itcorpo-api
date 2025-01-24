import e from 'express';
import { DBConnection } from '../lib/db/db-connection';
import { DBEmployee } from '../lib/db/db-zod-schemas/employee.schema';
import { logger } from '../lib/logger';

const formatDates = (employee: DBEmployee): DBEmployee => {
  employee.employment.startDate = new Date(employee.employment.startDate).toISOString();
  if (employee.employment.endDate) {
    employee.employment.endDate = new Date(employee.employment.endDate).toISOString();
  }
  employee.personalInfo.dateOfBirth = new Date(employee.personalInfo.dateOfBirth).toISOString();
  return employee;
}

export const reorderPersonalInfo = (personalInfo: DBEmployee['personalInfo']) => {
  const { email, phone, dateOfBirth, address, ...rest } = personalInfo;
  return { email, phone, dateOfBirth, address, ...rest };
}

const reorderProperties = (employee: DBEmployee): DBEmployee => {
  const { id, nationality, departmentId, officeCode, keycardId, firstName, lastName, position, email, personalInfo, ...rest } = employee;
  return { id, nationality, departmentId, officeCode, keycardId, firstName, lastName, position, email, ...rest, personalInfo: reorderPersonalInfo(personalInfo) };
}

const updateEmployee = (employee: DBEmployee): DBEmployee => {
  const employment = {
    contractType: (employee as any).contractType,
    currentSalary: (employee as any).salary,
    startDate: (employee as any).hiredAt,
    endDate: (employee as any).expiresAt
  }
  employee.employment = employment;
  delete (employee as any).contractType;
  delete (employee as any).salary;
  delete (employee as any).hiredAt;
  delete (employee as any).expiresAt;
  return employee
};

export async function migrateEmployees(dbConnection: DBConnection) {
  const [allEmployees, offices] = await Promise.all([
    dbConnection.employees.findMany(),
    dbConnection.offices.findMany()
  ]);
  
  logger.debug(`Found ${allEmployees.length} employees to process`);
  logger.debug(`Found ${offices.length} offices for reference`);

  const newEmployees = allEmployees.map(employee => reorderProperties(updateEmployee(employee)));

  await dbConnection.employees.deleteMany();
  await dbConnection.employees.insertMany(newEmployees);
  await dbConnection.employees.validateInMemory();

  await dbConnection.employees.flush();
  logger.info(`Migrated ${allEmployees.length} employees`);
}
