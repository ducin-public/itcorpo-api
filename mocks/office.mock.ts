import { Office } from "../contract-types/data-contracts";
import { DeepPartial } from "../lib/types";

const defaultOffice: Office = {
  "code": "pl-warsaw",
  "country": "Poland",
  "city": "Warszawa",
  "address": "ul. Marszałkowska 130",
  "capacity": 140,
  "monthlyRental": 11000,
  "estate": {
    "owner": "Warszawskie Nieruchomości Sp. z o.o.",
    "phone": "22 123 45 67",
    "account": "PL43 0926 5994 1051 3200 0501 5166"
  },
  "amenities": [
    "Private desks",
    "Microwave",
    "Team events",
    "Lockers",
    "IT support",
    "Free parking",
    "Recycling bins",
    "Standing desks",
    "Nap pods",
    "24/7 access",
    "Ping-pong",
    "Quiet rooms"
  ],
  "imgURL": "warszawa-eC7F-oKud-3bgI-id2Q-z3Hj.jpg"
};

/**
 * Creates a mock office object with provided overrides.
 * It has all the required properties of an office object.
 * 
 * @example
 * ```ts
 * mockOffice({ city: 'Kraków', code: 'pl-krakow' });
 * ```
 * 
 * @param overrides - partial office object to override default values
 * @returns Office
 */
export const mockOffice = ({ ...overrides }: DeepPartial<Office>): Office => {
  const { estate, ...restOffice } = overrides
  return {
    ...defaultOffice,
    estate: {
      ...defaultOffice.estate,
      ...estate
    },
    ...restOffice
  }
}
