import { z } from 'zod';

export const DBBenefitCategorySchema = z.enum([
    "HEALTHCARE",
    "SPORT_WELLNESS",
    "LUNCH_FOOD",
    "CULTURE_RECREATION",
]);

export type DBBenefitCategory = z.infer<typeof DBBenefitCategorySchema>;

export const DBBenefitServiceSchema = z
  .object({
    code: z.string(),
    name: z.string(),
    category: DBBenefitCategorySchema,
    provider: z
      .object({
        name: z.string(),
        website: z.string().url(),
        contactEmail: z.string().email(),
        supportPhone: z.string(),
        description: z.string().optional(),
      })
      .strict(),
    description: z.string(),
    availableCountries: z.array(z.string()),
    details: z.string().optional(),
    cancellationPolicy: z.string().optional(),
  })
  .strict();

export type DBBenefitService = z.infer<typeof DBBenefitServiceSchema>;
