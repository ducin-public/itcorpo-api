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
 *   - categoriesFiltering: How to match categories ('ANY' or 'ALL', defaults to 'ANY')
 *   - employeeId: Filter by beneficiary employee ID
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
        const filterMode = criteria.categoriesFiltering || 'ANY';
        
        result = result.filter(benefit => 
            filterMode === 'ANY' 
                ? categories.includes(benefit.category)
                : categories.every(cat => benefit.category === cat)
        );
    }

    // Filter by employee ID if provided
    if (criteria.employeeId) {
        const employeeId = Number(criteria.employeeId);
        result = result.filter(benefit => {
            const employee = collections.employees.find(e => e.id === employeeId);
            return employee && benefit.beneficiary.email === employee.email;
        });
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
