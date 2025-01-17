import { Router, Request, Response } from 'express';
import { BenefitSubscription, ErrorResponse } from '../contract-types/data-contracts';
import { Benefits } from '../contract-types/BenefitsRoute';
import { dbConnection } from '../lib/db/db-connection';
import { filterBenefits } from './benefit-filters';
import { filterBenefitCharges } from './benefit-charges-filters';
import { handleRouterError } from './core/error';
import { randomUUID } from 'crypto';
import { DBBenefitSubscription } from '../lib/db/db-zod-schemas/benefit-subscription.schema';
import { getPaginationValues } from './core/pagination';

const router = Router();
const MAX_PAGE_SIZE = 50;

// GET /benefits/services
router.get('/services', async (
    req: Request<
        Benefits.GetBenefitServices.RequestParams,
        Benefits.GetBenefitServices.ResponseBody,
        Benefits.GetBenefitServices.RequestBody,
        Benefits.GetBenefitServices.RequestQuery
    >,
    res: Response<Benefits.GetBenefitServices.ResponseBody | ErrorResponse>
) => {
    try {
        const services = await dbConnection.benefitServices.findMany();
        res.json(services);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch benefit services',
        });
    }
});

// GET /benefits/charges
router.get('/charges', async (
    req: Request<
        Benefits.GetBenefitCharges.RequestParams,
        Benefits.GetBenefitCharges.ResponseBody,
        Benefits.GetBenefitCharges.RequestBody,
        Benefits.GetBenefitCharges.RequestQuery
    >,
    res: Response<Benefits.GetBenefitCharges.ResponseBody | ErrorResponse>
) => {
    try {
        const { page, pageSize } = getPaginationValues({ ...req.query, MAX_PAGE_SIZE });

        let filteredCharges = filterBenefitCharges(req.query, {
            benefitCharges: await dbConnection.benefitCharges.findMany()
        });
        filteredCharges = filteredCharges.slice((page - 1) * pageSize, page * pageSize);

        res.json(filteredCharges);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch benefit charges',
        });
    }
});

// GET /benefits/count
router.get('/count', async (
    req: Request<
        Benefits.GetBenefitsCount.RequestParams,
        Benefits.GetBenefitsCount.ResponseBody,
        Benefits.GetBenefitsCount.RequestBody,
        Benefits.GetBenefitsCount.RequestQuery
    >,
    res: Response<Benefits.GetBenefitsCount.ResponseBody | ErrorResponse>
) => {
    try {
        const benefitsPromise = dbConnection.benefitSubscriptions.findMany();
        const employeesPromise = dbConnection.employees.findMany();

        const filteredBenefits = filterBenefits(req.query, {
            benefitSubscriptions: await benefitsPromise,
            employees: await employeesPromise
        });

        res.json(filteredBenefits.length);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to count benefit subscriptions',
        });
    }
});

// GET /benefits
router.get('/', async (
    req: Request<
        Benefits.GetBenefitSubscriptions.RequestParams,
        Benefits.GetBenefitSubscriptions.ResponseBody,
        Benefits.GetBenefitSubscriptions.RequestBody,
        Benefits.GetBenefitSubscriptions.RequestQuery
    >,
    res: Response<Benefits.GetBenefitSubscriptions.ResponseBody | ErrorResponse>
) => {
    try {
        const { page, pageSize } = getPaginationValues({ ...req.query, MAX_PAGE_SIZE });

        const benefitsPromise = dbConnection.benefitSubscriptions.findMany();
        const employeesPromise = dbConnection.employees.findMany();

        let filteredBenefits = filterBenefits(req.query, {
            benefitSubscriptions: await benefitsPromise,
            employees: await employeesPromise
        });
        filteredBenefits = filteredBenefits.slice((page - 1) * pageSize, page * pageSize);

        res.json(filteredBenefits);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch benefit subscriptions',
        });
    }
});

// GET /benefits/:benefitId
router.get('/:benefitId', async (
    req: Request<
        Benefits.GetBenefitSubscriptionById.RequestParams,
        Benefits.GetBenefitSubscriptionById.ResponseBody,
        Benefits.GetBenefitSubscriptionById.RequestBody,
        Benefits.GetBenefitSubscriptionById.RequestQuery
    >,
    res: Response<Benefits.GetBenefitSubscriptionById.ResponseBody | ErrorResponse>
) => {
    try {
        const benefit = await dbConnection.benefitSubscriptions.findOne({ $match: { id: { $eq: req.params.benefitId } } });
        
        if (!benefit) {
            return res.status(404).json({ message: 'Benefit not found' });
        }
        
        res.json(benefit);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch benefit subscription',
        });
    }
});

// GET /benefits/:benefitId/charges
router.get('/:benefitId/charges', async (
    req: Request<
        Benefits.GetBenefitSubscriptionCharges.RequestParams,
        Benefits.GetBenefitSubscriptionCharges.ResponseBody,
        Benefits.GetBenefitSubscriptionCharges.RequestBody,
        Benefits.GetBenefitSubscriptionCharges.RequestQuery
    >,
    res: Response<Benefits.GetBenefitSubscriptionCharges.ResponseBody | ErrorResponse>
) => {
    try {
        const filteredCharges = filterBenefitCharges(req.query, {
            benefitCharges: await dbConnection.benefitCharges.findMany({ $match: { subscriptionId: { $eq: req.params.benefitId } } })
        });

        res.json(filteredCharges);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to fetch benefit charges',
        });
    }
});

