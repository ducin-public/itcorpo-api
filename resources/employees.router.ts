import { Router, Request, Response } from 'express';
import { randomInt } from 'crypto';

import { ErrorResponse, ProjectEmployeeInvolvement } from '../contract-types/data-contracts';
import { Employees } from '../contract-types/EmployeesRoute';
import { dbConnection } from '../lib/db/db-connection';
import { filterEmployees } from './employee-filters';
import { handleRouterError } from './core/error';
import { employeeDTOFactory } from './employees-data-operations';
import { DBEmployee } from '../lib/db/db-zod-schemas/employee.schema';
import { getPaginationValues } from './core/pagination';
import { getDuration } from './core/time';

const router = Router();
const MAX_PAGE_SIZE = 50;

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
        const projectTeamsPromise = dbConnection.projectTeams.findMany();

        const filteredEmployees = filterEmployees(req.query, {
            employees: await employeesPromise,
            departments: await departmentsPromise,
            projectTeams: await projectTeamsPromise,
        });

        res.json(filteredEmployees.length);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to count employees',
        });
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
        const { page, pageSize } = getPaginationValues({ ...req.query, MAX_PAGE_SIZE });

        const [employees, departments, offices, projectTeams] = await Promise.all([
            dbConnection.employees.findMany(),
            dbConnection.departments.findMany(),
            dbConnection.offices.findMany(),
            dbConnection.projectTeams.findMany(),
        ]);
        
        let filteredEmployees = filterEmployees(req.query, { employees, departments, projectTeams });
        filteredEmployees = filteredEmployees.slice((page - 1) * pageSize, page * pageSize);
        
        const createEmployeeDTO = employeeDTOFactory({ departments, offices });
        const result = filteredEmployees.map(createEmployeeDTO);

        res.json(result);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch employees',
        });
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
        const [employee, departments, offices] = await Promise.all([
            dbConnection.employees.findOne({ $match: { id: { $eq: employeeId } } }),
            dbConnection.departments.findMany(),
            dbConnection.offices.findMany(),
        ]);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const createEmployeeDTO = employeeDTOFactory({ departments, offices });
        const result = createEmployeeDTO(employee);

        res.json(result);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch employee'
        });
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
        const employee = await dbConnection.employees.findOne({ $match: { id: { $eq: employeeId } } });
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const projectTeams = await dbConnection.projectTeams.findMany({ $match: { employeeId: { $eq: employeeId } } });
        const projects = await dbConnection.projects.findMany();
        
        const projectInvolvements: ProjectEmployeeInvolvement[] = projectTeams.map(involvement => {
            const project = projects.find(p => p.id === involvement.projectId)!;
            return {
                employeeId: employee.id,
                projectId: project.id,
                employeeName: `${employee.firstName} ${employee.lastName}`,
                projectName: project.name,
                projectStatus: project.status,
                engagementLevel: involvement.engagementLevel,
                startDate: involvement.startDate,
                endDate: involvement.endDate,
                duration: getDuration({
                    startDate: new Date(involvement.startDate),
                    endDate: involvement.endDate ? new Date(involvement.endDate) : new Date()
                })
            };
        });

        const department = await dbConnection.departments.findOne({ $match: { id: { $eq: employee.departmentId } }});
        if (!department) {
            throw new Error('Department not found');
        }

        const result = {
            employee: {
                id: employee.id,
                name: `${employee.firstName} ${employee.lastName}`,
                position: employee.position,
                department: department.name,
                imgURL: employee.imgURL,
            },
            projects: projectInvolvements
        }

        res.json(result);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch employee projects'
        });
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
        const payload: DBEmployee = {
            id: randomInt(100000, 10000000),
            ...req.body
        };
        
        const created = await dbConnection.employees.insertOne(payload);
        await dbConnection.employees.flush();

        const [departments, offices] = await Promise.all([
            dbConnection.departments.findMany(),
            dbConnection.offices.findMany(),
        ])
        const createEmployeeDTO = employeeDTOFactory({ departments, offices });
        const result = createEmployeeDTO(created);
        
        res.status(201).json(result);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to create employee',
        });
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
        const existingEmployee = await dbConnection.employees.findOne({ $match: { id: { $eq: employeeId } } });

        if (!existingEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const payload: DBEmployee = {
            ...req.body,
            id: employeeId
        };

        const replaced = await dbConnection.employees.replaceOne({ $match: { id: { $eq: employeeId } } }, payload);
        await dbConnection.employees.flush();
        
        const [departments, offices] = await Promise.all([
            dbConnection.departments.findMany(),
            dbConnection.offices.findMany(),
        ])
        const createEmployeeDTO = employeeDTOFactory({ departments, offices });
        const result = createEmployeeDTO(replaced!);
        
        res.json(result);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to update employee',
        });
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
        const employeeToDelete = await dbConnection.employees.findOne({ $match: { id: { $eq: employeeId } } });
        
        if (!employeeToDelete) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await dbConnection.employees.deleteOne({ $match: { id: { $eq: employeeId } } });
        await dbConnection.employees.flush();
        res.status(204).send();
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to delete employee',
        });
    }
});

export const employeesRouter = router;
