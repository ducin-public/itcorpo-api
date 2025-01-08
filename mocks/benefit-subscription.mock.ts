import { BenefitSubscription } from "../contract-types/data-contracts";

const defaultBenefitSubscription: BenefitSubscription = {
  "id": "6bf03435-53a4-4ece-b9ca-805c25da3c45",
  "beneficiary": {
    "name": "Kira Jamrozy",
    "email": "kija@itcorpo.de"
  },
  "service": {
    "name": "Sodexo Restaurant Pass Premium",
    "provider": "Sodexo Benefits and Rewards"
  },
  "category": "LUNCH_FOOD",
  "country": "Tunisia",
  "city": "Lake Valentina chester",
  "monthlyFee": 275,
  "subscribedAtDate": "2020-03-09"
}

/**
 * Creates a mock benefit subscription object with provided overrides.
 * It has all the required properties of a benefit subscription object.
 * 
 * @example
 * ```ts
 * mockBenefitSubscription({ monthlyFee: 300, category: 'HEALTHCARE' });
 * ```
 * 
 * @param overrides - partial benefit subscription object to override default values
 * @returns BenefitSubscription
 */
export const mockBenefitSubscription = (overrides: Partial<BenefitSubscription>): BenefitSubscription => ({
  ...defaultBenefitSubscription,
  ...overrides
})
