import { DBConnection } from '../lib/db/db-connection';
import { DBEmployee } from '../lib/db/db-zod-schemas/employee.schema';
import { logger } from '../lib/logger'

const updateEmployee = (employee: DBEmployee): DBEmployee => {
    // const { id, nationality, contractType, departmentId, ...rest } = employee;
    // return {
    //   id, nationality, contractType, departmentId, ...rest
    // }
    employee.expiresAt = new Date(employee.expiresAt).toISOString();
    employee.hiredAt = new Date(employee.hiredAt).toISOString();
    employee.personalInfo.dateOfBirth = new Date(employee.personalInfo.dateOfBirth).toISOString();
    return employee
}

export async function migrateEmployees (dbConnection: DBConnection) {
  const allEmployees = await dbConnection.employees.findMany();
  logger.debug(`Found ${allEmployees.length} employees to process`);

  const newEmployees = allEmployees.map(updateEmployee);

  await dbConnection.employees.deleteMany();
  await dbConnection.employees.insertMany(newEmployees);
  await dbConnection.employees.validateInMemory();

  await dbConnection.employees.flush();
  logger.info(`Migrated ${allEmployees.length} employees`);
}
