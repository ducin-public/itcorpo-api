import { Phone } from './shared';

export type Office = {
  "country": string;
  "city": string;
  "address": string;
  "capacity": number;
  "estate": {
    "owner": string;
    "phone": Phone;
    "monthlyRental": number;
  };
  "amenities": string[];
  "imgURL": string;
};
