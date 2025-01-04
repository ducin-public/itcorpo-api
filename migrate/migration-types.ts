import { Office, OfficeAmenity, Project, Benefit, Employee, Department } from "../typedef/data-contracts";
export { Office, OfficeAmenity, Project, Benefit, Employee, Department } from "../typedef/data-contracts";

export interface DatabaseContent {
    benefits: Benefit[];
    departments: Department[];
    employees: Employee[];
    offices: Office[];
    projects: Project[];
    officeAmenities: OfficeAmenity[];
}
