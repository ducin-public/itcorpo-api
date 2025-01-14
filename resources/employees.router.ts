import { Router, Request, Response } from 'express';
import { Employee, ErrorResponse, ProjectEmployeeInvolvement } from '../contract-types/data-contracts';
import { Employees } from '../contract-types/EmployeesRoute';
import { dbConnection } from '../lib/db/db-connection';
import { filterEmployees } from './employee-filters';
import { logger } from '../lib/logger';
import { getErrorGUID } from './core/error';

const router = Router();

// GET /employees/count
router.get('/count', async (
    req: Request<
        Employees.GetEmployeesCount.RequestParams,
        Employees.GetEmployeesCount.ResponseBody,
        Employees.GetEmployeesCount.RequestBody,
        Employees.GetEmployeesCount.RequestQuery
    >,
    res: Response<Employees.GetEmployeesCount.ResponseBody | ErrorResponse>
) => {
    try {
        const employeesPromise = dbConnection.employees.findMany();
        const departmentsPromise = dbConnection.departments.findMany();

        const filteredEmployees = filterEmployees(req.query, {
            employees: await employeesPromise,
            departments: await departmentsPromise
        });

        res.json(filteredEmployees.length);
    } catch (error) {
        const errorGUID = getErrorGUID();
        logger.error(`Failed to count employees: ${error}, errorGUID: ${errorGUID}`);
        res.status(500).json({ message: `Failed to count employees, errorGUID: ${errorGUID}` });
        if (error instanceof Error) {
            logger.error(error.stack);
        }
    }
});

// GET /employees
router.get('/', async (
    req: Request<
        Employees.GetEmployees.RequestParams,
        Employees.GetEmployees.ResponseBody,
        Employees.GetEmployees.RequestBody,
        Employees.GetEmployees.RequestQuery
    >,
    res: Response<Employees.GetEmployees.ResponseBody | ErrorResponse>
) => {
    try {
        const employeesPromise = dbConnection.employees.findMany();
        const departmentsPromise = dbConnection.departments.findMany();

        const filteredEmployees = filterEmployees(req.query, {
            employees: await employeesPromise,
            departments: await departmentsPromise
        });

        res.json(filteredEmployees);
    } catch (error) {
        const errorGUID = getErrorGUID();
        logger.error(`Failed to fetch employees: ${error}, errorGUID: ${errorGUID}`);
        res.status(500).json({ message: `Failed to fetch employees, errorGUID: ${errorGUID}` });
        if (error instanceof Error) {
            logger.error(error.stack);
        }
    }
});

// GET /employees/:employeeId
router.get('/:employeeId', async (
    req: Request<
        Employees.GetEmployeeById.RequestParams,
        Employees.GetEmployeeById.ResponseBody,
        Employees.GetEmployeeById.RequestBody,
        Employees.GetEmployeeById.RequestQuery
    >,
    res: Response<Employees.GetEmployeeById.ResponseBody | ErrorResponse>
) => {
    try {
        const employeeId = Number(req.params.employeeId);
        const employee = await dbConnection.employees.findOne(e => e.id === employeeId);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json(employee);
    } catch (error) {
        const errorGUID = getErrorGUID();
        logger.error(`Failed to fetch employee: ${error}, errorGUID: ${errorGUID}`);
        res.status(500).json({ message: `Failed to fetch employee, errorGUID: ${errorGUID}` });
        if (error instanceof Error) {
            logger.error(error.stack);
        }
    }
});

