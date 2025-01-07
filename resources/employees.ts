import { Router, Request, Response } from 'express';
import { Employee, ErrorResponse, EmployeesSearchCriteria } from '../contract-types/data-contracts';
import { Employees } from '../contract-types/EmployeesRoute';
import { db } from '../lib/db';

const router = Router();

function processEmployeesSearchCriteria(employees: Employee[], criteria: EmployeesSearchCriteria): Employee[] {
    let result = [...employees];

    // Filter by employee name if provided
    if (criteria.employeeName) {
        const searchName = criteria.employeeName.toLowerCase();
        result = result.filter(employee => 
            `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchName)
        );
    }

    // Filter by department if provided
    if (criteria.departmentId) {
        const deptId = Number(criteria.departmentId);
        result = result.filter(employee => 
            employee.department === db.data.departments.find(d => d.id === deptId)?.name
        );
    }

    // Filter by skills if provided
    const skills = criteria.skills?.split(',');
    if (skills?.length) {
        result = result.filter(employee => 
            skills.every(skill => employee.skills.includes(skill))
        );
    }

    // Filter by salary range if provided
    if (criteria.salaryFrom) {
        const minSalary = Number(criteria.salaryFrom);
        result = result.filter(employee => employee.salary >= minSalary);
    }
    if (criteria.salaryTo) {
        const maxSalary = Number(criteria.salaryTo);
        result = result.filter(employee => employee.salary <= maxSalary);
    }

    return result;
}

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
        const filteredEmployees = processEmployeesSearchCriteria(db.data.employees, req.query);
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
        let filteredEmployees = processEmployeesSearchCriteria(db.data.employees, req.query);
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
