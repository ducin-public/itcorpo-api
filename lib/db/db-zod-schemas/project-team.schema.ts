import { z } from 'zod';

const ENGAGEMENT_LEVELS = ['FULL_TIME', 'PARTIAL_PLUS', 'HALF_TIME', 'ON_DEMAND'] as const;

export const DBProjectTeamSchema = z.object({
    employeeId: z.number(),
    projectId: z.string(),
    employeeName: z.string(),
    projectName: z.string(),
    engagementLevel: z.enum(ENGAGEMENT_LEVELS),
    since: z.string()
});

export type DBProjectTeam = z.infer<typeof DBProjectTeamSchema>;
