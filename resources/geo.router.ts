import { Router, Request, Response } from 'express';

import { ErrorResponse } from '../contract-types/data-contracts';
import { Geo } from '../contract-types/GeoRoute';
import { db } from '../lib/db/db-connection';

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
        await db.read();
        res.json(db.data.geo);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch geographical data: ${error}` });
    }
});

export const geoRouter = router;
