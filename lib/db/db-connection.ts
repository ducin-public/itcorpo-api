import { DB_FILE } from "../files";
import { ArrayCollection } from "./db-collection";

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
            path: DB_FILE('benefitCharges'),
            name: 'benefitCharges',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBBenefitChargeSchema,
        }),
        benefitServices: new ArrayCollection<DBBenefitService>({
            path: DB_FILE('benefitServices'),
            name: 'benefitServices',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBBenefitServiceSchema,
        }),
        benefitSubscriptions: new ArrayCollection<DBBenefitSubscription>({
            path: DB_FILE('benefitSubscriptions'),
            name: 'benefitSubscriptions',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBBenefitSubscriptionSchema,
        }),
        countries: new ArrayCollection<DBCountry>({
            path: DB_FILE('countries'),
            name: 'countries',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBCountrySchema,
        }),
        departments: new ArrayCollection<DBDepartment>({
            path: DB_FILE('departments'),
            name: 'departments',
            accessMode,
            autoIncrement: true,
            collectionSchema: zodDatabaseSchemas.DBDepartmentSchema,
        }),
        employees: new ArrayCollection<DBEmployee>({
            path: DB_FILE('employees'),
            name: 'employees',
            accessMode,
            autoIncrement: true,
            collectionSchema: zodDatabaseSchemas.DBEmployeeSchema,
        }),
        expenses: new ArrayCollection<DBExpense>({
            path: DB_FILE('expenses'),
            name: 'expenses',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBExpenseSchema,
        }),
        logs: new ArrayCollection<DBLog>({
            path: DB_FILE('logs'),
            name: 'logs',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBLogEntrySchema,
        }),
        officeAmenities: new ArrayCollection<DBOfficeAmenity>({
            path: DB_FILE('officeAmenities'),
            name: 'officeAmenities',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBOfficeAmenitySchema,
        }),
        offices: new ArrayCollection<DBOffice>({
            path: DB_FILE('offices'),
            name: 'offices',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBOfficeSchema,
        }),
        projects: new ArrayCollection<DBProject>({
            path: DB_FILE('projects'),
            name: 'projects',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBProjectSchema,
        }),
        projectTeams: new ArrayCollection<DBProjectTeam>({
            path: DB_FILE('projectTeams'),
            name: 'projectTeams',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBProjectTeamSchema,
        }),
        timeEntries: new ArrayCollection<DBTimeEntry>({
            path: DB_FILE('timeEntries'),
            name: 'timeEntries',
            accessMode,
            autoIncrement: false,
            collectionSchema: zodDatabaseSchemas.DBTimeEntrySchema,
        }),
        timesheetPeriods: new ArrayCollection<DBTimesheetPeriod>({
            path: DB_FILE('timesheetPeriods'),
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
