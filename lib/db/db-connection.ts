import { ArrayCollection } from "./db-array-collection";

import { zodDatabaseSchemas } from "./db-zod-schemas";
import { DBBenefitCharge } from "./db-zod-schemas/benefit-charge.schema";
import { DBBenefitService } from "./db-zod-schemas/benefit-service.schema";
import { DBBenefitSubscription } from "./db-zod-schemas/benefit-subscription.schema";
import { DBCountry } from "./db-zod-schemas/country.schema";
import { DBDepartment } from "./db-zod-schemas/department.schema";
import { DBEmployee } from "./db-zod-schemas/employee.schema";
import { DBExpense } from "./db-zod-schemas/expense.schema";
import { DBLog } from "./db-zod-schemas/log.schema";
import { DBOfficeAmenity } from "./db-zod-schemas/office-amenity.schema";
import { DBOffice } from "./db-zod-schemas/office.schema";
import { DBProjectTeam } from "./db-zod-schemas/project-team.schema";
import { DBProject } from "./db-zod-schemas/project.schema";
import { DBTimeEntry } from "./db-zod-schemas/time-entry";
import { DBTimesheetPeriod } from "./db-zod-schemas/timesheet-period";

const connect = (accessMode: "RW" | "R" = "RW") => {
    return {
        benefitCharges: new ArrayCollection<DBBenefitCharge>({
            name: 'benefitCharges',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBBenefitChargeSchema,
        }),
        benefitServices: new ArrayCollection<DBBenefitService>({
            name: 'benefitServices',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBBenefitServiceSchema,
        }),
        benefitSubscriptions: new ArrayCollection<DBBenefitSubscription>({
            name: 'benefitSubscriptions',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBBenefitSubscriptionSchema,
        }),
        countries: new ArrayCollection<DBCountry>({
            name: 'countries',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBCountrySchema,
        }),
        departments: new ArrayCollection<DBDepartment>({
            name: 'departments',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBDepartmentSchema,
        }),
        employees: new ArrayCollection<DBEmployee>({
            name: 'employees',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBEmployeeSchema,
        }),
        expenses: new ArrayCollection<DBExpense>({
            name: 'expenses',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBExpenseSchema,
        }),
        logs: new ArrayCollection<DBLog>({
            name: 'logs',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBLogEntrySchema,
        }),
        officeAmenities: new ArrayCollection<DBOfficeAmenity>({
            name: 'officeAmenities',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBOfficeAmenitySchema,
        }),
        offices: new ArrayCollection<DBOffice>({
            name: 'offices',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBOfficeSchema,
        }),
        projects: new ArrayCollection<DBProject>({
            name: 'projects',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBProjectSchema,
        }),
        projectTeams: new ArrayCollection<DBProjectTeam>({
            name: 'projectTeams',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBProjectTeamSchema,
        }),
        timeEntries: new ArrayCollection<DBTimeEntry>({
            name: 'timeEntries',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBTimeEntrySchema,
        }),
        timesheetPeriods: new ArrayCollection<DBTimesheetPeriod>({
            name: 'timesheetPeriods',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBTimesheetPeriodSchema,
        }),
    }
}

export type DBConnection = ReturnType<typeof connect>;

export const dbConnection = connect('RW');
export const createInMemoryConnection = () => connect('R');
