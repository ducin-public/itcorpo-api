import { z } from "zod";

const ErrorResponse = z
  .object({ code: z.string().optional(), message: z.string() })
  .strict()
  .passthrough();
const HealthStatus = z.record(z.string());
const BenefitCategory = z.enum([
  "HEALTHCARE",
  "SPORT_WELLNESS",
  "LUNCH_FOOD",
  "CULTURE_RECREATION",
]);
const Email = z.string();
const Phone = z.string();
const BenefitService = z
  .object({
    code: z.string(),
    name: z.string(),
    category: BenefitCategory,
    provider: z
      .object({
        name: z.string(),
        website: z.string().url(),
        contactEmail: Email.email(),
        supportPhone: Phone,
        description: z.string().optional(),
      })
      .strict()
      .passthrough(),
    description: z.string(),
    availableCountries: z.array(z.string()),
    details: z.string().optional(),
    cancellationPolicy: z.string().optional(),
  })
  .strict()
  .passthrough();
const Money = z.number();
const BenefitSubscription = z
  .object({
    id: z.string(),
    service: z
      .object({ name: z.string(), provider: z.string() })
      .strict()
      .passthrough(),
    beneficiary: z
      .object({ name: z.string(), email: z.string().email() })
      .strict()
      .passthrough(),
    category: BenefitCategory,
    country: z.string(),
    city: z.string(),
    monthlyFee: Money,
    subscribedAtDate: z.string(),
    cancelledAtDate: z.string().optional(),
  })
  .strict()
  .passthrough();
const BenefitSubscriptionInput = z
  .object({
    beneficiary: z
      .object({ name: z.string(), email: z.string().email() })
      .strict()
      .passthrough(),
    country: z.string(),
    city: z.string(),
    service: z.string(),
    monthlyFee: Money,
    subscribedAtDate: z.string(),
    cancelledAtDate: z.string().optional(),
  })
  .strict()
  .passthrough();
const updateBenefitSubscriptionStatus_Body = z
  .object({ operation: z.enum(["CANCEL", "RENEW"]) })
  .strict()
  .passthrough();
const BenefitChargeStatus = z.enum([
  "PENDING",
  "PAID",
  "OVERDUE",
  "CANCELLED",
  "REFUNDED",
]);
const BenefitCharge = z
  .object({
    id: z.string().uuid(),
    employeeId: z.number().int(),
    subscriptionId: z.string(),
    providerServiceCode: z.string(),
    billingPeriodStart: z.string(),
    billingPeriodEnd: z.string(),
    amount: Money,
    status: BenefitChargeStatus,
  })
  .strict()
  .passthrough();
const Department = z
  .object({ id: z.number().int(), name: z.string() })
  .strict()
  .passthrough();
const DepartmentInput = z.object({ name: z.string() }).strict().passthrough();
const Nationality = z.enum([
  "US",
  "UK",
  "FR",
  "DE",
  "NL",
  "PL",
  "IT",
  "ES",
  "IN",
]);
const ContractType = z.enum(["CONTRACT", "PERMANENT"]);
const DateString = z.string();
const Skill = z.string();
const Employee = z
  .object({
    id: z.number().int(),
    nationality: Nationality,
    department: z.string(),
    keycardId: z.string(),
    account: z.string(),
    salary: Money,
    office: z.array(z.string()).min(2).max(2),
    firstName: z.string(),
    lastName: z.string(),
    title: z.string(),
    contractType: ContractType,
    email: Email.email(),
    hiredAt: DateString.datetime({ offset: true }),
    expiresAt: DateString.datetime({ offset: true }),
    personalInfo: z
      .object({
        age: z.number().int().gte(0),
        phone: Phone,
        email: Email.email(),
        dateOfBirth: DateString.datetime({ offset: true }),
        address: z
          .object({ street: z.string(), city: z.string(), country: z.string() })
          .strict()
          .passthrough(),
      })
      .strict()
      .passthrough(),
    skills: z.array(Skill),
    bio: z.string(),
    imgURL: z.string().optional(),
  })
  .strict()
  .passthrough();
