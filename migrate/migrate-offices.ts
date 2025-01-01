import { logger } from '../lib/logger';
import { Office } from './types';

function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getNumberOfAmenities(possibleOfficeAmenities: string[]): number {
    const rand = Math.random();
    if (rand < 0.1) return 1;                    // 10% chance for 1
    if (rand < 0.4) return getRandomInt(3, 5);   // 30% chance for 3-5
    if (rand < 0.9) return getRandomInt(5, 15);  // 50% chance for 5-15
    return getRandomInt(1, possibleOfficeAmenities.length); // remaining 10%
}

function getRandomAmenities(possibleOfficeAmenities: string[]): string[] {
    const count = getNumberOfAmenities(possibleOfficeAmenities);
    const shuffled = [...possibleOfficeAmenities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getOfficeCapacity(country: string): number {
    const smallerOfficeCountries = ['UK', 'NL', 'IT', 'ES'];
    if (smallerOfficeCountries.includes(country)) {
        return getRandomInt(40, 60);
    }
    return getRandomInt(30, 200);
}

export function migrateOffices(offices: Office[]): Office[] {
    logger.info(`Found ${offices.length} offices to process`);
    return offices.map(({ country, city, address, capacity, monthlyRental, ...office }) => {
        return {
            country, city, address, capacity, monthlyRental,
            ...office,
        };
    });
}
