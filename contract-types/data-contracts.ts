/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Monetary value in EUR */
export type Money = number;

/**
 * ISO 8601 date-time string
 * @format date-time
 */
export type DateString = string;

/**
 * Email address string
 * @format email
 */
export type Email = string;

/**
 * Phone number string
 * @pattern ^[+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$
 */
export type Phone = string;

export interface ErrorResponse {
  code?: string;
  message: string;
}

export interface HealthStatus {
  /** @example "ERROR" */
  status?: string;
  /** @example "Database connection failed" */
  message?: string;
  [key: string]: any;
}

/** @example "HEALTHCARE" */
export type BenefitCategory =
  | "HEALTHCARE"
  | "SPORT_WELLNESS"
  | "LUNCH_FOOD"
  | "CULTURE_RECREATION";

export interface BenefitService {
  code: string;
  /**
   * Display name of the service
   * @example "Medicover Healthcare Premium"
   */
  name: string;
  category: BenefitCategory;
  provider: {
    /** @example "Medicover" */
    name: string;
    /**
     * @format uri
     * @example "https://medicover.com"
     */
    website: string;
    /** Email address string */
    contactEmail: Email;
    /** Phone number string */
    supportPhone: Phone;
    description?: string;
  };
  /** @example "Premium healthcare package including dental and specialist care" */
  description: string;
  /** @example ["PL","DE","NL"] */
  availableCountries: string[];
  /**
   * Combined features and limitations in a formatted text
   * @example "Features:
   * - Dental care
   * - 24/7 hotline
   * - Mobile app
   *
   * Limitations:
   * - 14 days waiting period
   * - Excludes pre-existing conditions"
   */
  details?: string;
  /** @example "1 month notice required" */
  cancellationPolicy?: string;
}

/** @example {"id":"60965cfccf2844a6","beneficiary":{"name":"Eva Koster","email":"evko@softix.nl"},"city":"Utrecht","country":"Netherlands","service":{"name":"MultiSport Active Plus","provider":"Benefit Systems"},"monthlyFee":250,"subscribedAtDate":"2016-01-01","cancelledAtDate":"2016-05-31"} */
export interface BenefitSubscription {
  id: string;
  service: {
    name: string;
    provider: string;
  };
  beneficiary: {
    name: string;
    /** @format email */
    email: string;
  };
  category: BenefitCategory;
  country: string;
  city: string;
  /** Monetary value in EUR */
  monthlyFee: Money;
  /** @format date */
  subscribedAtDate: string;
  /** @format date */
  cancelledAtDate?: string;
}

export interface BenefitSubscriptionInput {
  beneficiary: {
    name: string;
    /** @format email */
    email: string;
  };
  country: string;
  city: string;
  service: string;
  /** Monetary value in EUR */
  monthlyFee: Money;
  /** @format date */
  subscribedAtDate: string;
  /** @format date */
  cancelledAtDate?: string;
}

/**
 * Status filter for benefit subscriptions
 * @example "ACTIVE"
 */
export type BenefitSubscriptionSearchStatus = "ALL" | "ACTIVE" | "CANCELLED";

/** Criteria for filtering benefit subscriptions */
export interface BenefitsSearchCriteria {
  /**
   * Filter benefits by service name
   * @example "MultiSport"
   */
  serviceName?: string;
  /**
   * Comma-separated list of category codes to filter by. The search result will return benefits that match any of the provided categories (`ANY`).
   * @example "HEALTHCARE,SPORT_WELLNESS"
   */
  categories?: string;
  /**
   * The employee whom this benefit is subscribed to
   * @example "123"
   */
  employeeId?: string;
  /**
   * Minimum monthly fee amount
   * @example "100"
   */
  feeFrom?: string;
  /**
   * Maximum monthly fee amount
   * @example "500.50"
   */
  feeTo?: string;
  /**
   * Status filter for benefit subscriptions
   * @example "ACTIVE"
   */
  status?: BenefitSubscriptionSearchStatus;
}

/** Payment status of a benefit charge */
export type BenefitChargeStatus =
  | "PENDING"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED"
  | "REFUNDED";

export interface BenefitCharge {
  /** @format uuid */
  id: string;
  employeeId: number;
  subscriptionId: string;
  providerServiceCode: string;
  /** @format date */
  billingPeriodStart: string;
  /** @format date */
  billingPeriodEnd: string;
  /** Monetary value in EUR */
  amount: Money;
  /** Payment status of a benefit charge */
  status: BenefitChargeStatus;
}

/** Criteria for filtering benefit charges */
export interface BenefitChargesSearchCriteria {
  /**
   * Filter charges by subscription ID
   * @example "zc9b3b4c-1b1d-4b3e-8b3b-4c1b1d4b3e8b"
   */
  subscriptionId?: string;
  /**
   * Filter charges by subscription ID
   * @example 91720
   */
  employeeId?: number;
  /**
   * Filter charges by provider service code
   * @example "MEDICOVER_PREMIUM"
   */
  providerServiceCode?: string;
  /**
   * Filter charges by status
   * @example "PAID"
   */
  status?: BenefitChargeStatus;
  /**
   * Filter charges with billing period starting from this date
   * @format date
   * @example "2023-01-01"
   */
  billingPeriodFrom?: string;
  /**
   * Filter charges with billing period ending before this date
   * @format date
   * @example "2023-12-31"
   */
  billingPeriodTo?: string;
}

