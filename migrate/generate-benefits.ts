import { v4 as uuid } from 'uuid'
import { addMonths, parseISO, format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns'

import { BenefitService, BenefitCharge, BenefitChargeStatus, BenefitSubscription, Employee } from '../contract-types/data-contracts'
import { logger } from '../lib/logger'
import { benefitServices, PRICE_RANGES } from './benefit-services'
import { randomInt } from './lib/random'
import { DBConnection } from '../lib/db/db-connection'

const PROBABILITIES = {
  EMPLOYEE: {
    HAS_BENEFIT: 0.05,
    HAS_MULTIPLE_BENEFITS: 0.2,
    RENEWED_BENEFIT: 0.2
  },
  SERVICE_CATEGORIES: {
    HEALTHCARE: 0.4,
    SPORT: 0.3,
    LUNCH: 0.2,
    CULTURE: 0.1
  },
  SUBSCRIPTION_LENGTH: {
    VERY_SHORT_TERM: 0.2,
    SHORT_TERM: 0.2,
    MEDIUM_TERM: 0.1,
    LONG_TERM: 0.3,
    VERY_LONG_TERM: 0.2
  },
  CHARGES: {
    IS_OVERDUE: 0.05,
    IS_CANCELLED: 0.02,
    IS_REFUNDED: 0.01
  }
}

const SUBSCRIPTION_LENGTHS = {
    VERY_SHORT_TERM: { min: 1, max: 2 },        // 1-2 months
    SHORT_TERM: { min: 3, max: 9 },             // 3-9 months
    MEDIUM_TERM: { min: 10, max: 24 },           // 10-24 months
    LONG_TERM: { min: 24, max: 48 },            // 2-4 years
    VERY_LONG_TERM: { min: 48, max: 120 }       // 4-10 years
}

const subscriptionLength = (): number => {
    const rand = Math.random();
    let cumulativeProb = 0;
    
    for (const [term, probability] of Object.entries(PROBABILITIES.SUBSCRIPTION_LENGTH)) {
        cumulativeProb += probability;
        if (rand <= cumulativeProb) {
            const range = SUBSCRIPTION_LENGTHS[term as keyof typeof SUBSCRIPTION_LENGTHS];
            return randomInt(range.min, range.max);
        }
    }
    return SUBSCRIPTION_LENGTHS.MEDIUM_TERM.min; // fallback
}

const generateRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const generateSingleSubscription = (
    employee: Employee,
    service: BenefitService,
    startDate: Date,
    lengthInMonths: number
): BenefitSubscription => {
    const endDate = addMonths(startDate, lengthInMonths);
    const now = new Date();
    
    return {
        id: uuid(),
        beneficiary: {
            name: `${employee.firstName} ${employee.lastName}`,
            email: employee.email
        },
        service: {
            name: service.name,
            provider: service.provider.name
        },
        category: service.category,
        country: employee.personalInfo.address.country,
        city: employee.personalInfo.address.city,
        monthlyFee: PRICE_RANGES[service.code][employee.nationality],
        subscribedAtDate: format(startDate, 'yyyy-MM-dd'),
        ...(endDate <= now && {
            cancelledAtDate: format(endDate, 'yyyy-MM-dd')
        })
    }
}

const generateSubscriptionsOfAnEmployee = (
    employee: Employee, 
    service: BenefitService,
): BenefitSubscription[] => {
    const subscriptions: BenefitSubscription[] = [];
    let currentDate = generateRandomDate(
        new Date('2019-01-01'), 
        new Date('2024-01-01')
    );
    
    let lengthInMonths = subscriptionLength();
    subscriptions.push(generateSingleSubscription(employee, service, currentDate, lengthInMonths));

    // Handle renewals for short subscriptions
    while (lengthInMonths < 30 && Math.random() < PROBABILITIES.EMPLOYEE.RENEWED_BENEFIT) {
        currentDate = addMonths(currentDate, lengthInMonths);
        if (currentDate > new Date()) break; // Don't create future renewals
        
        lengthInMonths = subscriptionLength(); // New length for renewal
        subscriptions.push(generateSingleSubscription(employee, service, currentDate, lengthInMonths));
    }

    return subscriptions;
}

const generateCharges = (
    subscription: BenefitSubscription,
    employeeId: number,
    service: BenefitService
): BenefitCharge[] => {
    const charges: BenefitCharge[] = []
    const startDate = parseISO(subscription.subscribedAtDate)
    const endDate = subscription.cancelledAtDate 
        ? parseISO(subscription.cancelledAtDate)
        : addMonths(startDate, 12)
    
    let currentDate = startDate

    const isFullMonthService = service.category === 'HEALTHCARE' || service.category === 'LUNCH_FOOD'

    while (currentDate < endDate) {
        const status = Math.random() < PROBABILITIES.CHARGES.IS_OVERDUE
            ? "OVERDUE"
            : Math.random() < PROBABILITIES.CHARGES.IS_CANCELLED
                ? "CANCELLED"
                : Math.random() < PROBABILITIES.CHARGES.IS_REFUNDED
                    ? "REFUNDED"
                    : "PAID"

        const billingStart = isFullMonthService ? startOfMonth(currentDate) : currentDate
        const billingEnd = isFullMonthService 
            ? endOfMonth(currentDate)
            : addMonths(currentDate, 1)

        // For full month services, only create charge if subscription covers majority of the month
        if (!isFullMonthService || isSameMonth(currentDate, startDate) || !isSameMonth(billingEnd, endDate)) {
            charges.push({
                id: uuid(),
                employeeId,
                subscriptionId: subscription.id,
                providerServiceCode: service.code,
                billingPeriodStart: format(billingStart, 'yyyy-MM-dd'),
                billingPeriodEnd: format(billingEnd, 'yyyy-MM-dd'),
                amount: subscription.monthlyFee,
                status: status as BenefitChargeStatus
            })
        }

        currentDate = addMonths(currentDate, 1)
    }

    return charges
}

export async function generateBenefits (dbConnection: DBConnection) {
    const allSubscriptions: BenefitSubscription[] = []
    const allCharges: BenefitCharge[] = []

    const employees = await dbConnection.employees.findMany();
    for (const employee of employees) {
        if (Math.random() < PROBABILITIES.EMPLOYEE.HAS_BENEFIT) {
            const availableServices = benefitServices.filter(s => 
                s.availableCountries.includes(employee.nationality)
            )
    
            const hasMultiple = Math.random() < PROBABILITIES.EMPLOYEE.HAS_MULTIPLE_BENEFITS
            const servicesToAssign = hasMultiple 
                ? availableServices.slice(0, Math.floor(Math.random() * 3) + 1)
                : [availableServices[Math.floor(Math.random() * availableServices.length)]]
    
            for (const service of servicesToAssign) {
                const employeeSubscriptions = generateSubscriptionsOfAnEmployee(employee, service)
                allSubscriptions.push(...employeeSubscriptions)
    
                for (const subscription of employeeSubscriptions) {   
                    const subscriptionCharges = generateCharges(subscription, employee.id, service)
                    allCharges.push(...subscriptionCharges)
                }
            }
        }
    }

    await dbConnection.benefitServices.deleteMany();
    await dbConnection.benefitServices.insertMany(benefitServices);
    await dbConnection.benefitServices.validateInMemory();
    await dbConnection.benefitServices.flush();

    await dbConnection.benefitSubscriptions.deleteMany();
    await dbConnection.benefitSubscriptions.insertMany(allSubscriptions);
    await dbConnection.benefitSubscriptions.validateInMemory();
    await dbConnection.benefitSubscriptions.flush();

    await dbConnection.benefitCharges.deleteMany();
    await dbConnection.benefitCharges.insertMany(allCharges);
    await dbConnection.benefitCharges.validateInMemory();
    await dbConnection.benefitCharges.flush();

    logger.info(`Generated ${benefitServices.length} services, ${allSubscriptions.length} subscriptions, ${allCharges.length} charges`)
}
