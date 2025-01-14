import { DBConnection } from '../lib/db/db-connection';
import { logger } from '../lib/logger'

export async function migrateEmployees (dbConnection: DBConnection) {
  const allEmployees = await dbConnection.employees.findMany();
  logger.debug(`Found ${allEmployees.length} employees to process`);

//   const departmentIdToName = dbConnection.departments.reduce((acc, department) => {
//     acc[department.id] = department.name
//     return acc
//   }, {} as Record<number, string>)

  const newEmployees = allEmployees.map(employee => {
    //     const departmentId = (employee as any).departmentId
    //     const departmentName = departmentIdToName[departmentId]
    //     if (!departmentName) {
    //       logger.warn(`Department not found for employee ${employee.id}`)
    //     }
    // delete (employee as any).departmentId;

    const { id, nationality, department, ...rest } = employee;
    return { id, nationality, department, ...rest };
  });

  await dbConnection.employees.deleteMany();
  await dbConnection.employees.insertMany(newEmployees);
  await dbConnection.employees.validateInMemory();

  await dbConnection.employees.flush();
  logger.info(`Migrated ${allEmployees.length} employees`);
}