/** @example {"id":1,"name":"Management"} */
export interface Department {
  id: number;
  name: string;
}

export interface DepartmentInput {
  name: string;
}

/**
 * Nationality of employee as an ISO 3166-1 alpha-2 country code
 * @example "US"
 */
export type Nationality = "US" | "UK" | "FR" | "DE" | "NL" | "PL" | "IT" | "ES";

/**
 * Type of employment contract
 * @example "PERMANENT"
 */
export type ContractType = "CONTRACT" | "PERMANENT";

/**
 * Employee skill name
 * @example "JavaScript"
 */
export type Skill = string;

/** @example {"id":1234,"nationality":"DE","department":"Marketing","keycardId":"KC-9876","account":"DE89 3704 0044 0532 0130 00","salary":75000,"office":["Berlin","HQ"],"firstName":"Hans","lastName":"Schmidt","title":"Senior Developer","contractType":"PERMANENT","email":"hans.schmidt@itcorpo.com","hiredAt":"2020-01-15T00:00:00.000Z","expiresAt":"2025-01-14T23:59:59.999Z","personalInfo":{"age":35,"phone":"+49 123 456789","email":"hans.schmidt@gmail.com","dateOfBirth":"1988-05-20T00:00:00.000Z","address":{"street":"Alexanderplatz 1","city":"Berlin","country":"Germany"}},"skills":["JavaScript","TypeScript","React"],"bio":"Experienced developer with focus on frontend technologies","imgURL":"hans-schmidt-profile.jpg"} */
export interface Employee {
  /** @example 91720 */
  id: number;
  /** Nationality of employee as an ISO 3166-1 alpha-2 country code */
  nationality: Nationality;
  department: string;
  keycardId: string;
  account: string;
  /** Monetary value in EUR */
  salary: Money;
  /**
   * @maxItems 2
   * @minItems 2
   */
  office: string[];
  firstName: string;
  lastName: string;
  title: string;
  /** Type of employment contract */
  contractType: ContractType;
  /** Email address string */
  email: Email;
  /** ISO 8601 date-time string */
  hiredAt: DateString;
  /** ISO 8601 date-time string */
  expiresAt: DateString;
  personalInfo: {
    /** @min 0 */
    age: number;
    /** Phone number string */
    phone: Phone;
    /** Email address string */
    email: Email;
    /** ISO 8601 date-time string */
    dateOfBirth: DateString;
    address: {
      street: string;
      city: string;
      country: string;
    };
  };
  skills: Skill[];
  bio: string;
  imgURL?: string;
}

export interface EmployeeInput {
  /** Nationality of employee as an ISO 3166-1 alpha-2 country code */
  nationality: Nationality;
  department: string;
  keycardId: string;
  account: string;
  /** Monetary value in EUR */
  salary: Money;
  /**
   * @maxItems 2
   * @minItems 2
   */
  office: string[];
  firstName: string;
  lastName: string;
  title: string;
  /** Type of employment contract */
  contractType: ContractType;
  /** Email address string */
  email: Email;
  /** ISO 8601 date-time string */
  hiredAt: DateString;
  /** ISO 8601 date-time string */
  expiresAt: DateString;
  personalInfo: {
    /** @min 0 */
    age: number;
    /** Phone number string */
    phone: Phone;
    /** Email address string */
    email: Email;
    /** ISO 8601 date-time string */
    dateOfBirth: DateString;
    address: {
      street: string;
      city: string;
      country: string;
    };
  };
  skills: Skill[];
  bio: string;
  imgURL?: string;
}

/** Criteria for filtering employees */
export interface EmployeesSearchCriteria {
  /**
   * Filter employees by name
   * @example "John Doe"
   */
  employeeName?: string;
  /**
   * Filter employees by department ID
   * @example "123"
   */
  departmentId?: string;
  /**
   * Filter employees by skills according to `skillsFiltering`
   * @example "JavaScript,React"
   */
  skills?: string;
  /**
   * If more than one skill is passed, return either employees with any of the skills (`ANY`) or with all of them (`ALL`)
   * @default "ANY"
   * @example "ANY"
   */
  skillsFiltering?: "ANY" | "ALL";
  /**
   * Minimum salary amount
   * @example "5000"
   */
  salaryFrom?: string;
  /**
   * Maximum salary amount
   * @example "10000"
   */
  salaryTo?: string;
}

