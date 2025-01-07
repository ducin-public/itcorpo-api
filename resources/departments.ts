import { Router, Request, Response } from 'express';

import { Department, ErrorResponse } from '../contract-types/data-contracts';
import { Departments } from '../contract-types/DepartmentsRoute';
import { db } from './db';

const router = Router();

function getNextId(departments: Department[]): Department['id'] {
    return departments.reduce((max, dept) => Math.max(max, dept.id), 0) + 1;
}

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
        await db.read();
        res.json(db.data.departments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch departments' });
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
        await db.read();
        const department = db.data.departments.find(
            d => d.id === Number(req.params.departmentId)
        );
        
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch department' });
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
        await db.read();
        const newDepartment: Department = {
            id: getNextId(db.data.departments),
            ...req.body
        };
        
        db.data.departments.push(newDepartment);
        await db.write();
        
        res.status(201).json(newDepartment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create department' });
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
        await db.read();
        const departmentId = Number(req.params.departmentId);
        const index = db.data.departments.findIndex(d => d.id === departmentId);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Department not found' });
        }

        db.data.departments[index] = {
            ...db.data.departments[index],
            ...req.body
        };
        await db.write();
        
        res.json(db.data.departments[index]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update department' });
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
        await db.read();
        const departmentId = Number(req.params.departmentId);
        const initialLength = db.data.departments.length;
        
        db.data.departments = db.data.departments.filter(d => d.id !== departmentId);
        
        if (db.data.departments.length === initialLength) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        await db.write();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete department' });
    }
});

export const departmentsRouter = router;
