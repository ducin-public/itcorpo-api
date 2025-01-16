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
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBBenefitChargeSchema,
        }),
        benefitServices: new ArrayCollection<DBBenefitService>({
            name: 'benefitServices',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBBenefitServiceSchema,
        }),
        benefitSubscriptions: new ArrayCollection<DBBenefitSubscription>({
            name: 'benefitSubscriptions',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBBenefitSubscriptionSchema,
        }),
        countries: new ArrayCollection<DBCountry>({
            name: 'countries',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBCountrySchema,
        }),
        departments: new ArrayCollection<DBDepartment>({
            name: 'departments',
            accessMode,
            autoIncrement: true,
            collectionSchema: zodDatabaseSchemas.DBDepartmentSchema,
        }),
        employees: new ArrayCollection<DBEmployee>({
            name: 'employees',
            accessMode,
            autoIncrement: true,
            collectionSchema: zodDatabaseSchemas.DBEmployeeSchema,
        }),
        expenses: new ArrayCollection<DBExpense>({
            name: 'expenses',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBExpenseSchema,
        }),
        logs: new ArrayCollection<DBLog>({
            name: 'logs',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBLogEntrySchema,
        }),
        officeAmenities: new ArrayCollection<DBOfficeAmenity>({
            name: 'officeAmenities',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBOfficeAmenitySchema,
        }),
        offices: new ArrayCollection<DBOffice>({
            name: 'offices',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBOfficeSchema,
        }),
        projects: new ArrayCollection<DBProject>({
            name: 'projects',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBProjectSchema,
        }),
        projectTeams: new ArrayCollection<DBProjectTeam>({
            name: 'projectTeams',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBProjectTeamSchema,
        }),
        timeEntries: new ArrayCollection<DBTimeEntry>({
            name: 'timeEntries',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBTimeEntrySchema,
        }),
        timesheetPeriods: new ArrayCollection<DBTimesheetPeriod>({
            name: 'timesheetPeriods',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBTimesheetPeriodSchema,
        }),
    }
}

export type DBConnection = ReturnType<typeof connect>;

export const dbConnection = connect('RW');
export const createInMemoryConnection = () => connect('R');
