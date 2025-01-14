import { Router, Request, Response } from 'express';

import { ErrorResponse } from '../contract-types/data-contracts';
import { Geo } from '../contract-types/GeoRoute';
import { dbConnection } from '../lib/db/db-connection';

const router = Router();

// GET /geo
router.get('/', async (
    _req: Request<
        Geo.GetGeo.RequestParams,
        Geo.GetGeo.ResponseBody,
        Geo.GetGeo.RequestBody,
        Geo.GetGeo.RequestQuery
    >,
    res: Response<Geo.GetGeo.ResponseBody | ErrorResponse>
) => {
    try {
        const countries = await dbConnection.countries.findMany();
        const geoResult: Geo.GetGeo.ResponseBody =
            countries.reduce((result, country) => {
                result[country.code] = country.name;
                return result;
            }, {} as Geo.GetGeo.ResponseBody);
        res.json(geoResult);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch geographical data: ${error}` });
    }
});

export const geoRouter = router;
