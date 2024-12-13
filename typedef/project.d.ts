import { Money } from './shared';

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'on-hold'

export type Project = {
  "id": string;
  "name": string;
  "status": ProjectStatus;
  "budget": Money;
  "startDate": string;
  "endDate": string;
  "team": {
    "id": number;
    "name": string;
  }[];
  "manager": number;
  "description": string;
};
