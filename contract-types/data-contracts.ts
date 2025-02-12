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

export interface Duration {
  years: number;
  months: number;
  days: number;
}

/**
 * Email address string
 * @format email
 */
export type Email = string;

/** Phone number string */
export type Phone = string;

export interface ErrorResponse {
  /** An application-level error code (**not** HTTP status code) */
  code?: string;
  /** Text description of the error that has occurred */
  message: string;
  /** unique identifier of the error */
  errorGUID?: string;
}

export interface HealthStatus {
  /** @example "HEALTHY" */
  status?: "HEALTHY" | "DEGRADED" | "UNHEALTHY";
  /** @example "All systems operational" */
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
export type Nationality =
  | "US"
  | "UK"
  | "FR"
  | "DE"
  | "NL"
  | "PL"
  | "IT"
  | "ES"
  | "IN";

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

/** @example {"id":1234,"nationality":"DE","department":"Marketing","officeCode":"de-berlin","keycardId":"KC-9876","account":"DE89 3704 0044 0532 0130 00","name":"Hans Schmidt","position":"Senior Developer","email":"hans.schmidt@itcorpo.com","skills":["JavaScript","TypeScript","React"],"bio":"Experienced developer with focus on frontend technologies","imgURL":"hans-schmidt-profile.jpg","employment":{"contractType":"PERMANENT","currentSalary":75000,"startDate":"2020-01-15","endDate":"2025-01-14","employedFor":{"years":5,"months":0,"days":0}},"personalInfo":{"age":35,"phone":"+49 123 456789","email":"hans.schmidt@gmail.com","dateOfBirth":"1988-05-20T00:00:00.000Z","address":{"street":"Alexanderplatz 1","city":"Berlin","country":"Germany"}}} */
export interface Employee {
  /** @example 91720 */
  id: number;
  /** Nationality of employee as an ISO 3166-1 alpha-2 country code */
  nationality: Nationality;
  department: string;
  keycardId: string;
  office: string;
  name: string;
  position: string;
  account: string;
  /** Email address string */
  email: Email;
  employment: {
    /** Type of employment contract */
    contractType: ContractType;
    /** Monetary value in EUR */
    currentSalary: Money;
    /** ISO 8601 date-time string */
    startDate: DateString;
    /** ISO 8601 date-time string */
    endDate?: DateString;
    employedFor: Duration;
  };
  personalInfo: {
    /** @min 0 */
    age: number;
    /** Phone number string */
    phone: Phone;
    /** Email address string */
    email: Email;
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

/** @example {"id":1234,"name":"Hans Schmidt"} */
export interface EmployeeSearchFeed {
  /** @example 91720 */
  id: number;
  name: string;
}

export interface EmployeeInput {
  /** Nationality of employee as an ISO 3166-1 alpha-2 country code */
  nationality: Nationality;
  departmentId: number;
  keycardId: string;
  account: string;
  officeCode: string;
  firstName: string;
  lastName: string;
  position: string;
  /** Email address string */
  email: Email;
  employment: {
    /** Type of employment contract */
    contractType: ContractType;
    /** Monetary value in EUR */
    currentSalary: Money;
    /** ISO 8601 date-time string */
    startDate: DateString;
    /** ISO 8601 date-time string */
    endDate?: DateString;
  };
  personalInfo: {
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

/** @example {"latitude":52.52,"longitude":13.405} */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

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
  estateOwner: {
    name: string;
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
  coordinates: Coordinates;
  /** @min 1 */
  capacity: number;
  /** Monetary value in EUR */
  monthlyRental: Money;
  estateOwner: {
    name: string;
    phone: string;
    account: string;
  };
  amenities: OfficeAmenity[];
  imgURL?: string;
}

/**
 * Status of the ongoing project's workflow
 * @example "ACTIVE"
 */
export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";

/**
 * Level of employee engagement in the project
 * @example "FULL_TIME"
 */
export type EngagementLevel =
  | "FULL_TIME"
  | "PARTIAL_PLUS"
  | "HALF_TIME"
  | "ON_DEMAND";

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
  endDate?: string;
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

/** Employee's involvement in a project */
export interface ProjectEmployeeInvolvement {
  employeeId: number;
  projectId: string;
  employeeName: string;
  employeePosition: string;
  /** @example "https://placekitten.com/200/200" */
  employeeURL?: string;
  projectName: string;
  /** Status of the ongoing project's workflow */
  projectStatus: ProjectStatus;
  /** Level of employee engagement in the project */
  engagementLevel: EngagementLevel;
  /** ISO 8601 date-time string */
  startDate: DateString;
  /** ISO 8601 date-time string */
  endDate?: DateString;
  duration: Duration;
}
