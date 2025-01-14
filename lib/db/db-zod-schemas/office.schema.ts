import { z } from 'zod';

export const DBOfficeSchema = z
  .object({
    code: z.string(),
    country: z.string(),
    city: z.string(),
    address: z.string(),
    capacity: z.number().int(),
    monthlyRental: z.number().int(),
    estate: z
      .object({ owner: z.string(), phone: z.string(), account: z.string() })
      .strict(),
    amenities: z.array(z.string()),
    imgURL: z.string().optional(),
  })
  .strict();

export type DBOffice = z.infer<typeof DBOfficeSchema>;
