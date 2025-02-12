import { Router, Request, Response } from 'express';

import { ErrorResponse } from '../contract-types/data-contracts';
import { Offices } from '../contract-types/OfficesRoute';
import { dbConnection } from '../lib/db/db-connection';
import { filterOffices } from './offices-filters';
import { handleRouterError } from './core/error';
import { DBOffice } from '../lib/db/db-zod-schemas/office.schema';
import { stripObjectProps } from './core/objects';

const router = Router();

// GET /offices/amenities/count
router.get('/amenities/count', async (
    req: Request<
        Offices.GetOfficeAmenitiesCount.RequestParams,
        Offices.GetOfficeAmenitiesCount.ResponseBody,
        Offices.GetOfficeAmenitiesCount.RequestBody,
        Offices.GetOfficeAmenitiesCount.RequestQuery
    >,
    res: Response<Offices.GetOfficeAmenitiesCount.ResponseBody | ErrorResponse>
) => {
    try {
        const count = await dbConnection.officeAmenities.count();
        res.json(count);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to count office amenities',
        });
    }
});

// GET /offices/amenities
router.get('/amenities', async (
    req: Request<
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
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch office amenities',
        });
    }
});

// GET /offices/count
router.get('/count', async (
    req: Request<
        Offices.GetOfficesCount.RequestParams,
        Offices.GetOfficesCount.ResponseBody,
        Offices.GetOfficesCount.RequestBody,
        Offices.GetOfficesCount.RequestQuery
    >,
    res: Response<Offices.GetOfficesCount.ResponseBody | ErrorResponse>
) => {
    try {
        const officesWithData = await dbConnection.offices.aggregate([
            {
                $lookup: {
                    from: "officeAmenities" as const,
                    localField: "amenities",
                    foreignField: "code",
                    as: "_amenities" as const
                }
            },
            {
                $lookup: {
                    from: "countries" as const,
                    localField: "country",
                    foreignField: "name",
                    as: "_country" as const
                }
            }
        ]);

        const filteredOffices = await filterOffices(req.query, officesWithData);
        res.json(filteredOffices.length);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to count offices',
        });
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
        const officesWithData = await dbConnection.offices.aggregate([
            {
                $lookup: {
                    from: "officeAmenities" as const,
                    localField: "amenities",
                    foreignField: "name",
                    as: "_amenities" as const
                }
            },
            {
                $lookup: {
                    from: "countries" as const,
                    localField: "country",
                    foreignField: "name",
                    as: "_country" as const
                }
            },
        ]);

        const resultOffices = filterOffices(req.query, officesWithData)
            .map(office => stripObjectProps(office, ['_amenities', '_country', 'coordinates']));

        res.json(resultOffices);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch offices',
        });
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
        const officeByCode = await dbConnection.offices.findOne({ $match: { code: { $eq: req.params.officeCode } } });
        
        if (!officeByCode) {
            return res.status(404).json({ message: 'Office not found' });
        }

        const resultOffice = stripObjectProps(officeByCode, ['coordinates']);
        
        res.json(resultOffice);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch office',
        });
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
        const recordWithExistingCode = await dbConnection.offices.findOne({ $match: { code: { $eq: req.body.code } } });
        
        if (recordWithExistingCode) {
            return res.status(400).json({ message: 'Office with this code already exists' });
        }
        
        const newOffice: DBOffice = {
            ...req.body,
            coordinates: {
                lat: req.body.coordinates.latitude,
                lng: req.body.coordinates.longitude
            },
            amenities: req.body.amenities?.map(a => a.code) || []
        };
        
        await dbConnection.offices.insertOne(newOffice);
        await dbConnection.offices.flush();

        const resultOffice = stripObjectProps(newOffice, ['coordinates']);
        
        res.status(201).json(resultOffice);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to create office',
        });
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
        const officeToUpdate = await dbConnection.offices.findOne({ $match: { code: { $eq: req.params.officeCode } } });
        
        if (!officeToUpdate) {
            return res.status(404).json({ message: 'Office not found' });
        }

        const updatedOffice: DBOffice = {
            ...officeToUpdate,
            ...req.body,
            coordinates: {
                lat: req.body.coordinates.latitude,
                lng: req.body.coordinates.longitude
            },
            code: req.params.officeCode,
            amenities: req.body.amenities?.map(a => a.code) || officeToUpdate.amenities
        };

        await dbConnection.offices.replaceOne({ $match: { code: { $eq: req.params.officeCode } } }, updatedOffice);
        await dbConnection.offices.flush();

        const resultOffice = stripObjectProps(updatedOffice, ['coordinates']);
        
        res.json(resultOffice);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to update office',
        });
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
        const officeToDelete = await dbConnection.offices.findOne({ $match: { code: { $eq: req.params.officeCode } } });
  
        if (!officeToDelete) {
            return res.status(404).json({ message: 'Office not found' });
        }

        await dbConnection.offices.deleteOne({ $match: { code: { $eq: req.params.officeCode } } });
        await dbConnection.offices.flush();
        res.status(204).send();
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to delete office',
        });
    }
});

export const officesRouter = router;
