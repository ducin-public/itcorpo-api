import { BenefitCharge, BenefitChargesSearchCriteria } from '../contract-types/data-contracts';
import { DbSchema } from '../lib/db';

/**
 * Filters benefit charges based on search criteria defined in the API contract.
 * 
 * @param collections - Database collections required for filtering
 * @param criteria - Search parameters
 * Supported criteria:
 * - subscriptionId: filter by specific benefit subscription
 * - billingPeriodFrom: filter charges starting from specified period (YYYY-MM format)
 * - billingPeriodTo: filter charges up to specified period (YYYY-MM format)
 * - status: filter by charge status (PENDING, PAID, CANCELLED)
 * 
 * @see {@link DbSchema}
 * @see {@link BenefitCharge}
 * @see {@link BenefitChargesSearchCriteria}
 * @returns Filtered array of benefit charges
 */
export function processBenefitChargesSearchCriteria(
    collections: Pick<DbSchema, 'benefitCharges'>,
    criteria: BenefitChargesSearchCriteria
): BenefitCharge[] {
    let result = [...collections.benefitCharges];

    // Filter by subscription ID if provided
    if (criteria.subscriptionId) {
        result = result.filter(charge => charge.subscriptionId === criteria.subscriptionId);
    }

    // Filter by overlapping period ranges if provided
    // FIXME: not tested
    if (criteria.billingPeriodFrom || criteria.billingPeriodTo) {
        result = result.filter(charge => {
            const criteriaStart = criteria.billingPeriodFrom || '0000-00';
            const criteriaEnd = criteria.billingPeriodTo || '9999-99';
            const chargeStart = charge.billingPeriodStart;
            const chargeEnd = charge.billingPeriodEnd;
            
            return criteriaStart <= chargeEnd && criteriaEnd >= chargeStart;
        });
    }

    // Filter by status if provided
    if (criteria.status) {
        result = result.filter(charge => charge.status === criteria.status);
    }

    return result;
}