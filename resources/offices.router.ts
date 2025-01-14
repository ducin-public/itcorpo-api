import { Router, Request, Response } from 'express';

import { Office, ErrorResponse } from '../contract-types/data-contracts';
import { Offices } from '../contract-types/OfficesRoute';
import { dbConnection } from '../lib/db/db-connection';
import { filterOffices } from './offices-filters';

const router = Router();

// GET /offices/amenities/count
router.get('/amenities/count', async (_req, res) => {
    try {
        const count = await dbConnection.officeAmenities.count();
        res.json(count);
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
        const offices = await dbConnection.officeAmenities.findMany();
        res.json(offices);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch office amenities: ${error}` });
    }
});

// GET /offices/count
router.get('/count', async (req, res) => {
    try {
        const officesPromise = dbConnection.offices.findMany();
        const amenitiesPromise = dbConnection.officeAmenities.findMany();
        const countriesPromise = dbConnection.countries.findMany();

        const filteredOffices = await filterOffices(req.query, {
            offices: await officesPromise,
            officeAmenities: await amenitiesPromise,
            countries: await countriesPromise
        });

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
        const officesPromise = dbConnection.offices.findMany();
        const amenitiesPromise = dbConnection.officeAmenities.findMany();
        const countriesPromise = dbConnection.countries.findMany();

        const filteredOffices = await filterOffices(req.query, {
            offices: await officesPromise,
            officeAmenities: await amenitiesPromise,
            countries: await countriesPromise
        });

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
        const officeByCode = await dbConnection.offices.findOne(o => o.code === req.params.officeCode);
        
        if (!officeByCode) {
            return res.status(404).json({ message: 'Office not found' });
        }
        
        res.json(officeByCode);
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
        const recordWithExistingCode = await dbConnection.offices.findOne(o => o.code === req.body.code);
        
        if (recordWithExistingCode) {
            return res.status(400).json({ message: 'Office with this code already exists' });
        }
        
        const newOffice: Office = {
            ...req.body,
            amenities: req.body.amenities?.map(a => a.code) || []
        };
        
        await dbConnection.offices.insertOne(newOffice);
        await dbConnection.offices.flush();
        
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
        const officeToUpdate = await dbConnection.offices.findOne(o => o.code === req.params.officeCode);
        
        if (!officeToUpdate) {
            return res.status(404).json({ message: 'Office not found' });
        }

        const updatedOffice: Office = {
            ...officeToUpdate,
            ...req.body,
            code: req.params.officeCode,
            amenities: req.body.amenities?.map(a => a.code) || officeToUpdate.amenities
        };

        await dbConnection.offices.replaceOne(o => o.code === req.params.officeCode, updatedOffice);
        await dbConnection.offices.flush();
        
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
        const officeToDelete = await dbConnection.offices.findOne(o => o.code === req.params.officeCode);
  
        if (!officeToDelete) {
            return res.status(404).json({ message: 'Office not found' });
        }

        await dbConnection.offices.deleteOne(o => o.code === req.params.officeCode);
        await dbConnection.offices.flush();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: `Failed to delete office: ${error}` });
    }
});

export const officesRouter = router;
