import { z } from 'zod';

import { BenefitCharge, BenefitService, BenefitSubscription, Department, Employee, EngagementLevel, Expense, Geo, Office, OfficeAmenity, Project } from '../contract-types/data-contracts';

const ENGAGEMENT_LEVELS = ['FULL_TIME', 'PARTIAL_PLUS', 'HALF_TIME', 'ON_DEMAND'] as const;

export const dbProjectTeamSchema = z.object({
    employeeId: z.number(),
    projectId: z.string(),
    employeeName: z.string(),
    projectName: z.string(),
    engagementLevel: z.enum(ENGAGEMENT_LEVELS),
    since: z.string()
});

export type DBProjectTeam = z.infer<typeof dbProjectTeamSchema>;

export const dbProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    budget: z.number(),
    status: z.enum(['PLANNING', 'ACTIVE', 'COMPLETED', 'ON_HOLD']),
    startDate: z.string(),
    endDate: z.string().nullable()
});

export type DBProject = Omit<Project, 'team'>;

export const ACTIVITY_TYPES = ["DEVELOPMENT", "MEETINGS", "DOCUMENTATION", "SUPPORT", "OTHER"] as const;
export const activityTypeSchema = z.enum(ACTIVITY_TYPES);
export type ActivityType = z.infer<typeof activityTypeSchema>;

export const TIMESHEET_STATUSES = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"] as const;
export const timesheetStatusSchema = z.enum(TIMESHEET_STATUSES);
export type TimesheetStatus = z.infer<typeof timesheetStatusSchema>;

export const dbTimeEntrySchema = z.object({
    id: z.string(),
    employeeId: z.number(),
    projectId: z.string(),
    date: z.string().date(),
    hours: z.number().min(0).max(24),
    description: z.string(),
    activityType: activityTypeSchema,
    billable: z.boolean()
});
export type DBTimeEntry = z.infer<typeof dbTimeEntrySchema>;

export const dbTimesheetPeriodSchema = z.object({
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
export type DBTimesheetPeriod = z.infer<typeof dbTimesheetPeriodSchema>;

export const zodDatabaseSchemas = {
    project: dbProjectSchema,
    projectTeam: dbProjectTeamSchema,
    timeEntry: dbTimeEntrySchema,
    timesheetPeriod: dbTimesheetPeriodSchema
};

export type DBOffice = Office;
export type DBOfficeAmenity = OfficeAmenity;

export interface DbSchema {
    logs: unknown[]
    benefitServices: BenefitService[];
    benefitSubscriptions: BenefitSubscription[];
    benefitCharges: BenefitCharge[];
    departments: Department[];
    employees: Employee[];
    expenses: Expense[];
    geo: Geo;
    officeAmenities: DBOfficeAmenity[];
    offices: DBOffice[];
    projectTeams: DBProjectTeam[];
    projects: DBProject[];
    timeEntries: DBTimeEntry[];
    timesheetPeriods: DBTimesheetPeriod[];
}
