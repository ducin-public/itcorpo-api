import { Router, Request, Response } from 'express';
import { BenefitSubscription, BenefitService, BenefitCharge, ErrorResponse, BenefitsSearchCriteria } from '../contract-types/data-contracts';
import { Benefits } from '../contract-types/BenefitsRoute';
import { db } from '../lib/db';

const router = Router();

function processBenefitsSearchCriteria(benefits: BenefitSubscription[], criteria: BenefitsSearchCriteria): BenefitSubscription[] {
    let result = [...benefits];

    // Filter by service name if provided
    if (criteria.serviceName) {
        const searchName = criteria.serviceName.toLowerCase();
        result = result.filter(benefit => 
            benefit.service.name.toLowerCase().includes(searchName)
        );
    }

    // Filter by benefit categories if provided
    if (criteria.categories) {
        const categories = criteria.categories.split(',');
        result = result.filter(benefit => 
            categories.includes(benefit.category)
        );
    }

    // Filter by employee IDs if provided
    const employeeIds = criteria.employeeIds?.split(',').map(Number);
    if (employeeIds?.length) {
        result = result.filter(benefit => 
            employeeIds.some(id => {
                const employee = db.data.employees.find(e => e.id === id);
                return employee && benefit.beneficiary.email === employee.email;
            })
        );
    }

    // Filter by fee range if provided
    if (criteria.feeFrom) {
        const minFee = Number(criteria.feeFrom);
        result = result.filter(benefit => benefit.monthlyFee >= minFee);
    }
    if (criteria.feeTo) {
        const maxFee = Number(criteria.feeTo);
        result = result.filter(benefit => benefit.monthlyFee <= maxFee);
    }

    // Filter by status if provided
    if (criteria.status) {
        if (criteria.status === 'ACTIVE') {
            result = result.filter(benefit => !benefit.cancelledAtDate);
        } else if (criteria.status === 'CANCELLED') {
            result = result.filter(benefit => benefit.cancelledAtDate);
        }
        // 'ALL' status doesn't need filtering
    }

    return result;
}

// GET /benefits/services
router.get('/services', async (
    _req: Request<
        Benefits.GetBenefitServices.RequestParams,
        Benefits.GetBenefitServices.ResponseBody,
        Benefits.GetBenefitServices.RequestBody,
        Benefits.GetBenefitServices.RequestQuery
    >,
    res: Response<Benefits.GetBenefitServices.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        res.json(db.data.benefitServices);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch benefit services: ${error}` });
    }
});

// GET /benefits/charges
router.get('/charges', async (
    _req: Request<
        Benefits.GetBenefitCharges.RequestParams,
        Benefits.GetBenefitCharges.ResponseBody,
        Benefits.GetBenefitCharges.RequestBody,
        Benefits.GetBenefitCharges.RequestQuery
    >,
    res: Response<Benefits.GetBenefitCharges.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        res.json(db.data.benefitCharges);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch benefit charges: ${error}` });
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
        await db.read();
        const filteredBenefits = processBenefitsSearchCriteria(db.data.benefits, req.query);
        res.json(filteredBenefits.length);
    } catch (error) {
        res.status(500).json({ message: `Failed to count benefits: ${error}` });
    }
});

