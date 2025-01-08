import { BenefitCharge, Employee } from "../contract-types/data-contracts";

const defaultBenefitCharge: BenefitCharge = {
  "id": "7cc8cd89-5f16-407f-b227-630b6a940bdf",
  "employeeId": 15309827,
  "subscriptionId": "6bf03435-53a4-4ece-b9ca-805c25da3c45",
  "providerServiceCode": "SODEXO_RESTAURANT_CHOICE",
  "billingPeriodStart": "2020-03-01",
  "billingPeriodEnd": "2020-03-31",
  "amount": 275,
  "status": "PAID"
}

/**
 * Creates a mock benefit charge object with provided overrides.
 * It has all the required properties of a benefit charge object.
 * 
 * @example
 * ```ts
 * mockBenefitCharge({ amount: 300, status: 'PENDING' });
 * ```
 * 
 * @param overrides - partial benefit charge object to override default values
 * @returns BenefitCharge
 */
export const mockBenefitCharge = (overrides: Partial<BenefitCharge>): BenefitCharge => ({
  ...defaultBenefitCharge,
  ...overrides
})
