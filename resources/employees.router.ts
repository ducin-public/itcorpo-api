import { Router, Request, Response } from 'express';
import { Employee, ErrorResponse, ProjectEmployeeInvolvement } from '../contract-types/data-contracts';
import { Employees } from '../contract-types/EmployeesRoute';
import { db } from '../lib/db/db-connection';
import { processEmployeesSearchCriteria } from './employee-search';

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
        await db.read();
        const filteredEmployees = processEmployeesSearchCriteria({
            employees: db.data.employees,
            departments: db.data.departments
        }, req.query);
        res.json(filteredEmployees.length);
    } catch (error) {
        res.status(500).json({ message: `Failed to count employees: ${error}` });
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
        await db.read();
        let filteredEmployees = processEmployeesSearchCriteria({
            employees: db.data.employees,
            departments: db.data.departments
        }, req.query);
        res.json(filteredEmployees);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch employees: ${error}` });
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
        await db.read();
        const employeeId = Number(req.params.employeeId);
        
        const employee = db.data.employees.find(e => e.id === employeeId);
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch employee: ${error}` });
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
        await db.read();
        const employeeId = Number(req.params.employeeId);
        
        const employee = db.data.employees.find(e => e.id === employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const projectInvolvements: ProjectEmployeeInvolvement[] = db.data.projectTeams
            .filter(assignment => assignment.employeeId === employeeId)
            .map(assignment => {
                const project = db.data.projects.find(p => p.id === assignment.projectId)!;
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
        res.status(500).json({ message: `Failed to fetch employee projects: ${error}` });
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
        await db.read();
        const employeeData = { ...req.body };
        
        // const newId = Math.max(...db.data.employees.map(e => e.id), 0) + 1;
        const newEmployee: Employee = {
            ...employeeData,
            id: db.getNextId('employees')
        };
        
        db.data.employees.push(newEmployee);
        await db.write();
        
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: `Failed to create employee: ${error}` });
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
        await db.read();
        const employeeId = Number(req.params.employeeId);
        const employeeData = { ...req.body };
        const employeeToUpdate = db.data.employees.find(e => e.id === employeeId);
        
        if (!employeeToUpdate) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const updatedEmployee: Employee = {
            ...employeeToUpdate,
            ...employeeData,
            id: employeeId
        };

        db.data.employees = db.data.employees.map(e => 
            e.id === employeeId ? updatedEmployee : e
        );
        await db.write();
        
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: `Failed to update employee: ${error}` });
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
        await db.read();
        const employeeId = Number(req.params.employeeId);
        const initialLength = db.data.employees.length;
        
        db.data.employees = db.data.employees.filter(e => e.id !== employeeId);
        
        if (db.data.employees.length === initialLength) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        await db.write();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: `Failed to delete employee: ${error}` });
    }
});

export const employeesRouter = router;