const EmployeeInput = z
  .object({
    nationality: Nationality,
    departmentId: z.number(),
    keycardId: z.string(),
    account: z.string(),
    salary: Money,
    office: z.array(z.string()).min(2).max(2),
    firstName: z.string(),
    lastName: z.string(),
    title: z.string(),
    contractType: ContractType,
    email: Email.email(),
    hiredAt: DateString.datetime({ offset: true }),
    expiresAt: DateString.datetime({ offset: true }),
    personalInfo: z
      .object({
        age: z.number().int().gte(0),
        phone: Phone,
        email: Email.email(),
        dateOfBirth: DateString.datetime({ offset: true }),
        address: z
          .object({ street: z.string(), city: z.string(), country: z.string() })
          .strict()
          .passthrough(),
      })
      .strict()
      .passthrough(),
    skills: z.array(Skill),
    bio: z.string(),
    imgURL: z.string().optional(),
  })
  .strict()
  .passthrough();
const ProjectStatus = z.enum(["PLANNING", "ACTIVE", "COMPLETED", "ON_HOLD"]);
const EngagementLevel = z.enum([
  "FULL_TIME",
  "PARTIAL_PLUS",
  "HALF_TIME",
  "ON_DEMAND",
]);
const ProjectEmployeeInvolvement = z
  .object({
    employeeId: z.number().int(),
    projectId: z.string(),
    employeeName: z.string(),
    projectName: z.string(),
    projectStatus: ProjectStatus,
    engagementLevel: EngagementLevel,
    since: z.string(),
  })
  .strict()
  .passthrough();
const Expense = z
  .object({
    id: z.string(),
    amount: Money,
    title: z.string(),
    payerAccount: z.string(),
    beneficiaryAccount: z.string(),
    beneficiaryAddress: z.string(),
    scheduledAt: z.string().datetime({ offset: true }),
  })
  .strict()
  .passthrough();
const ExpenseInput = z
  .object({
    amount: Money,
    title: z.string(),
    payerAccount: z.string(),
    beneficiaryAccount: z.string(),
    beneficiaryAddress: z.string(),
    scheduledAt: z.string().datetime({ offset: true }),
  })
  .strict()
  .passthrough();
const Geo = z.record(z.string());
const OfficeAmenity = z
  .object({ code: z.string(), name: z.string() })
  .strict()
  .passthrough();
const Office = z
  .object({
    code: z.string(),
    country: z.string(),
    city: z.string(),
    address: z.string(),
    capacity: z.number().int().gte(1),
    monthlyRental: Money,
    estate: z
      .object({ owner: z.string(), phone: z.string(), account: z.string() })
      .strict()
      .passthrough(),
    amenities: z.array(z.string()),
    imgURL: z.string().optional(),
  })
  .strict()
  .passthrough();
const OfficeInput = z
  .object({
    code: z.string(),
    country: z.string(),
    city: z.string(),
    address: z.string(),
    capacity: z.number().int().gte(1),
    monthlyRental: Money,
    estate: z
      .object({ owner: z.string(), phone: z.string(), account: z.string() })
      .strict()
      .passthrough(),
    amenities: z.array(OfficeAmenity),
    imgURL: z.string().optional(),
  })
  .strict()
  .passthrough();
const Project = z
  .object({
    id: z.string(),
    name: z.string(),
    status: ProjectStatus,
    budget: Money,
    startDate: z.string(),
    endDate: z.string().optional(),
    team: z.array(
      z
        .object({ id: z.number().int(), name: z.string() })
        .strict()
        .passthrough()
    ),
    manager: z.number().int(),
    description: z.string(),
  })
  .strict()
  .passthrough();
const ProjectInput = z
  .object({
    name: z.string(),
    status: ProjectStatus,
    budget: Money,
    startDate: z.string(),
    endDate: z.string(),
    team: z.array(
      z
        .object({ id: z.number().int(), name: z.string() })
        .strict()
        .passthrough()
    ),
    manager: z.number().int(),
    description: z.string(),
  })
  .strict()
  .passthrough();

