import { DatabaseContent } from './migration-types'
import { logger } from '../lib/logger'

export const migrateEmployees = (db: DatabaseContent) => {
    logger.debug(`Found ${db.employees.length} employees to process`);

//   const departmentIdToName = db.departments.reduce((acc, department) => {
//     acc[department.id] = department.name
//     return acc
//   }, {} as Record<number, string>)
  
  return db.employees.map(employee => {
//     const departmentId = (employee as any).departmentId
//     const departmentName = departmentIdToName[departmentId]

//     if (!departmentName) {
//       logger.warn(`Department not found for employee ${employee.id}`)
//     }

    // delete (employee as any).departmentId;

    const { id, nationality, department, ...rest } = employee;

    return {
        id, nationality, department, ...rest
    }
  })
}
