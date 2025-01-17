import { Router, Request, Response } from 'express';

import { Department, ErrorResponse } from '../contract-types/data-contracts';
import { Departments } from '../contract-types/DepartmentsRoute';
import { dbConnection } from '../lib/db/db-connection';
import { handleRouterError } from './core/error';
import { randomInt } from 'crypto';
import { DBDepartment } from '../lib/db/db-zod-schemas/department.schema';

const router = Router();

// GET /departments
router.get('/', async (
    req: Request<
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
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch departments',
        });
    }
});

// GET /departments/count
router.get('/count', async (
    req: Request<
        Departments.GetDepartmentsCount.RequestParams,
        Departments.GetDepartmentsCount.ResponseBody,
        Departments.GetDepartmentsCount.RequestBody,
        Departments.GetDepartmentsCount.RequestQuery
    >,
    res: Response<Departments.GetDepartmentsCount.ResponseBody | ErrorResponse>
) => {
    try {
        const count = await dbConnection.departments.count();
        res.json(count);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to count departments',
        });
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
        const department = await dbConnection.departments.findOne({ $match: { id: { $eq: departmentId } } });
        
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        res.json(department);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch department',
        });
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
        
        const newDepartment: DBDepartment = {
            id: randomInt(100000, 10000000),
            ...req.body,
        };
        
        const newRecord = await dbConnection.departments.insertOne(newDepartment);
        await dbConnection.departments.flush();
        
        res.status(201).json(newRecord);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to create department',
        });
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
        const departmentToUpdate = await dbConnection.departments.findOne({ $match: { id: { $eq: departmentId } } });
        
        if (!departmentToUpdate) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const updatedDepartment: Department = {
            ...departmentToUpdate,
            ...req.body,
            id: departmentId
        };

        await dbConnection.departments.replaceOne({ $match: { id: { $eq: departmentId } } }, updatedDepartment);
        await dbConnection.departments.flush();
        
        res.json(updatedDepartment);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to update department',
        });
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
        const departmentToDelete = await dbConnection.departments.findOne({ $match: { id: { $eq: departmentId } } });
        
        if (!departmentToDelete) {
            return res.status(404).json({ message: 'Department not found' });
        }

        await dbConnection.departments.deleteOne({ $match: { id: { $eq: departmentId } } });
        await dbConnection.departments.flush();
        res.status(204).send();
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to delete department',
        });
    }
});

export const departmentsRouter = router;