// POST /benefits
router.post('/', async (
    req: Request<
        Benefits.CreateBenefit.RequestParams,
        Benefits.CreateBenefit.ResponseBody,
        Benefits.CreateBenefit.RequestBody,
        Benefits.CreateBenefit.RequestQuery
    >,
    res: Response<Benefits.CreateBenefit.ResponseBody | ErrorResponse>
) => {
    try {
        const service = await dbConnection.benefitServices.findOne({ $match: { code: { $eq: req.body.service } } });
        if (!service) {
            return res.status(400).json({ message: 'Invalid benefit service' });
        }
        
        const newBenefit: DBBenefitSubscription = {
            id: randomUUID(),
            ...req.body,
            service: {
                name: service.name,
                provider: service.provider.name
            },
            category: service.category
        };
        
        const newRecord = await dbConnection.benefitSubscriptions.insertOne(newBenefit);
        await dbConnection.benefitSubscriptions.flush();
        
        res.status(201).json(newRecord);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to create benefit',
        });
    }
});

// PUT /benefits/:benefitId
router.put('/:benefitId', async (
    req: Request<
        Benefits.UpdateBenefit.RequestParams,
        Benefits.UpdateBenefit.ResponseBody,
        Benefits.UpdateBenefit.RequestBody,
        Benefits.UpdateBenefit.RequestQuery
    >,
    res: Response<Benefits.UpdateBenefit.ResponseBody | ErrorResponse>
) => {
    try {
        const benefitToUpdate = await dbConnection.benefitSubscriptions.findOne({ $match: { id: { $eq: req.params.benefitId } } });
        
        if (!benefitToUpdate) {
            return res.status(404).json({ message: 'Benefit not found' });
        }

        let { service, category } = benefitToUpdate;

        if (req.body.service && req.body.service !== benefitToUpdate.service.name) {
            const serviceInfo = await dbConnection.benefitServices.findOne({ $match: { code: { $eq: req.body.service } } });
            if (!serviceInfo) {
                return res.status(400).json({ message: 'Invalid benefit service' });
            }
            service = {
                name: serviceInfo.name,
                provider: serviceInfo.provider.name
            };
            category = serviceInfo.category;
        }

        const updatedBenefit: BenefitSubscription = {
            ...benefitToUpdate,
            ...req.body,
            id: req.params.benefitId,
            service,
            category
        };

        await dbConnection.benefitSubscriptions.updateOne({ $match: { id: { $eq: req.params.benefitId } } }, updatedBenefit);
        await dbConnection.benefitSubscriptions.flush();
        
        res.json(updatedBenefit);
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to update benefit',
        });
    }
});

// PATCH /benefits/:benefitId
router.patch('/:benefitId', async (
    req: Request<
        Benefits.UpdateBenefitSubscriptionStatus.RequestParams,
        Benefits.UpdateBenefitSubscriptionStatus.ResponseBody,
        Benefits.UpdateBenefitSubscriptionStatus.RequestBody,
        Benefits.UpdateBenefitSubscriptionStatus.RequestQuery
    >,
    res: Response<Benefits.UpdateBenefitSubscriptionStatus.ResponseBody | ErrorResponse>
) => {
    try {
        const existingBenefit = await dbConnection.benefitSubscriptions.findOne({ $match: { id: { $eq: req.params.benefitId } } });
        
        if (!existingBenefit) {
            return res.status(404).json({ message: 'Benefit not found' });
        }

        if (req.body.operation === 'CANCEL') {
            // Can't cancel an already cancelled subscription
            if (existingBenefit.cancelledAtDate) {
                return res.status(422).json({ message: 'Cannot cancel an already cancelled subscription' });
            }

            // Update the existing benefit with cancellation date
            const updatedBenefit = {
                ...existingBenefit,
                cancelledAtDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
            };

            await dbConnection.benefitSubscriptions.replaceOne({ $match: { id: { $eq: req.params.benefitId } } }, updatedBenefit);
            await dbConnection.benefitSubscriptions.flush();
            return res.json(updatedBenefit);

        } else if (req.body.operation === 'RENEW') {
            // Can't renew an active subscription
            if (!existingBenefit.cancelledAtDate) {
                return res.status(422).json({ message: 'Cannot renew an active subscription' });
            }

            // Create new subscription based on the previous one
            const newBenefit = {
                ...existingBenefit,
                id: randomUUID(),
                subscribedAtDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
                cancelledAtDate: undefined
            };
            delete newBenefit.cancelledAtDate; // Remove cancellation date

            await dbConnection.benefitSubscriptions.insertOne(newBenefit);
            await dbConnection.benefitSubscriptions.flush();
            return res.json(newBenefit);

        } else {
            return res.status(400).json({ message: 'Invalid operation. Must be either CANCEL or RENEW' });
        }
    } catch (error) {
        handleRouterError({
            error, req, res,
            publicError: 'Failed to update benefit subscription status',
        });
    }
});

export const benefitsRouter = router;
