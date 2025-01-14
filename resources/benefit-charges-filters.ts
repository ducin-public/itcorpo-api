
import { Benefits } from '../contract-types/BenefitsRoute';
import { DBBenefitCharge } from '../lib/db/db-zod-schemas/benefit-charge.schema';

/**
 * Filter  benefit charges based on provided criteria
 * 
 * @param criteria - Search criteria for filtering charges
 *   @see {@link Benefits.GetBenefitCharges.RequestQuery}
 *   - subscriptionId: Filter by specific benefit subscription ID
 *   - providerServiceCode: Filter by specific provider service code
 *   - billingPeriodFrom: Filter by minimum billing period (YYYY-MM)
 *   - billingPeriodTo: Filter by maximum billing period (YYYY-MM)
 *   - status: Filter by charge status (PENDING, PAID, CANCELLED)
 * 
 * @param collections - Collection of data required for filtering
 * 
 * @returns Filtered array of benefit charges matching the criteria
 *   @see {@link DBBenefitCharge}
 */
export function filterBenefitCharges(
    criteria: Benefits.GetBenefitCharges.RequestQuery,
    collections: {
        benefitCharges: DBBenefitCharge[];
    }
): DBBenefitCharge[] {
    let result = [...collections.benefitCharges];

    // Filter by subscription ID if provided
    if (criteria.subscriptionId) {
        result = result.filter(charge => charge.subscriptionId === criteria.subscriptionId);
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
