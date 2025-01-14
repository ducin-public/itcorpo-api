import { Router, Request, Response } from 'express';

import { Department, DepartmentInput, ErrorResponse } from '../contract-types/data-contracts';
import { Departments } from '../contract-types/DepartmentsRoute';
import { dbConnection } from '../lib/db/db-connection';

const router = Router();

// GET /departments
router.get('/', async (
    _req: Request<
        Departments.GetDepartments.RequestParams,
        Departments.GetDepartments.ResponseBody,
        Departments.GetDepartments.RequestBody,
        Departments.GetDepartments.RequestQuery
    >,
    res: Response<Departments.GetDepartments.ResponseBody | ErrorResponse>
) => {
    try {
        const departments = await dbConnection.departments.findMany();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch departments: ${error}` });
    }
});

// GET /departments/count
router.get('/count', async (_req, res) => {
    try {
        const count = await dbConnection.departments.count();
        res.json(count);
    } catch (error) {
        res.status(500).json({ message: `Failed to count departments: ${error}` });
    }
});

// GET /departments/:departmentId
router.get('/:departmentId', async (
    req: Request<
        Departments.GetDepartmentById.RequestParams,
        Departments.GetDepartmentById.ResponseBody,
        Departments.GetDepartmentById.RequestBody,
        Departments.GetDepartmentById.RequestQuery
    >,
    res: Response<Departments.GetDepartmentById.ResponseBody | ErrorResponse>
) => {
    try {
        const departmentId = Number(req.params.departmentId);
        const department = await dbConnection.departments.findOne(d => d.id === departmentId);
        
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch department: ${error}` });
    }
});

// POST /departments
router.post('/', async (
    req: Request<
        Departments.CreateDepartment.RequestParams,
        Departments.CreateDepartment.ResponseBody,
        Departments.CreateDepartment.RequestBody,
        Departments.CreateDepartment.RequestQuery
    >,
    res: Response<Departments.CreateDepartment.ResponseBody | ErrorResponse>
) => {
    try {
        
        const newDepartment: DepartmentInput = {
            ...req.body,
        };
        
        const newRecord = await dbConnection.departments.insertOne(newDepartment);
        await dbConnection.departments.flush();
        
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: `Failed to create department: ${error}` });
    }
});

// PUT /departments/:departmentId
router.put('/:departmentId', async (
    req: Request<
        Departments.UpdateDepartment.RequestParams,
        Departments.UpdateDepartment.ResponseBody,
        Departments.UpdateDepartment.RequestBody,
        Departments.UpdateDepartment.RequestQuery
    >,
    res: Response<Departments.UpdateDepartment.ResponseBody | ErrorResponse>
) => {
    try {
        const departmentId = Number(req.params.departmentId);
        const departmentToUpdate = await dbConnection.departments.findOne(d => d.id === departmentId);
        
        if (!departmentToUpdate) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const updatedDepartment: Department = {
            ...departmentToUpdate,
            ...req.body,
            id: departmentId
        };

        await dbConnection.departments.replaceOne(d => d.id === departmentId, updatedDepartment);
        await dbConnection.departments.flush();
        
        res.json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ message: `Failed to update department: ${error}` });
    }
});

// DELETE /departments/:departmentId
router.delete('/:departmentId', async (
    req: Request<
        Departments.DeleteDepartment.RequestParams,
        Departments.DeleteDepartment.ResponseBody,
        Departments.DeleteDepartment.RequestBody,
        Departments.DeleteDepartment.RequestQuery
    >,
    res: Response<Departments.DeleteDepartment.ResponseBody | ErrorResponse>
) => {
    try {
        const departmentId = Number(req.params.departmentId);
        const departmentToDelete = await dbConnection.departments.findOne(d => d.id === departmentId);
        
        if (!departmentToDelete) {
            return res.status(404).json({ message: 'Department not found' });
        }

        await dbConnection.departments.deleteOne(d => d.id === departmentId);
        await dbConnection.departments.flush();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: `Failed to delete department: ${error}` });
    }
});

export const departmentsRouter = router;
