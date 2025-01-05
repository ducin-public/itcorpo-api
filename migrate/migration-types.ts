import { Office, OfficeAmenity, Project, BenefitSubscription, Employee, Department, BenefitService, BenefitCharge } from "../typedef/data-contracts";
export { Office, OfficeAmenity, Project, BenefitSubscription, Employee, Department, BenefitService, BenefitCharge } from "../typedef/data-contracts";

export interface DatabaseContent {
    benefitServices: BenefitService[];
    benefits: BenefitSubscription[];
    benefitCharges: BenefitCharge[];
    departments: Department[];
    employees: Employee[];
    offices: Office[];
    projects: Project[];
    officeAmenities: OfficeAmenity[];
    [key: string]: any;
}
