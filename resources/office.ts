import { Router, Request, Response } from 'express';
import { Office, OfficeAmenity, ErrorResponse, OfficesSearchCriteria } from '../contract-types/data-contracts';
import { Offices } from '../contract-types/OfficesRoute';
import { db } from '../lib/db';

const router = Router();

function processOfficesSearchCriteria(offices: Office[], criteria: OfficesSearchCriteria): Office[] {
    let result = [...offices];

    // Filter by countries if provided
    const countries = criteria.countries?.split(',');
    if (countries?.length) {
        const codeToCountryDict = db.data.geo;
        const countryNames = countries.map(code => codeToCountryDict[code.toUpperCase()]);
        result = result.filter(office => 
            countryNames.includes(office.country)
        );
    }

    // Filter by amenities if provided
    const amenityCodes = criteria.amenities?.split(',');
    if (amenityCodes?.length) {
        const codeToAmenityDict = db.data.officeAmenities.reduce((acc, amenity) => {
            acc[amenity.code] = amenity.name;
            return acc;
        }, {} as Record<string, string>);
        const amenityNames = amenityCodes.map(code => codeToAmenityDict[code]);

        result = result.filter(office => 
            amenityNames.every(amenity => 
                office.amenities.includes(amenity)
            )
        );
    }

    // Full text search if phrase provided
    if (criteria.phrase) {
        const searchPhrase = criteria.phrase.toLowerCase();
        result = result.filter(office => {
            const searchableText = [
                office.country,
                office.city,
                office.address,
                office.estate.owner
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchPhrase);
        });
    }

    return result;
}

// GET /offices/amenities/count
router.get('/amenities/count', async (_req, res) => {
    try {
        await db.read();
        res.json(db.data.officeAmenities.length);
    } catch (error) {
        res.status(500).json({ message: 'Failed to count office amenities' });
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
        res.status(500).json({ message: 'Failed to fetch office amenities' });
    }
});

// GET /offices/count
router.get('/count', async (req, res) => {
    try {
        await db.read();
        const filteredOffices = processOfficesSearchCriteria(db.data.offices, req.query);
        res.json(filteredOffices.length);
    } catch (error) {
        res.status(500).json({ message: 'Failed to count offices' });
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
        const filteredOffices = processOfficesSearchCriteria(db.data.offices, req.query);
        res.json(filteredOffices);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch offices' });
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
        res.status(500).json({ message: 'Failed to fetch office' });
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
        res.status(500).json({ message: 'Failed to create office' });
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
        const officeCode = req.params.officeCode;
        const index = db.data.offices.findIndex(o => o.code === officeCode);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Office not found' });
        }

        const updatedOffice: Office = {
            ...db.data.offices[index],
            ...req.body,
            code: officeCode, // preserve original code
            amenities: req.body.amenities?.map(a => a.code) || db.data.offices[index].amenities
        };

        db.data.offices[index] = updatedOffice;
        await db.write();
        
        res.json(updatedOffice);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update office' });
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
        res.status(500).json({ message: 'Failed to delete office' });
    }
});

export const officesRouter = router;
