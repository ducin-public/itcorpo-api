import { SkillProbabilitySet } from "./types";

import * as TechnicalSkills from './skillset-technical'
import * as BusinessSkills from './skillset-business'
import { ProfileType } from "../profiles";

export type ProfileSkillset = {
  [name in ProfileType]: {
    skillset: SkillProbabilitySet
    probability: number,
  }[]
}

export const profileSkillsets: ProfileSkillset = {
  ENGINEERING_FRONTEND: [
    { skillset: TechnicalSkills.FRONTEND, probability: 1.0 },
    { skillset: TechnicalSkills.TECH_MISC, probability: 0.5 },
    { skillset: TechnicalSkills.ARCH, probability: 0.1 },
    { skillset: TechnicalSkills.QA, probability: 0.4 },
    { skillset: TechnicalSkills.MOBILE, probability: 0.1 },
    { skillset: TechnicalSkills.JAVA_BACKEND, probability: 0.1 },
    { skillset: TechnicalSkills.DOTNET_BACKEND, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.2 },
  ],
  ENGINEERING_BACKEND: [
    { skillset: TechnicalSkills.JAVA_BACKEND, probability: 1.0 },
    { skillset: TechnicalSkills.TECH_MISC, probability: 0.5 },
    { skillset: TechnicalSkills.ARCH, probability: 0.1 },
    { skillset: TechnicalSkills.QA, probability: 0.4 },
    { skillset: TechnicalSkills.MOBILE, probability: 0.1 },
    { skillset: TechnicalSkills.FRONTEND, probability: 0.1 },
    { skillset: TechnicalSkills.DOTNET_BACKEND, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.2 },
  ],
  ENGINEERING_MOBILE: [
    { skillset: TechnicalSkills.MOBILE, probability: 1.0 },
    { skillset: TechnicalSkills.TECH_MISC, probability: 0.5 },
    { skillset: TechnicalSkills.ARCH, probability: 0.1 },
    { skillset: TechnicalSkills.QA, probability: 0.4 },
    { skillset: TechnicalSkills.FRONTEND, probability: 0.1 },
    { skillset: TechnicalSkills.JAVA_BACKEND, probability: 0.1 },
    { skillset: TechnicalSkills.DOTNET_BACKEND, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.2 },
  ],
  ENGINEERING_QA: [
    { skillset: TechnicalSkills.QA, probability: 1.0 },
    { skillset: TechnicalSkills.TECH_MISC, probability: 0.2 },
    { skillset: TechnicalSkills.FRONTEND, probability: 0.1 },
    { skillset: TechnicalSkills.MOBILE, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.2 },
  ],
  ENGINEERING_DEVSECOPS: [
    { skillset: TechnicalSkills.DEVOPS, probability: 1.0 },
    { skillset: TechnicalSkills.TECH_MISC, probability: 0.5 },
    { skillset: TechnicalSkills.ARCH, probability: 0.1 },
    { skillset: TechnicalSkills.QA, probability: 0.4 },
    { skillset: TechnicalSkills.MOBILE, probability: 0.1 },
    { skillset: TechnicalSkills.JAVA_BACKEND, probability: 0.1 },
    { skillset: TechnicalSkills.DOTNET_BACKEND, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.2 },
  ],
  STRATEGIC_MANAGEMENT: [
    { skillset: BusinessSkills.STRATEGIC_MANAGEMENT, probability: 1.0 },
    { skillset: BusinessSkills.PRODUCT_MANAGEMENT, probability: 0.1 },
    { skillset: BusinessSkills.SALES, probability: 0.1 },
    { skillset: BusinessSkills.FINANCE, probability: 0.1 },
    { skillset: BusinessSkills.HUMAN_RESOURCES, probability: 0.1 },
    { skillset: BusinessSkills.MARKETING, probability: 0.1 },
    { skillset: BusinessSkills.CUSTOMER_SUPPORT, probability: 0.1 },
    { skillset: BusinessSkills.OPERATIONS, probability: 0.1 },
    { skillset: BusinessSkills.LEGAL_COMPLIANCE, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.5 },
  ],
  SALES: [
    { skillset: BusinessSkills.SALES, probability: 1.0 },
    { skillset: BusinessSkills.STRATEGIC_MANAGEMENT, probability: 0.1 },
    { skillset: BusinessSkills.FINANCE, probability: 0.1 },
    { skillset: BusinessSkills.MARKETING, probability: 0.5 },
    { skillset: BusinessSkills.LEGAL_COMPLIANCE, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.5 },
  ],
  FINANCE: [
    { skillset: BusinessSkills.FINANCE, probability: 1.0 },
    { skillset: BusinessSkills.STRATEGIC_MANAGEMENT, probability: 0.1 },
    { skillset: BusinessSkills.SALES, probability: 0.1 },
    { skillset: BusinessSkills.LEGAL_COMPLIANCE, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.5 },
  ],
  HUMAN_RESOURCES: [
    { skillset: BusinessSkills.HUMAN_RESOURCES, probability: 1.0 },
    { skillset: BusinessSkills.PRODUCT_MANAGEMENT, probability: 0.1 },
    { skillset: BusinessSkills.OPERATIONS, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.5 },
  ],
  MARKETING: [
    { skillset: BusinessSkills.MARKETING, probability: 1.0 },
    { skillset: BusinessSkills.SALES, probability: 0.1 },
    { skillset: BusinessSkills.STRATEGIC_MANAGEMENT, probability: 0.1 },
    { skillset: BusinessSkills.FINANCE, probability: 0.1 },
    { skillset: BusinessSkills.LEGAL_COMPLIANCE, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.5 },
  ],
  CUSTOMER_SUPPORT: [
    { skillset: BusinessSkills.CUSTOMER_SUPPORT, probability: 1.0 },
    { skillset: BusinessSkills.STRATEGIC_MANAGEMENT, probability: 0.1 },
    { skillset: BusinessSkills.SALES, probability: 0.1 },
    { skillset: BusinessSkills.FINANCE, probability: 0.1 },
    { skillset: BusinessSkills.LEGAL_COMPLIANCE, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.5 },
    { skillset: TechnicalSkills.QA, probability: 0.2 },
  ],
  PRODUCT_MANAGEMENT: [
    { skillset: BusinessSkills.PRODUCT_MANAGEMENT, probability: 1.0 },
    { skillset: BusinessSkills.STRATEGIC_MANAGEMENT, probability: 0.1 },
    { skillset: BusinessSkills.SALES, probability: 0.1 },
    { skillset: BusinessSkills.FINANCE, probability: 0.1 },
    { skillset: BusinessSkills.LEGAL_COMPLIANCE, probability: 0.1 },
    { skillset: BusinessSkills.MISC, probability: 0.5 },
    { skillset: TechnicalSkills.ARCH, probability: 0.1 },
  ],
  RESEARCH_AND_DEVELOPMENT: [
    { skillset: BusinessSkills.PRODUCT_MANAGEMENT, probability: 0.5 },
    { skillset: BusinessSkills.MISC, probability: 0.5 },
    { skillset: BusinessSkills.STRATEGIC_MANAGEMENT, probability: 0.1 },
    { skillset: BusinessSkills.SALES, probability: 0.1 },
    { skillset: TechnicalSkills.TECH_MISC, probability: 1.0 },
    { skillset: TechnicalSkills.ARCH, probability: 0.1 },
    { skillset: TechnicalSkills.QA, probability: 0.4 },
    { skillset: TechnicalSkills.MOBILE, probability: 0.1 },
    { skillset: TechnicalSkills.JAVA_BACKEND, probability: 0.1 },
    { skillset: TechnicalSkills.DOTNET_BACKEND, probability: 0.1 },
  ],
  ENGINEERING_RECEPTIONIST: [
    { skillset: BusinessSkills.RECEPTION, probability: 1.0 },
    { skillset: BusinessSkills.MISC, probability: 1.0 },
  ],
  ENGINEERING_OFFICE_MANAGER: [
    { skillset: BusinessSkills.OFFICE_MANAGEMENT, probability: 1.0 },
    { skillset: BusinessSkills.MISC, probability: 1.0 },
  ],
};
