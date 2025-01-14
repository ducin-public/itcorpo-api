import { z } from 'zod';

export const DBLogEntrySchema = z.object({
    guid: z.string(),
    timestamp: z.string().datetime(),
    level: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']),
    message: z.string(),
    context: z.object({}).optional()
});

export type DBLog = z.infer<typeof DBLogEntrySchema>;
