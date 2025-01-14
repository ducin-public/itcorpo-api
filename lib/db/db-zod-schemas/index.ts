import { DBLogEntrySchema } from "./log.schema";
import { DBProjectSchema } from "./project.schema";
import { DBProjectTeamSchema } from "./project-team.schema";
import { DBTimeEntrySchema } from "./time-entry";
import { DBTimesheetPeriodSchema } from "./timesheet-period";
import { DBBenefitServiceSchema } from "./benefit-service.schema";
import { DBBenefitSubscriptionSchema } from "./benefit-subscription.schema";
import { DBBenefitChargeSchema } from "./benefit-charge.schema";
import { DBDepartmentSchema } from "./department.schema";
import { DBEmployeeSchema } from "./employee.schema";
import { DBExpenseSchema } from "./expense.schema";
import { DBOfficeAmenitySchema } from "./office-amenity.schema";
import { DBOfficeSchema } from "./office.schema";
import { DBCountrySchema } from "./country.schema";

export const zodDatabaseSchemas = {
    DBBenefitServiceSchema,
    DBBenefitSubscriptionSchema,
    DBBenefitChargeSchema,
    DBCountrySchema,
    DBDepartmentSchema,
    DBEmployeeSchema,
    DBExpenseSchema,
    DBLogEntrySchema,
    DBOfficeAmenitySchema,
    DBOfficeSchema,
    DBProjectSchema,
    DBProjectTeamSchema,
    DBTimeEntrySchema,
    DBTimesheetPeriodSchema
};