import { z } from 'zod';

export const DBOfficeAmenitySchema = z
  .object({
    code: z.string(),
    name: z.string(),
  })
  .strict();

export type DBOfficeAmenity = z.infer<typeof DBOfficeAmenitySchema>;
