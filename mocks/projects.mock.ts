import { Project } from "../contract-types/data-contracts";

const defaultProject: Project = {
  "id": "579ef28f-c539-41ff-abe2-e4f6b1c1afed",
  "name": "Intelligent API",
  "status": "ON_HOLD",
  "budget": 490000,
  "startDate": "2013-04-16",
  "endDate": "2019-04-27",
  "team": [
    {
      "id": 4247456,
      "name": "Anna Bahringer"
    },
    {
      "id": 43144345,
      "name": "Era Bashirian"
    },
    {
      "id": 8745294,
      "name": "Lorenzo Grant"
    }
  ],
  "manager": 67429059,
  "description": "Deleniti rerum impedit.\nCum sed eaque quo accusantium.\nVoluptas reprehenderit aut pariatur eligendi consequatur."
};

export const mockProject = (overrides: Partial<Project>): Project => ({
  ...defaultProject,
  ...overrides
})
