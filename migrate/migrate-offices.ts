import { DBConnection } from '../lib/db/db-connection';
import { DBOffice } from '../lib/db/db-zod-schemas/office.schema';
import { logger } from '../lib/logger';

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

const updateOffice = (office: DBOffice): DBOffice => {
    const { country, city, address, capacity, monthlyRental, estate, amenities, ...rest } = office;

    return {
        country, city, address, capacity, monthlyRental, estate,
        amenities,
        ...rest,
    };
}


export async function migrateOffices(dbConnection: DBConnection) {
    const allOffices = await dbConnection.offices.findMany();
    logger.debug(`Found ${allOffices.length} offices to process`);

    const newOffices = allOffices.map(updateOffice);
    await dbConnection.offices.deleteMany();
    await dbConnection.offices.insertMany(newOffices);
    await dbConnection.offices.validateInMemory();

    await dbConnection.offices.flush();
    logger.info(`Migrated ${allOffices.length} offices`)
}
