import { z } from 'zod';

export const DBBenefitChargeStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "OVERDUE",
  "CANCELLED",
  "REFUNDED",
]);

export type DBBenefitChargeStatus = z.infer<typeof DBBenefitChargeStatusSchema>;

export const DBBenefitChargeSchema = z
  .object({
    id: z.string().uuid(),
    employeeId: z.number().int(),
    subscriptionId: z.string(),
    providerServiceCode: z.string(),
    billingPeriodStart: z.string(),
    billingPeriodEnd: z.string(),
    amount: z.number().int(),
    status: DBBenefitChargeStatusSchema,
  })
  .strict();

export type DBBenefitCharge = z.infer<typeof DBBenefitChargeSchema>;