export const contractSchemas = {
  ErrorResponse,
  HealthStatus,
  BenefitCategory,
  Email,
  Phone,
  BenefitService,
  Money,
  BenefitSubscription,
  BenefitSubscriptionInput,
  updateBenefitSubscriptionStatus_Body,
  BenefitChargeStatus,
  BenefitCharge,
  Department,
  DepartmentInput,
  Nationality,
  ContractType,
  DateString,
  Skill,
  Employee,
  EmployeeInput,
  ProjectStatus,
  EngagementLevel,
  ProjectEmployeeInvolvement,
  Expense,
  ExpenseInput,
  Geo,
  OfficeAmenity,
  Office,
  OfficeInput,
  Project,
  ProjectInput,
};

type ContractEndpoint = {
  method: "get" | "post" | "put" | "patch" | "delete";
  path: string;
  alias?: string;
  description?: string;
  requestFormat: "json";
  parameters?: Array<{
    name: string;
    type: "Path" | "Query" | "Body" | "Header";
    schema: z.ZodType<any>;
  }>;
  response: {
    type: "ZOD_SCHEMA";
    schema: z.ZodType<any>;
  };
  errors: Array<{
    status: number;
    description: string;
    schema: z.ZodType<any>;
  }>;
};

export const contractEndpoints: ContractEndpoint[] = [
  {
    method: "get",
    path: "/auth",
    alias: "getAuthToken",
    requestFormat: "json",
    response: {
      type: "ZOD_SCHEMA",
      schema: z.object({ token: z.string() }).strict().passthrough(),
    },
    errors: [
      {
        status: 401,
        description: `Authentication failed`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/benefits",
    alias: "getBenefitSubscriptions",
    requestFormat: "json",
    parameters: [
      {
        name: "serviceName",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "categories",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "employeeId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "feeFrom",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "feeTo",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z.enum(["ALL", "ACTIVE", "CANCELLED"]).optional(),
      },
      {
        name: "_page",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "_pageSize",
        type: "Query",
        schema: z.number().gte(1).lte(50).optional(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(BenefitSubscription),
    },
    errors: [
      {
        status: 400,
        description: `Invalid benefit subscriptions search criteria
`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/benefits",
    alias: "createBenefit",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: BenefitSubscriptionInput,
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: BenefitSubscription,
    },
    errors: [
      {
        status: 400,
        description: `Invalid benefit subscription input request body @see {@link BenefitSubscriptionInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Benefit already exists for this employee and service`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/benefits/:benefitId",
    alias: "getBenefitSubscriptionById",
    requestFormat: "json",
    parameters: [
      {
        name: "benefitId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: BenefitSubscription,
    },
    errors: [
      {
        status: 404,
        description: `Benefit not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/benefits/:benefitId",
    alias: "updateBenefit",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: BenefitSubscriptionInput,
      },
      {
        name: "benefitId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: BenefitSubscription,
    },
    errors: [
      {
        status: 400,
        description: `Invalid benefit subscription input request body @see {@link BenefitSubscriptionInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Benefit not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "patch",
    path: "/benefits/:benefitId",
    alias: "updateBenefitSubscriptionStatus",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: updateBenefitSubscriptionStatus_Body,
      },
      {
        name: "benefitId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: BenefitSubscription,
    },
    errors: [
      {
        status: 400,
        description: `Invalid benefit subscription status update @see {@link BenefitSubscriptionInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Benefit subscription not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/benefits/:benefitId/charges",
    alias: "getBenefitSubscriptionCharges",
    requestFormat: "json",
    parameters: [
      {
        name: "benefitId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "providerServiceCode",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z
          .enum(["PENDING", "PAID", "OVERDUE", "CANCELLED", "REFUNDED"])
          .optional(),
      },
      {
        name: "billingPeriodFrom",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "billingPeriodTo",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "_page",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "_pageSize",
        type: "Query",
        schema: z.number().gte(1).lte(50).optional(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(BenefitCharge),
    },
    errors: [
      {
        status: 400,
        description: `Invalid benefit charges search criteria`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Benefit subscription not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/benefits/charges",
    alias: "getBenefitCharges",
    requestFormat: "json",
    parameters: [
      {
        name: "subscriptionId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "employeeId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "providerServiceCode",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z
          .enum(["PENDING", "PAID", "OVERDUE", "CANCELLED", "REFUNDED"])
          .optional(),
      },
      {
        name: "billingPeriodFrom",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "billingPeriodTo",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "_page",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "_pageSize",
        type: "Query",
        schema: z.number().gte(1).lte(50).optional(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(BenefitCharge),
    },
    errors: [
      {
        status: 400,
        description: `Invalid benefit charges search criteria
`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/benefits/count",
    alias: "getBenefitsCount",
    requestFormat: "json",
    parameters: [
      {
        name: "serviceName",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "categories",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "employeeId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "feeFrom",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "feeTo",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z.enum(["ALL", "ACTIVE", "CANCELLED"]).optional(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.number().int(),
    },
    errors: [
      {
        status: 400,
        description: `Invalid benefit subscriptions search criteria
`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/benefits/services",
    alias: "getBenefitServices",
    requestFormat: "json",
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(BenefitService),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/departments",
    alias: "getDepartments",
    requestFormat: "json",
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(Department),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/departments",
    alias: "createDepartment",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string() }).strict().passthrough(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Department,
    },
    errors: [
      {
        status: 400,
        description: `Invalid department input request body @see {@link DepartmentInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Department with this name already exists`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/departments/:departmentId",
    alias: "getDepartmentById",
    requestFormat: "json",
    parameters: [
      {
        name: "departmentId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Department,
    },
    errors: [
      {
        status: 404,
        description: `Department not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/departments/:departmentId",
    alias: "updateDepartment",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ name: z.string() }).strict().passthrough(),
      },
      {
        name: "departmentId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Department,
    },
    errors: [
      {
        status: 400,
        description: `Invalid department input request body @see {@link DepartmentInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Department not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/departments/:departmentId",
    alias: "deleteDepartment",
    requestFormat: "json",
    parameters: [
      {
        name: "departmentId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.void(),
    },
    errors: [
      {
        status: 404,
        description: `Department not found`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Cannot delete department that has employees`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/departments/count",
    alias: "getDepartmentsCount",
    requestFormat: "json",
    response: {
      type: "ZOD_SCHEMA",
      schema: z.number().int(),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/employees",
    alias: "getEmployees",
    requestFormat: "json",
    parameters: [
      {
        name: "employeeName",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "departmentId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "skills",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "skillsFiltering",
        type: "Query",
        schema: z.enum(["ANY", "ALL"]).optional().default("ANY"),
      },
      {
        name: "salaryFrom",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "salaryTo",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "_page",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "_pageSize",
        type: "Query",
        schema: z.number().gte(1).lte(50).optional(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(Employee),
    },
    errors: [
      {
        status: 400,
        description: `Invalid employees search criteria
`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/employees",
    alias: "createEmployee",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: EmployeeInput,
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Employee,
    },
    errors: [
      {
        status: 400,
        description: `Invalid employee input request body @see {@link EmployeeInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Employee with this email already exists`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `Invalid data state (e.g. department doesn&#x27;t exist, office not found)`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/employees/:employeeId",
    alias: "getEmployeeById",
    requestFormat: "json",
    parameters: [
      {
        name: "employeeId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Employee,
    },
    errors: [
      {
        status: 404,
        description: `Employee not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/employees/:employeeId",
    alias: "updateEmployee",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: EmployeeInput,
      },
      {
        name: "employeeId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Employee,
    },
    errors: [
      {
        status: 400,
        description: `Invalid employee input request body @see {@link EmployeeInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Employee not found`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Email already taken by another employee`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `Invalid data state (e.g. department doesn&#x27;t exist, office not found)`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/employees/:employeeId",
    alias: "deleteEmployee",
    requestFormat: "json",
    parameters: [
      {
        name: "employeeId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.void(),
    },
    errors: [
      {
        status: 404,
        description: `Employee not found`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Cannot delete employee that is assigned to active projects`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/employees/:employeeId/projects",
    alias: "getEmployeeProjects",
    description: `Returns a list of projects that the employee is assigned to.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "employeeId",
        type: "Path",
        schema: z.number().int(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(ProjectEmployeeInvolvement),
    },
    errors: [
      {
        status: 404,
        description: `Employee not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/employees/count",
    alias: "getEmployeesCount",
    requestFormat: "json",
    parameters: [
      {
        name: "employeeName",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "departmentId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "skills",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "skillsFiltering",
        type: "Query",
        schema: z.enum(["ANY", "ALL"]).optional().default("ANY"),
      },
      {
        name: "salaryFrom",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "salaryTo",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.number().int(),
    },
    errors: [
      {
        status: 400,
        description: `Invalid employees search criteria
`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/expenses",
    alias: "getExpenses",
    requestFormat: "json",
    parameters: [
      {
        name: "_page",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "_pageSize",
        type: "Query",
        schema: z.number().gte(1).lte(50).optional(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(Expense),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/expenses",
    alias: "createExpense",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ExpenseInput,
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Expense,
    },
    errors: [
      {
        status: 400,
        description: `Invalid expense input request body @see {@link ExpenseInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Expense with this ID already exists`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `Invalid account numbers or scheduling date in the past`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/expenses/:expenseId",
    alias: "getExpenseById",
    requestFormat: "json",
    parameters: [
      {
        name: "expenseId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Expense,
    },
    errors: [
      {
        status: 404,
        description: `Expense not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/expenses/:expenseId",
    alias: "updateExpense",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ExpenseInput,
      },
      {
        name: "expenseId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Expense,
    },
    errors: [
      {
        status: 400,
        description: `Invalid expense input request body @see {@link ExpenseInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Expense not found`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Cannot modify expense that has been processed`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `Invalid account numbers or scheduling date in the past`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/expenses/:expenseId",
    alias: "deleteExpense",
    requestFormat: "json",
    parameters: [
      {
        name: "expenseId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.void(),
    },
    errors: [
      {
        status: 404,
        description: `Expense not found`,
        schema: z.void(),
      },
      {
        status: 409,
        description: `Cannot delete expense that has been processed`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/expenses/count",
    alias: "getExpensesCount",
    requestFormat: "json",
    response: {
      type: "ZOD_SCHEMA",
      schema: z.number().int(),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/geo",
    alias: "getGeo",
    description: `Returns a dictionary of country codes and country names`,
    requestFormat: "json",
    response: {
      type: "ZOD_SCHEMA",
      schema: z.record(z.string()),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/health",
    alias: "HealthCheck",
    description: `Endpoint to check the health of the API`,
    requestFormat: "json",
    response: {
      type: "ZOD_SCHEMA",
      schema: z.record(z.string()),
    },
    errors: [
      {
        status: 500,
        description: `API is not healthy`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `Server is unhealthy or temporarily unavailable.`,
        schema: z.union([HealthStatus, ErrorResponse]),
      },
    ],
  },
  {
    method: "get",
    path: "/license",
    alias: "getLicense",
    description: `Returns the license text for the API`,
    requestFormat: "json",
    parameters: [
      {
        name: "Content-Type",
        type: "Header",
        schema: z.literal("text/plain"),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.void(),
    },
    errors: [
      {
        status: 400,
        description: `Invalid Content-Type requested
`,
        schema: ErrorResponse,
      },
      {
        status: 403,
        description: `Access to license file forbidden`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `License file not available`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/offices",
    alias: "getOffices",
    requestFormat: "json",
    parameters: [
      {
        name: "phrase",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "countries",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "amenities",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "amenitiesFiltering",
        type: "Query",
        schema: z.enum(["ANY", "ALL"]).optional().default("ANY"),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(Office),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/offices",
    alias: "createOffice",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: OfficeInput,
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Office,
    },
    errors: [
      {
        status: 400,
        description: `Invalid office input request body @see {@link OfficeInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Office with this code already exists`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `Invalid office configuration (e.g. invalid country code, unknown amenity)`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/offices/:officeCode",
    alias: "getOfficeByCode",
    requestFormat: "json",
    parameters: [
      {
        name: "officeCode",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Office,
    },
    errors: [
      {
        status: 404,
        description: `Office not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/offices/:officeCode",
    alias: "updateOffice",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: OfficeInput,
      },
      {
        name: "officeCode",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Office,
    },
    errors: [
      {
        status: 400,
        description: `Invalid office input request body @see {@link OfficeInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Office not found`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Office code already taken by another office`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `Invalid office configuration (e.g. invalid country code, unknown amenity)`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/offices/:officeCode",
    alias: "deleteOffice",
    requestFormat: "json",
    parameters: [
      {
        name: "officeCode",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.void(),
    },
    errors: [
      {
        status: 404,
        description: `Office not found`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Cannot delete office that has assigned employees`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/offices/amenities",
    alias: "getOfficeAmenities",
    description: `Returns an array of office amenity objects that can be assigned to offices`,
    requestFormat: "json",
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(OfficeAmenity),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/offices/amenities/count",
    alias: "getOfficeAmenitiesCount",
    requestFormat: "json",
    response: {
      type: "ZOD_SCHEMA",
      schema: z.number().int(),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/offices/count",
    alias: "getOfficesCount",
    requestFormat: "json",
    parameters: [
      {
        name: "phrase",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "countries",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "amenities",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "amenitiesFiltering",
        type: "Query",
        schema: z.enum(["ANY", "ALL"]).optional().default("ANY"),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.number().int(),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/projects",
    alias: "getProjects",
    requestFormat: "json",
    parameters: [
      {
        name: "projectName",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z
          .enum(["PLANNING", "ACTIVE", "COMPLETED", "ON_HOLD"])
          .optional(),
      },
      {
        name: "teamMembers",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "teamMembersFiltering",
        type: "Query",
        schema: z.enum(["ANY", "ALL"]).optional().default("ANY"),
      },
      {
        name: "budgetFrom",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "budgetTo",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "_page",
        type: "Query",
        schema: z.number().optional(),
      },
      {
        name: "_pageSize",
        type: "Query",
        schema: z.number().gte(1).lte(50).optional(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(Project),
    },
    errors: [
      {
        status: 400,
        description: `Invalid projects search criteria`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "post",
    path: "/projects",
    alias: "createProject",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ProjectInput,
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Project,
    },
    errors: [
      {
        status: 400,
        description: `Invalid project input request body @see {@link ProjectInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Project with this name already exists in given time period`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `Invalid data state (e.g. manager not found, team members don&#x27;t exist, invalid date range)`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/projects/:projectId",
    alias: "getProjectById",
    requestFormat: "json",
    parameters: [
      {
        name: "projectId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Project,
    },
    errors: [
      {
        status: 404,
        description: `Project not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "put",
    path: "/projects/:projectId",
    alias: "updateProject",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: ProjectInput,
      },
      {
        name: "projectId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: Project,
    },
    errors: [
      {
        status: 400,
        description: `Invalid project input request body @see {@link ProjectInput}
`,
        schema: ErrorResponse,
      },
      {
        status: 404,
        description: `Project not found`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Project name already taken by another project in given time period`,
        schema: ErrorResponse,
      },
      {
        status: 422,
        description: `Invalid data state (e.g. manager not found, team members don&#x27;t exist, invalid date range)`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "delete",
    path: "/projects/:projectId",
    alias: "deleteProject",
    requestFormat: "json",
    parameters: [
      {
        name: "projectId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.void(),
    },
    errors: [
      {
        status: 404,
        description: `Project not found`,
        schema: ErrorResponse,
      },
      {
        status: 409,
        description: `Cannot delete project that is in ACTIVE status`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/projects/:projectId/team",
    alias: "getProjectTeam",
    description: `Returns a list of employees that are assigned to the project.
`,
    requestFormat: "json",
    parameters: [
      {
        name: "projectId",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.array(ProjectEmployeeInvolvement),
    },
    errors: [
      {
        status: 404,
        description: `Employee not found`,
        schema: ErrorResponse,
      },
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
  {
    method: "get",
    path: "/projects/count",
    alias: "getProjectsCount",
    requestFormat: "json",
    parameters: [
      {
        name: "projectName",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "status",
        type: "Query",
        schema: z
          .enum(["PLANNING", "ACTIVE", "COMPLETED", "ON_HOLD"])
          .optional(),
      },
      {
        name: "teamMembers",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "teamMembersFiltering",
        type: "Query",
        schema: z.enum(["ANY", "ALL"]).optional().default("ANY"),
      },
      {
        name: "budgetFrom",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "budgetTo",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: {
      type: "ZOD_SCHEMA",
      schema: z.number().int(),
    },
    errors: [
      {
        status: 500,
        description: `An internal server error occurred.`,
        schema: ErrorResponse,
      },
      {
        status: 503,
        description: `The service is temporarily unavailable. Maybe there is maintenance?`,
        schema: ErrorResponse,
      },
    ],
  },
];
