import { z } from 'zod';

export const ACTIVITY_TYPES = ["DEVELOPMENT", "MEETINGS", "DOCUMENTATION", "SUPPORT", "OTHER"] as const;
export const activityTypeSchema = z.enum(ACTIVITY_TYPES);
export type ActivityType = z.infer<typeof activityTypeSchema>;

export const DBTimeEntrySchema = z.object({
    id: z.string(),
    employeeId: z.number(),
    projectId: z.string(),
    date: z.string().date(),
    hours: z.number().min(0).max(24),
    description: z.string(),
    activityType: activityTypeSchema,
    billable: z.boolean()
});
export type DBTimeEntry = z.infer<typeof DBTimeEntrySchema>;
