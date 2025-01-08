import { Office, OfficesSearchCriteria } from '../contract-types/data-contracts';
import { DbSchema } from '../lib/db';

/**
 * Processes offices search criteria and filters offices based on provided criteria
 * 
 * @param collections - Database collections required for office search
 *   @see {@link DbSchema}
 * 
 * @param criteria - Search criteria for filtering offices
 *   @see {@link OfficesSearchCriteria}
 *   - countries: Filter by country codes (comma-separated)
 *   - amenities: Filter by amenity codes (comma-separated)
 *   - phrase: Full-text search across country, city, address, and estate owner
 * 
 * @returns Filtered array of offices matching the criteria
 *   @see {@link Office}
 */
export function processOfficesSearchCriteria(
    collections: Pick<DbSchema, 'offices' | 'geo' | 'officeAmenities'>,
    criteria: OfficesSearchCriteria
): Office[] {
    let result = [...collections.offices];

    // Filter by countries if provided
    const countries = criteria.countries?.split(',');
    if (countries?.length) {
        const codeToCountryDict = collections.geo;
        const countryNames = countries.map(code => codeToCountryDict[code.toUpperCase()]);
        result = result.filter(office => 
            countryNames.includes(office.country)
        );
    }

    // Filter by amenities if provided
    const amenityCodes = criteria.amenities?.split(',');
    if (amenityCodes?.length) {
        const codeToAmenityDict = collections.officeAmenities.reduce((acc, amenity) => {
            acc[amenity.code] = amenity.name;
            return acc;
        }, {} as Record<string, string>);
        const amenityNames = amenityCodes.map(code => codeToAmenityDict[code]);

        result = result.filter(office => 
            amenityNames.every(amenity => 
                office.amenities.includes(amenity)
            )
        );
    }

    // Full text search if phrase provided
    if (criteria.phrase) {
        const searchPhrase = criteria.phrase.toLowerCase();
        result = result.filter(office => {
            const searchableText = [
                office.country,
                office.city,
                office.address,
                office.estate.owner
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchPhrase);
        });
    }

    return result;
}
