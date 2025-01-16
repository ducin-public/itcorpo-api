import { DBDepartment } from "../../lib/db/db-zod-schemas/department.schema";
import { ProfileType } from "./profiles";
import { probability } from '../lib/math';
import { Nationality as CountryCode } from "../../contract-types/data-contracts";

// import * as departments from '../../database/departments.json';
const departments = require('../../database/departments.json') as DBDepartment[];

type EngineeringProfile = Exclude<Extract<ProfileType, `ENGINEERING_${string}`>, 'ENGINEERING_RECEPTIONIST' | 'ENGINEERING_OFFICE_MANAGER'>;

const engineeringProbabilities: Record<CountryCode, Record<EngineeringProfile, number>> = {
  PL: {
    ENGINEERING_FRONTEND: 0.40,    // Strong frontend presence
    ENGINEERING_BACKEND: 0.45,     // Strong backend presence
    ENGINEERING_MOBILE: 0.05,      // Small mobile team
    ENGINEERING_QA: 0.05,          // Small QA team
    ENGINEERING_DEVSECOPS: 0.05,   // Small DevSecOps team
  },
  US: {
    ENGINEERING_FRONTEND: 0.20,    // Balanced distribution
    ENGINEERING_BACKEND: 0.20,
    ENGINEERING_MOBILE: 0.20,
    ENGINEERING_QA: 0.20,
    ENGINEERING_DEVSECOPS: 0.20,
  },
  DE: {
    ENGINEERING_FRONTEND: 0.15,
    ENGINEERING_BACKEND: 0.20,
    ENGINEERING_MOBILE: 0.30,     // Strong mobile presence
    ENGINEERING_QA: 0.20,
    ENGINEERING_DEVSECOPS: 0.15,
  },
  UK: {
    ENGINEERING_FRONTEND: 0.20,
    ENGINEERING_BACKEND: 0.15,
    ENGINEERING_MOBILE: 0.15,
    ENGINEERING_QA: 0.30,         // Strong QA presence
    ENGINEERING_DEVSECOPS: 0.20,
  },
  NL: {
    ENGINEERING_FRONTEND: 0.15,
    ENGINEERING_BACKEND: 0.15,
    ENGINEERING_MOBILE: 0.25,     // Good mobile presence
    ENGINEERING_QA: 0.25,         // Good QA presence
    ENGINEERING_DEVSECOPS: 0.20,
  },
  ES: {
    ENGINEERING_FRONTEND: 0.30,    // Strong frontend
    ENGINEERING_BACKEND: 0.20,
    ENGINEERING_MOBILE: 0.20,
    ENGINEERING_QA: 0.20,
    ENGINEERING_DEVSECOPS: 0.10,
  },
  IT: {
    ENGINEERING_FRONTEND: 0.25,
    ENGINEERING_BACKEND: 0.25,
    ENGINEERING_MOBILE: 0.20,
    ENGINEERING_QA: 0.15,
    ENGINEERING_DEVSECOPS: 0.15,
  },
  FR: {
    ENGINEERING_FRONTEND: 0.20,
    ENGINEERING_BACKEND: 0.30,     // Strong backend presence
    ENGINEERING_MOBILE: 0.20,
    ENGINEERING_QA: 0.15,
    ENGINEERING_DEVSECOPS: 0.15,
  },
  IN: {
    ENGINEERING_FRONTEND: 0.33,
    ENGINEERING_BACKEND: 0.33,
    ENGINEERING_MOBILE: 0,
    ENGINEERING_QA: 0.33,
    ENGINEERING_DEVSECOPS: 0,
  },
};

const countryDepartments: Record<CountryCode, number> = {
  US: 8,
  PL: 9,
  DE: 10,
  UK: 11,
  NL: 12,
  ES: 13,
  IT: 14,
  FR: 15,
  IN: 16,
};

export const departmentForAProfile = (profile: ProfileType): DBDepartment => {
  // Direct mappings
  const directMappings: Record<ProfileType, number | undefined> = {
    STRATEGIC_MANAGEMENT: 1,
    SALES: 2,
    FINANCE: 3,
    HUMAN_RESOURCES: 4,
    MARKETING: 5,
    CUSTOMER_SUPPORT: 6,
    PRODUCT_MANAGEMENT: undefined, // will be handled with probability
    RESEARCH_AND_DEVELOPMENT: 7,
    ENGINEERING_FRONTEND: undefined,
    ENGINEERING_BACKEND: undefined,
    ENGINEERING_MOBILE: undefined,
    ENGINEERING_QA: undefined,
    ENGINEERING_DEVSECOPS: undefined,
    ENGINEERING_RECEPTIONIST: undefined,
    ENGINEERING_OFFICE_MANAGER: undefined,
  };

  // Handle engineering profiles with country probabilities
  if (profile.startsWith('ENGINEERING_')) {
    // Special handling for support staff - they follow the engineer distribution
    if (profile === 'ENGINEERING_RECEPTIONIST' || profile === 'ENGINEERING_OFFICE_MANAGER') {
      const roll = Math.random();
      let cumulativeProbability = 0;
      
      // Use distribution from ENGINEERING_FRONTEND as a reference for office location probabilities
      for (const [country, countryData] of Object.entries(engineeringProbabilities)) {
        const countryProb = countryData.ENGINEERING_FRONTEND;
        cumulativeProbability += countryProb;

        if (roll <= cumulativeProbability) {
          const departmentId = countryDepartments[country as CountryCode];
          const department = departments.find(d => d.id === departmentId);
          if (!department) {
            throw new Error(`Department not found for id: ${departmentId}`);
          }
          return department;
        }
      }
      throw new Error('Failed to assign country department for support staff');
    }

    // Regular engineering profiles
    const engineeringProfile = profile as EngineeringProfile;
    let cumulativeProbability = 0;
    const roll = Math.random();

    for (const [country, countryData] of Object.entries(engineeringProbabilities)) {
      const countryProb = countryData[engineeringProfile];
      cumulativeProbability += countryProb;

      if (roll <= cumulativeProbability) {
        const departmentId = countryDepartments[country as CountryCode];
        const department = departments.find(d => d.id === departmentId);
        if (!department) {
          throw new Error(`Department not found for id: ${departmentId}`);
        }
        return department;
      }
    }

    throw new Error('Failed to assign country department - check probabilities');
  }

  // Handle special cases with probabilities
  if (profile === 'PRODUCT_MANAGEMENT') {
    // Product Management can be in either R&D or Strategic Management
    const result = departments.find(d => d.id === (probability(0.7) ? 7 : 1))!;
    // console.log(`Product Management assigned to`, {result, departments});
    return result;
  }

  const departmentId = directMappings[profile];
  if (!departmentId) {
    throw new Error(`Unknown profile type: ${profile}`);
  }

  const department = departments.find(d => d.id === departmentId);
  if (!department) {
    throw new Error(`Department not found for id: ${departmentId}`);
  }

  return department;
};
