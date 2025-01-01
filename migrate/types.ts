export interface Office {
    country: string;
    city: string;
    address: string;
    capacity: number;
    monthlyRental: number;
    [key: string]: any;
}

export interface Project {
    name: string;
    [key: string]: any;
}

export interface DatabaseContent {
    offices: Office[];
    projects: Project[];
    officeAmenities?: string[];
    [key: string]: any;
}
