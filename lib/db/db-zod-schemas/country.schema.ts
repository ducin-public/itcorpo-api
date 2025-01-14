import { z } from 'zod';

export const DBCountrySchema = z.object({
    code: z.string(),
    name: z.string(),
});

export type DBCountry = z.infer<typeof DBCountrySchema>;