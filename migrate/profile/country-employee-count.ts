import { Nationality as CountryCode } from "../../contract-types/data-contracts";
import { countries } from "./countries";

type OfficeEngineeringCount = {
  city: string;
  engineeringCount: number;
  officeManagerCount: number;
  receptionCount: number;
}

type CountryEngineeringCounts = {
  [key in CountryCode]: OfficeEngineeringCount[];
}

const generateCountryCounts = (): CountryEngineeringCounts => {
  const result: Partial<CountryEngineeringCounts> = {};

  for (const [country, { cities }] of Object.entries(countries)) {
    const countryCode = country as CountryCode;
    result[countryCode] = Object.entries(cities).map(([city, range]) => {
      const [min, max] = range;
      return {
        city,
        engineeringCount: Math.floor(Math.random() * (max - min + 1)) + min,
        officeManagerCount: 1,
        receptionCount: 1,
      };
    });
  }

  return result as CountryEngineeringCounts;
};

export const engineeringPerOfficeCount: CountryEngineeringCounts = generateCountryCounts();