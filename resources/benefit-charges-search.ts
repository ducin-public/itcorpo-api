import { Benefits } from '../contract-types/BenefitsRoute';
import { BenefitCharge } from '../contract-types/data-contracts';
import { DbSchema } from '../lib/db';

/**
 * Processes benefit charges search criteria and filters charges based on provided criteria
 * 
 * @param collections - Database collections required for charge search
 *   @see {@link DbSchema}
 * 
 * @param criteria - Search criteria for filtering charges
 *   @see {@link Benefits.GetBenefitSubscriptionCharges.RequestQuery}
 *   - subscriptionId: Filter by specific benefit subscription ID
 *   - providerServiceCode: Filter by specific provider service code
 *   - billingPeriodFrom: Filter by minimum billing period (YYYY-MM)
 *   - billingPeriodTo: Filter by maximum billing period (YYYY-MM)
 *   - status: Filter by charge status (PENDING, PAID, CANCELLED)
 * 
 * @returns Filtered array of benefit charges matching the criteria
 *   @see {@link BenefitCharge}
 */
export function processBenefitChargesSearchCriteria(
    collections: Pick<DbSchema, 'benefitCharges'>,
    criteria: Benefits.GetBenefitSubscriptionCharges.RequestQuery & Partial<Benefits.GetBenefitSubscriptionCharges.RequestParams>
): BenefitCharge[] {
    let result = [...collections.benefitCharges];

    // Filter by subscription ID if provided
    if (criteria.benefitId) {
        result = result.filter(charge => charge.subscriptionId === criteria.benefitId);
    }

    // Filter by provider service code if provided
    if (criteria.providerServiceCode) {
        result = result.filter(charge => charge.providerServiceCode === criteria.providerServiceCode);
    }

    // Filter by overlapping period ranges if provided
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