/** @example {"id":"f1c436a7-d9f5-4214-9be1-79766750b53b","amount":10927,"title":"salary","payerAccount":"DE89 3704 0044 0532 0130 00","beneficiaryAccount":"PL61 1090 1014 0000 0712 1981 2874","beneficiaryAddress":"445 Mount Eden Road, Mount Eden, Auckland","scheduledAt":"2017-02-17T22:01:36.530Z"} */
export interface Expense {
  id: string;
  /** Monetary value in EUR */
  amount: Money;
  title: string;
  payerAccount: string;
  beneficiaryAccount: string;
  beneficiaryAddress: string;
  /** @format date-time */
  scheduledAt: string;
}

export interface ExpenseInput {
  /** Monetary value in EUR */
  amount: Money;
  title: string;
  payerAccount: string;
  beneficiaryAccount: string;
  beneficiaryAddress: string;
  /** @format date-time */
  scheduledAt: string;
}

/** @example {"US":"United States","UK":"United Kingdom","DE":"Germany"} */
export type Geo = Record<string, string>;

/** @example {"code":"parking","name":"PARKING"} */
export interface OfficeAmenity {
  /** Unique code identifier of the amenity */
  code: string;
  /** Display name of the amenity */
  name: string;
}

/** @example {"country":"Netherlands","city":"Amsterdam","address":"Damrak 81","capacity":150,"monthlyRental":10000,"estate":{"owner":"B2C Estates and Sons","phone":"(7364) 079343","account":"NL86 AMUJ 9303 4156 60"},"amenities":[{"code":"OUTDOOR_SEATING","name":"Outdoor seating"},{"code":"OPEN_SPACE","name":"Open space"}],"imgURL":"amsterdam-6Uf6-XCKJ-qTKq-ISt2-B3SE.jpg"} */
export interface Office {
  code: string;
  country: string;
  city: string;
  address: string;
  /** @min 1 */
  capacity: number;
  /** Monetary value in EUR */
  monthlyRental: Money;
  estate: {
    owner: string;
    phone: string;
    account: string;
  };
  amenities: string[];
  imgURL?: string;
}

export interface OfficeInput {
  code: string;
  country: string;
  city: string;
  address: string;
  /** @min 1 */
  capacity: number;
  /** Monetary value in EUR */
  monthlyRental: Money;
  estate: {
    owner: string;
    phone: string;
    account: string;
  };
  amenities: OfficeAmenity[];
  imgURL?: string;
}

/** Criteria for filtering offices */
export interface OfficesSearchCriteria {
  /**
   * Comma-separated list of country codes to filter by
   * @example "PL,US"
   */
  countries?: string;
  /**
   * Comma-separated list of amenity codes to filter by
   * @example "FREE_PARKING,SHOWER"
   */
  amenities?: string;
  /**
   * If more than one amenity is passed, return either offices with any of the amenities (`ANY`) or with all of them (`ALL`)
   * @default "ANY"
   * @example "ANY"
   */
  amenitiesFiltering?: "ANY" | "ALL";
  /**
   * Full text search across country, city, address and estate owner fields
   * @example "Amsterdam central"
   */
  phrase?: string;
}

/**
 * Status of the ongoing project's workflow
 * @example "ACTIVE"
 */
export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";

/** @example {"id":"579ef28f-c539-41ff-abe2-e4f6b1c1afed","name":"Licensed Cotton Pants","status":"on-hold","budget":490000,"startDate":"2013-04-16","endDate":"2019-04-27","team":[{"id":4247456,"name":"Anna Bahringer"}],"manager":67429059,"description":"Deleniti rerum impedit.\nCum sed eaque quo accusantium."} */
export interface Project {
  id: string;
  name: string;
  /** Status of the ongoing project's workflow */
  status: ProjectStatus;
  /** Monetary value in EUR */
  budget: Money;
  /** @format date */
  startDate: string;
  /** @format date */
  endDate: string;
  team: {
    id: number;
    name: string;
  }[];
  manager: number;
  description: string;
}

export interface ProjectInput {
  name: string;
  /** Status of the ongoing project's workflow */
  status: ProjectStatus;
  /** Monetary value in EUR */
  budget: Money;
  /** @format date */
  startDate: string;
  /** @format date */
  endDate: string;
  team: {
    id: number;
    name: string;
  }[];
  manager: number;
  description: string;
}

/** Criteria for filtering projects */
export interface ProjectsSearchCriteria {
  /**
   * Filter projects by name
   * @example "Cloud migration"
   */
  projectName?: string;
  /**
   * Filter projects by status
   * @example "ACTIVE"
   */
  status?: ProjectStatus;
  /**
   * Filter projects by team member IDs according to `teamMembersFiltering`
   * @example "123,456,789"
   */
  teamMembers?: string;
  /**
   * If more than one ID is passed, return either projects with any of the team members (`ANY`) or with all of them (`ALL`)
   * @default "ANY"
   * @example "ANY"
   */
  teamMembersFiltering?: "ANY" | "ALL";
  /**
   * Minimum project budget amount
   * @example "10000"
   */
  budgetFrom?: string;
  /**
   * Maximum project budget amount
   * @example "50000"
   */
  budgetTo?: string;
}
