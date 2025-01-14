import { z } from 'zod';

export const TIMESHEET_STATUSES = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"] as const;
export const timesheetStatusSchema = z.enum(TIMESHEET_STATUSES);
export type TimesheetStatus = z.infer<typeof timesheetStatusSchema>;

export const DBTimesheetPeriodSchema = z.object({
    id: z.string(),
    startDate: z.string().date(),
    endDate: z.string().date(),
    status: timesheetStatusSchema,
    employeeId: z.number(),
    totalHours: z.number(),
    billableHours: z.number(),
    submittedAt: z.string().datetime().optional(),
    approvedAt: z.string().datetime().optional(),
    approvedBy: z.number().optional(),
    comments: z.string().optional()
});
export type DBTimesheetPeriod = z.infer<typeof DBTimesheetPeriodSchema>;
