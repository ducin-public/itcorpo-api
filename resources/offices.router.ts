import { Router, Request, Response } from 'express';

import { Office, OfficeAmenity, ErrorResponse, OfficesSearchCriteria } from '../contract-types/data-contracts';
import { Offices } from '../contract-types/OfficesRoute';
import { db } from '../lib/db';
import { processOfficesSearchCriteria } from './offices-search';

const router = Router();

// GET /offices/amenities/count
router.get('/amenities/count', async (_req, res) => {
    try {
        await db.read();
        res.json(db.data.officeAmenities.length);
    } catch (error) {
        res.status(500).json({ message: `Failed to count office amenities: ${error}` });
    }
});

// GET /offices/amenities
router.get('/amenities', async (
    _req: Request<
        Offices.GetOfficeAmenities.RequestParams,
        Offices.GetOfficeAmenities.ResponseBody,
        Offices.GetOfficeAmenities.RequestBody,
        Offices.GetOfficeAmenities.RequestQuery
    >,
    res: Response<Offices.GetOfficeAmenities.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        res.json(db.data.officeAmenities);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch office amenities: ${error}` });
    }
});

// GET /offices/count
router.get('/count', async (req, res) => {
    try {
        await db.read();
        const filteredOffices = processOfficesSearchCriteria({
            offices: db.data.offices,
            geo: db.data.geo,
            officeAmenities: db.data.officeAmenities
        }, req.query);
        res.json(filteredOffices.length);
    } catch (error) {
        res.status(500).json({ message: `Failed to count offices: ${error}` });
    }
});

// GET /offices
router.get('/', async (
    req: Request<
        Offices.GetOffices.RequestParams,
        Offices.GetOffices.ResponseBody,
        Offices.GetOffices.RequestBody,
        Offices.GetOffices.RequestQuery
    >,
    res: Response<Offices.GetOffices.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        const filteredOffices = processOfficesSearchCriteria({
            offices: db.data.offices,
            geo: db.data.geo,
            officeAmenities: db.data.officeAmenities
        }, req.query);
        res.json(filteredOffices);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch offices: ${error}` });
    }
});

// GET /offices/:officeCode
router.get('/:officeCode', async (
    req: Request<
        Offices.GetOfficeByCode.RequestParams,
        Offices.GetOfficeByCode.ResponseBody,
        Offices.GetOfficeByCode.RequestBody,
        Offices.GetOfficeByCode.RequestQuery
    >,
    res: Response<Offices.GetOfficeByCode.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        const office = db.data.offices.find(o => o.code === req.params.officeCode);
        
        if (!office) {
            return res.status(404).json({ message: 'Office not found' });
        }
        
        res.json(office);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch office: ${error}` });
    }
});

// POST /offices
router.post('/', async (
    req: Request<
        Offices.CreateOffice.RequestParams,
        Offices.CreateOffice.ResponseBody,
        Offices.CreateOffice.RequestBody,
        Offices.CreateOffice.RequestQuery
    >,
    res: Response<Offices.CreateOffice.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        
        if (db.data.offices.some(o => o.code === req.body.code)) {
            return res.status(400).json({ message: 'Office with this code already exists' });
        }
        
        const newOffice: Office = {
            ...req.body,
            amenities: req.body.amenities?.map(a => a.code) || []
        };
        
        db.data.offices.push(newOffice);
        await db.write();
        
        res.status(201).json(newOffice);
    } catch (error) {
        res.status(500).json({ message: `Failed to create office: ${error}` });
    }
});

// PUT /offices/:officeCode
router.put('/:officeCode', async (
    req: Request<
        Offices.UpdateOffice.RequestParams,
        Offices.UpdateOffice.ResponseBody,
        Offices.UpdateOffice.RequestBody,
        Offices.UpdateOffice.RequestQuery
    >,
    res: Response<Offices.UpdateOffice.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        const officeToUpdate = db.data.offices.find(o => o.code === req.params.officeCode);
        
        if (!officeToUpdate) {
            return res.status(404).json({ message: 'Office not found' });
        }

        const updatedOffice: Office = {
            ...officeToUpdate,
            ...req.body,
            code: req.params.officeCode,
            amenities: req.body.amenities?.map(a => a.code) || officeToUpdate.amenities
        };

        db.data.offices = db.data.offices.map(o => 
            o.code === req.params.officeCode ? updatedOffice : o
        );
        await db.write();
        
        res.json(updatedOffice);
    } catch (error) {
        res.status(500).json({ message: `Failed to update office: ${error}` });
    }
});

// DELETE /offices/:officeCode
router.delete('/:officeCode', async (
    req: Request<
        Offices.DeleteOffice.RequestParams,
        Offices.DeleteOffice.ResponseBody,
        Offices.DeleteOffice.RequestBody,
        Offices.DeleteOffice.RequestQuery
    >,
    res: Response<Offices.DeleteOffice.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        const officeCode = req.params.officeCode;
        const initialLength = db.data.offices.length;
        
        db.data.offices = db.data.offices.filter(o => o.code !== officeCode);
        
        if (db.data.offices.length === initialLength) {
            return res.status(404).json({ message: 'Office not found' });
        }
        
        await db.write();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: `Failed to delete office: ${error}` });
    }
});

export const officesRouter = router;