// GET /employees/:employeeId/projects
router.get('/:employeeId/projects', async (
    req: Request<
        Employees.GetEmployeeProjects.RequestParams,
        Employees.GetEmployeeProjects.ResponseBody,
        Employees.GetEmployeeProjects.RequestBody,
        Employees.GetEmployeeProjects.RequestQuery
    >,
    res: Response<Employees.GetEmployeeProjects.ResponseBody | ErrorResponse>
) => {
    try {
        const employeeId = Number(req.params.employeeId);
        const employee = await dbConnection.employees.findOne(e => e.id === employeeId);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const projectTeams = await dbConnection.projectTeams.findMany(pt => pt.employeeId === employeeId);
        const projects = await dbConnection.projects.findMany();
        
        const projectInvolvements: ProjectEmployeeInvolvement[] = projectTeams.map(assignment => {
            const project = projects.find(p => p.id === assignment.projectId)!;
            return {
                employeeId: employee.id,
                projectId: project.id,
                employeeName: `${employee.firstName} ${employee.lastName}`,
                projectName: project.name,
                projectStatus: project.status,
                engagementLevel: assignment.engagementLevel,
                since: assignment.since
            };
        });

        res.json(projectInvolvements);
    } catch (error) {
        const errorGUID = getErrorGUID();
        logger.error(`Failed to fetch employee projects: ${error}, errorGUID: ${errorGUID}`);
        res.status(500).json({ message: `Failed to fetch employee projects, errorGUID: ${errorGUID}` });
        if (error instanceof Error) {
            logger.error(error.stack);
        }
    }
});

// POST /employees
router.post('/', async (
    req: Request<
        Employees.CreateEmployee.RequestParams,
        Employees.CreateEmployee.ResponseBody,
        Employees.CreateEmployee.RequestBody,
        Employees.CreateEmployee.RequestQuery
    >,
    res: Response<Employees.CreateEmployee.ResponseBody | ErrorResponse>
) => {
    try {
        const employees = await dbConnection.employees.findMany();
        const newId = Math.max(...employees.map(e => e.id), 0) + 1;
        
        const newEmployee = {
            ...req.body
        };
        
        const newRecord = await dbConnection.employees.insertOne(newEmployee);
        await dbConnection.employees.flush();
        
        res.status(201).json(newRecord);
    } catch (error) {
        const errorGUID = getErrorGUID();
        logger.error(`Failed to create employee: ${error}, errorGUID: ${errorGUID}`);
        res.status(500).json({ message: `Failed to create employee, errorGUID: ${errorGUID}` });
        if (error instanceof Error) {
            logger.error(error.stack);
        }
    }
});

// PUT /employees/:employeeId
router.put('/:employeeId', async (
    req: Request<
        Employees.UpdateEmployee.RequestParams,
        Employees.UpdateEmployee.ResponseBody,
        Employees.UpdateEmployee.RequestBody,
        Employees.UpdateEmployee.RequestQuery
    >,
    res: Response<Employees.UpdateEmployee.ResponseBody | ErrorResponse>
) => {
    try {
        const employeeId = Number(req.params.employeeId);
        const employeeToUpdate = await dbConnection.employees.findOne(e => e.id === employeeId);
        
        if (!employeeToUpdate) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const updatedEmployee: Employee = {
            ...employeeToUpdate,
            ...req.body,
            id: employeeId
        };

        await dbConnection.employees.replaceOne(e => e.id === employeeId, updatedEmployee);
        await dbConnection.employees.flush();
        
        res.json(updatedEmployee);
    } catch (error) {
        const errorGUID = getErrorGUID();
        logger.error(`Failed to update employee: ${error}, errorGUID: ${errorGUID}`);
        res.status(500).json({ message: `Failed to update employee, errorGUID: ${errorGUID}` });
        if (error instanceof Error) {
            logger.error(error.stack);
        }
    }
});

// DELETE /employees/:employeeId
router.delete('/:employeeId', async (
    req: Request<
        Employees.DeleteEmployee.RequestParams,
        Employees.DeleteEmployee.ResponseBody,
        Employees.DeleteEmployee.RequestBody,
        Employees.DeleteEmployee.RequestQuery
    >,
    res: Response<Employees.DeleteEmployee.ResponseBody | ErrorResponse>
) => {
    try {
        const employeeId = Number(req.params.employeeId);
        const employeeToDelete = await dbConnection.employees.findOne(e => e.id === employeeId);
        
        if (!employeeToDelete) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await dbConnection.employees.deleteOne(e => e.id === employeeId);
        await dbConnection.employees.flush();
        res.status(204).send();
    } catch (error) {
        const errorGUID = getErrorGUID();
        logger.error(`Failed to delete employee: ${error}, errorGUID: ${errorGUID}`);
        res.status(500).json({ message: `Failed to delete employee, errorGUID: ${errorGUID}` });
        if (error instanceof Error) {
            logger.error(error.stack);
        }
    }
});

export const employeesRouter = router;
