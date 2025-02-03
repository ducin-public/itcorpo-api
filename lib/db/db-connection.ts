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

export type CollectionName = keyof Database;

export type CollectionType<TName extends CollectionName> = Database[TName] extends ArrayCollection<infer T> ? T : never;

export type Database = {
    benefitCharges: ArrayCollection<DBBenefitCharge>;
    benefitServices: ArrayCollection<DBBenefitService>;
    benefitSubscriptions: ArrayCollection<DBBenefitSubscription>;
    countries: ArrayCollection<DBCountry>;
    departments: ArrayCollection<DBDepartment>;
    employees: ArrayCollection<DBEmployee>;
    expenses: ArrayCollection<DBExpense>;
    logs: ArrayCollection<DBLog>;
    officeAmenities: ArrayCollection<DBOfficeAmenity>;
    offices: ArrayCollection<DBOffice>;
    projects: ArrayCollection<DBProject>;
    projectTeams: ArrayCollection<DBProjectTeam>;
    timeEntries: ArrayCollection<DBTimeEntry>;
    timesheetPeriods: ArrayCollection<DBTimesheetPeriod>;
};

const connect = (accessMode: "RW" | "R" = "RW", inMemoryData?: Record<string, any>): Database => {
    const db = {} as Database;

    // Initialize all collections with database reference
    Object.assign(db, {
        benefitCharges: new ArrayCollection<DBBenefitCharge>({
            name: 'benefitCharges',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBBenefitChargeSchema,
            db
        }),
        benefitServices: new ArrayCollection<DBBenefitService>({
            name: 'benefitServices',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBBenefitServiceSchema,
            db
        }),
        benefitSubscriptions: new ArrayCollection<DBBenefitSubscription>({
            name: 'benefitSubscriptions',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBBenefitSubscriptionSchema,
            db
        }),
        countries: new ArrayCollection<DBCountry>({
            name: 'countries',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBCountrySchema,
            db
        }),
        departments: new ArrayCollection<DBDepartment>({
            name: 'departments',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBDepartmentSchema,
            db
        }),
        employees: new ArrayCollection<DBEmployee>({
            name: 'employees',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBEmployeeSchema,
            db
        }),
        expenses: new ArrayCollection<DBExpense>({
            name: 'expenses',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBExpenseSchema,
            db
        }),
        logs: new ArrayCollection<DBLog>({
            name: 'logs',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBLogEntrySchema,
            db
        }),
        officeAmenities: new ArrayCollection<DBOfficeAmenity>({
            name: 'officeAmenities',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBOfficeAmenitySchema,
            db
        }),
        offices: new ArrayCollection<DBOffice>({
            name: 'offices',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBOfficeSchema,
            db
        }),
        projects: new ArrayCollection<DBProject>({
            name: 'projects',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBProjectSchema,
            db
        }),
        projectTeams: new ArrayCollection<DBProjectTeam>({
            name: 'projectTeams',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBProjectTeamSchema,
            db,
            __IN_MEMORY__: inMemoryData?.projectTeams
        }),
        timeEntries: new ArrayCollection<DBTimeEntry>({
            name: 'timeEntries',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBTimeEntrySchema,
            db
        }),
        timesheetPeriods: new ArrayCollection<DBTimesheetPeriod>({
            name: 'timesheetPeriods',
            accessMode,
            collectionSchema: zodDatabaseSchemas.DBTimesheetPeriodSchema,
            db
        }),
    });

    return db;
}

export type DBConnection = ReturnType<typeof connect>;

export const dbConnection = connect('RW');
export const createInMemoryConnection = (data?: Record<string, any>) => connect('R', data);
