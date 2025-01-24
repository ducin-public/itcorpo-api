import { z } from 'zod';

export const DBOfficeSchema = z
  .object({
    code: z.string(),
    country: z.string(),
    city: z.string(),
    address: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).strict(),
    capacity: z.number().int(),
    monthlyRental: z.number().int(),
    estateOwner: z
      .object({
        name: z.string(),
        phone: z.string(),
        account: z.string()
      })
      .strict(),
    amenities: z.array(z.string()),
    imgURL: z.string().optional(),
  })
  .strict();

export type DBOffice = z.infer<typeof DBOfficeSchema>;
