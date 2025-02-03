import { Offices } from '../contract-types/OfficesRoute';
import { DBCountry } from '../lib/db/db-zod-schemas/country.schema';
import { DBOfficeAmenity } from '../lib/db/db-zod-schemas/office-amenity.schema';
import { DBOffice } from '../lib/db/db-zod-schemas/office.schema';

type OfficeWithAmenitiesAndCountry = DBOffice & {
    _amenities: DBOfficeAmenity[];
    _country: DBCountry[];
};

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
 * @param offices - Array of offices with their amenities and country data
 * @returns Filtered array of offices matching the criteria
 */
export function filterOffices(
    criteria: Offices.GetOffices.RequestQuery,
    offices: OfficeWithAmenitiesAndCountry[]
): OfficeWithAmenitiesAndCountry[] {
    let result = [...offices];

    // Filter by countries if provided
    const countries = criteria.countries?.split(',');
    if (countries?.length) {
        result = result.filter(office => 
            office._country.some(country => 
                countries.includes(country.code))
        );
    }

    // Filter by amenities if provided
    const amenityCodes = criteria.amenities?.split(',');
    if (amenityCodes?.length) {
        const filtering = criteria.amenitiesFiltering || 'ANY';
        
        result = result.filter(office => {
            const officeAmenityCodes = office._amenities.map(a => a.code);
            return filtering === 'ANY'
                ? amenityCodes.some(code => officeAmenityCodes.includes(code))
                : amenityCodes.every(code => officeAmenityCodes.includes(code));
        });
    }

    // Full text search if phrase provided
    if (criteria.phrase) {
        const searchPhrase = criteria.phrase.toLowerCase();
        result = result.filter(office => {
            const searchableText = [
                office.country,
                office.city,
                office.address,
                office.estateOwner.name
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchPhrase);
        });
    }

    return result;
}
