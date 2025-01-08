import { BenefitSubscription, BenefitsSearchCriteria } from '../contract-types/data-contracts';
import { DbSchema } from '../lib/db';

/**
 * Processes benefits search criteria and filters benefits based on provided criteria
 * 
 * @param collections - Database collections required for benefit search
 *   @see {@link DbSchema}
 * 
 * @param criteria - Search criteria for filtering benefits
 *   @see {@link BenefitsSearchCriteria}
 *   - serviceName: Filter by partial match of benefit service name
 *   - categories: Filter by benefit categories (comma-separated)
 *   - employeeIds: Filter by beneficiary employee IDs (comma-separated)
 *   - feeFrom: Filter by minimum monthly fee
 *   - feeTo: Filter by maximum monthly fee
 *   - status: Filter by subscription status (ACTIVE, CANCELLED, ALL)
 * 
 * @returns Filtered array of benefit subscriptions matching the criteria
 *   @see {@link BenefitSubscription}
 */
export function processBenefitsSearchCriteria(
    collections: Pick<DbSchema, 'benefits' | 'employees'>,
    criteria: BenefitsSearchCriteria
): BenefitSubscription[] {
    let result = [...collections.benefits];

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
                const employee = collections.employees.find(e => e.id === id);
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
