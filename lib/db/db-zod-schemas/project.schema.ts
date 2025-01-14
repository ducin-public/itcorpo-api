import { z } from 'zod';

export const DBProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    budget: z.number(),
    status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'ON_HOLD']),
    startDate: z.string(),
    endDate: z.string().optional(),
    manager: z.number().int(),
    description: z.string(),
});

export type DBProject = z.infer<typeof DBProjectSchema>;
