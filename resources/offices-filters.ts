import { Offices } from '../contract-types/OfficesRoute';
import { DBCountry } from '../lib/db/db-zod-schemas/country.schema';
import { DBOfficeAmenity } from '../lib/db/db-zod-schemas/office-amenity.schema';
import { DBOffice } from '../lib/db/db-zod-schemas/office.schema';

/**
 * Filter offices based on provided criteria
 * 
 * @param criteria - Search criteria for filtering offices
 *   @see {@link Offices.GetOffices.RequestQuery}
 *   - countries: Filter by country codes (comma-separated)
 *   - amenities: Filter by amenity codes (comma-separated)
 *   - amenitiesFiltering: How to match amenities ('ANY' or 'ALL', defaults to 'ANY')
 *   - phrase: Full-text search across country, city, address, and estate owner
 * 
 * @param collections - Collection of data required for filtering
 * 
 * @returns Filtered array of offices matching the criteria
 *   @see {@link DBOffice}
 */
export function filterOffices(
    criteria: Offices.GetOffices.RequestQuery,
    collections: {
        offices: DBOffice[];
        officeAmenities: DBOfficeAmenity[];
        countries: DBCountry[];
    }
): DBOffice[] {
    let result = [...collections.offices];

    // Filter by countries if provided
    const countries = criteria.countries?.split(',');
    if (countries?.length) {
        const codeToCountryDict = collections.countries.reduce((acc, country) => {
            acc[country.code] = country.name;
            return acc;
        }, {} as Record<string, string>);
        
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
        const filtering = criteria.amenitiesFiltering || 'ANY';

        result = result.filter(office => 
            filtering === 'ANY'
                ? amenityNames.some(amenity => office.amenities.includes(amenity))
                : amenityNames.every(amenity => office.amenities.includes(amenity))
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
