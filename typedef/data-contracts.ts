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

/** @example {"US":"United States","UK":"United Kingdom","DE":"Germany"} */
export type Geo = Record<string, string>;

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

/** @example "LUNCH_CARD" */
export type BenefitServiceType =
  | "LUNCH_CARD"
  | "HEALTHCARE"
  | "SPORT_SYSTEM"
  | "CAFETERIA_IO";

/** @example {"id":"60965cfccf2844a6","beneficiary":{"name":"Eva Koster","email":"evko@softix.nl"},"city":"Utrecht","country":"Netherlands","service":"lunch-card","monthlyFee":250,"subscribedAtDate":"2016-01-01"} */
export interface Benefit {
  id: string;
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
}

export interface BenefitInput {
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

export interface OfficeInput {
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

/** @example "ACTIVE" */
export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "ON_HOLD";

/** @example {"id":"579ef28f-c539-41ff-abe2-e4f6b1c1afed","name":"Licensed Cotton Pants","status":"on-hold","budget":490000,"startDate":"2013-04-16","endDate":"2019-04-27","team":[{"id":4247456,"name":"Anna Bahringer"}],"manager":67429059,"description":"Deleniti rerum impedit.\nCum sed eaque quo accusantium."} */
export interface Project {
  id: string;
  name: string;
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

/** @example "US" */
export type Nationality = "US" | "UK" | "FR" | "DE" | "NL" | "PL" | "IT" | "ES";

/** @example "PERMANENT" */
export type ContractType = "CONTRACT" | "PERMANENT";

/** @example {"id":1,"name":"Management"} */
export interface Department {
  id: number;
  name: string;
}

export interface DepartmentInput {
  name: string;
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

/**
 * Employee skill name
 * @example "JavaScript"
 */
export type Skill = string;

/** @example {"id":1234,"nationality":"DE","departmentId":5,"keycardId":"KC-9876","account":"DE89 3704 0044 0532 0130 00","salary":75000,"office":["Berlin","HQ"],"firstName":"Hans","lastName":"Schmidt","title":"Senior Developer","contractType":"PERMANENT","email":"hans.schmidt@itcorpo.com","hiredAt":"2020-01-15T00:00:00.000Z","expiresAt":"2025-01-14T23:59:59.999Z","personalInfo":{"age":35,"phone":"+49 123 456789","email":"hans.schmidt@gmail.com","dateOfBirth":"1988-05-20T00:00:00.000Z","address":{"street":"Alexanderplatz 1","city":"Berlin","country":"Germany"}},"skills":["JavaScript","TypeScript","React"],"bio":"Experienced developer with focus on frontend technologies","imgURL":"hans-schmidt-profile.jpg"} */
export interface Employee {
  id: number;
  nationality: Nationality;
  departmentId: number;
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
  nationality: Nationality;
  departmentId: number;
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