// GET /benefits
router.get('/', async (
    req: Request<
        Benefits.GetBenefits.RequestParams,
        Benefits.GetBenefits.ResponseBody,
        Benefits.GetBenefits.RequestBody,
        Benefits.GetBenefits.RequestQuery
    >,
    res: Response<Benefits.GetBenefits.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        const filteredBenefits = processBenefitsSearchCriteria(db.data.benefits, req.query);
        res.json(filteredBenefits);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch benefits: ${error}` });
    }
});

// GET /benefits/:benefitId
router.get('/:benefitId', async (
    req: Request<
        Benefits.GetBenefitById.RequestParams,
        Benefits.GetBenefitById.ResponseBody,
        Benefits.GetBenefitById.RequestBody,
        Benefits.GetBenefitById.RequestQuery
    >,
    res: Response<Benefits.GetBenefitById.ResponseBody | ErrorResponse>
) => {
    try {
        await db.read();
        const benefitId = req.params.benefitId;
        
        const benefit = db.data.benefits.find(b => b.id === benefitId);
        
        if (!benefit) {
            return res.status(404).json({ message: 'Benefit not found' });
        }
        
        res.json(benefit);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch benefit: ${error}` });
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
        await db.read();
        const benefitData = { ...req.body };
        
        // Validate benefit service exists
        const service = db.data.benefitServices.find(s => s.code === benefitData.service);
        if (!service) {
            return res.status(400).json({ message: 'Invalid benefit service' });
        }
        
        const newBenefit: BenefitSubscription = {
            id: Math.random().toString(36).substr(2, 9),
            ...benefitData,
            service: {
                name: service.name,
                provider: service.provider.name
            },
            category: service.category
        };
        
        db.data.benefits.push(newBenefit);
        await db.write();
        
        res.status(201).json(newBenefit);
    } catch (error) {
        res.status(500).json({ message: `Failed to create benefit: ${error}` });
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
        await db.read();
        const benefitId = req.params.benefitId;
        const benefitData = { ...req.body };
        const benefitToUpdate = db.data.benefits.find(b => b.id === benefitId);
        
        if (!benefitToUpdate) {
            return res.status(404).json({ message: 'Benefit not found' });
        }

        let { service, category } = benefitToUpdate;

        // Validate service exists if changed
        if (benefitData.service && benefitData.service !== benefitToUpdate.service.name) {
            const serviceInfo = db.data.benefitServices.find(s => s.code === benefitData.service);
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
            ...benefitData,
            id: req.params.benefitId,
            service,
            category
        };

        db.data.benefits = db.data.benefits.map(b => 
            b.id === req.params.benefitId ? updatedBenefit : b
        );
        await db.write();
        
        res.json(updatedBenefit);
    } catch (error) {
        res.status(500).json({ message: `Failed to update benefit: ${error}` });
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
        await db.read();
        const benefitId = req.params.benefitId;
        const { operation } = req.body;
        
        const existingBenefit = db.data.benefits.find(b => b.id === benefitId);
        
        if (!existingBenefit) {
            return res.status(404).json({ message: 'Benefit not found' });
        }

        if (operation === 'CANCEL') {
            // Can't cancel an already cancelled subscription
            if (existingBenefit.cancelledAtDate) {
                return res.status(422).json({ 
                    message: 'Cannot cancel an already cancelled subscription' 
                });
            }

            // Update the existing benefit with cancellation date
            const updatedBenefit = {
                ...existingBenefit,
                cancelledAtDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
            };

            db.data.benefits = db.data.benefits.map(b => 
                b.id === benefitId ? updatedBenefit : b
            );

            await db.write();
            return res.json(updatedBenefit);

        } else if (operation === 'RENEW') {
            // Can't renew an active subscription
            if (!existingBenefit.cancelledAtDate) {
                return res.status(422).json({ 
                    message: 'Cannot renew an active subscription' 
                });
            }

            // Create new subscription based on the previous one
            const newBenefit = {
                ...existingBenefit,
                id: Math.random().toString(36).substr(2, 9), // Generate new ID
                subscribedAtDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
                cancelledAtDate: undefined
            };
            delete newBenefit.cancelledAtDate; // Remove cancellation date

            db.data.benefits.push(newBenefit);
            await db.write();
            return res.json(newBenefit);

        } else {
            return res.status(400).json({ 
                message: 'Invalid operation. Must be either CANCEL or RENEW' 
            });
        }
    } catch (error) {
        res.status(500).json({ message: `Failed to update benefit status: ${error}` });
    }
});

export const benefitsRouter = router;
