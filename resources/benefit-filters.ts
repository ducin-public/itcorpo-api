import { Benefits } from '../contract-types/BenefitsRoute';
import { DBBenefitSubscription } from '../lib/db/db-zod-schemas/benefit-subscription.schema';
import { DBEmployee } from '../lib/db/db-zod-schemas/employee.schema';

/**
 * Filter benefit subscriptions based on provided criteria
 * 
 * @param criteria - Search criteria for filtering benefits
 *   @see {@link Benefits.GetBenefitSubscriptions.RequestQuery}
 *   - serviceName: Filter by partial match of benefit service name
 *   - categories: Filter by benefit categories (comma-separated list)
 *   - employeeId: Filter by beneficiary employee ID
 *   - feeFrom: Filter by minimum monthly fee
 *   - feeTo: Filter by maximum monthly fee
 *   - status: Filter by subscription status (ACTIVE, CANCELLED, ALL)
 * 
 * @param collections - Collection of data required for filtering
 * 
 * @returns Filtered array of benefit subscriptions matching the criteria
 *   @see {@link DBBenefitSubscription}
 */
export function filterBenefits(
    criteria: Benefits.GetBenefitSubscriptions.RequestQuery,
    collections: {
        benefitSubscriptions: DBBenefitSubscription[];
        employees: DBEmployee[];
    }
): DBBenefitSubscription[] {
    let result = [...collections.benefitSubscriptions];

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
