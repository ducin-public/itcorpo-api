import { z } from 'zod';

import { DBBenefitCategorySchema } from './benefit-service.schema';

export const DBBenefitSubscriptionSchema = z
  .object({
    id: z.string(),
    service: z
      .object({ name: z.string(), provider: z.string() })
      .strict(),
    beneficiary: z
      .object({ name: z.string(), email: z.string().email() })
      .strict(),
    category: DBBenefitCategorySchema,
    country: z.string(),
    city: z.string(),
    monthlyFee: z.number().int(),
    subscribedAtDate: z.string(),
    cancelledAtDate: z.string().optional(),
  })
  .strict();

export type DBBenefitSubscription = z.infer<typeof DBBenefitSubscriptionSchema>;
