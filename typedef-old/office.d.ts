import { OfficeAmenity } from './amenity';
import { Phone } from './shared';

export type Office = {
  "country": string;
  "city": string;
  "address": string;
  "capacity": number;
  "amenities": OfficeAmenity[];
  "monthlyRental": number;
  "estate": {
    "owner": string;
    "phone": Phone;
    "account": string;
  };
  "imgURL": string;
};
