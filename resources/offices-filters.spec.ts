import { describe, it, expect } from 'vitest'

import { Offices } from '../contract-types/OfficesRoute';
import { filterOffices } from './offices-filters'
import { mockOffice } from '../mocks/office.mock';
import { DBOffice } from '../lib/db/db-zod-schemas/office.schema';
import { DBOfficeAmenity } from '../lib/db/db-zod-schemas/office-amenity.schema';
import { DBCountry } from '../lib/db/db-zod-schemas/country.schema';

describe('processOfficesSearchCriteria', () => {
  const mockDataset: {
    offices: DBOffice[];
    officeAmenities: DBOfficeAmenity[];
    countries: DBCountry[];
  } = {
    offices: [
      mockOffice({
        code: 'pl-warsaw',
        country: 'Poland',
        city: 'Warsaw',
        address: 'Złota 44',
        estate: { 
          owner: 'BBI Development'
        },
        amenities: ['Parking', 'Gym', 'Cafeteria']
      }),
      mockOffice({
        code: 'de-berlin',
        country: 'Germany',
        city: 'Berlin',
        address: 'Alexanderplatz 1',
        estate: { 
          owner: 'Berlin Properties'
        },
        amenities: ['Parking']
      }),
      mockOffice({
        code: 'pl-krakow',
        country: 'Poland',
        city: 'Kraków',
        address: 'Rynek 1',
        estate: { 
          owner: 'KRK Estates'
        },
        amenities: ['Parking', 'Gym', 'Conference Room']
      }),
      mockOffice({
        code: 'es-bcn',
        country: 'Spain',
        city: 'Barcelona',
        address: 'La Rambla 123',
        estate: { 
          owner: 'BCN Development'
        },
        amenities: ['Bike Storage', 'Cafeteria']
      }),
      mockOffice({
        code: 'pl-wroclaw',
        country: 'Poland',
        city: 'Wrocław',
        address: 'Strzegomska 142',
        estate: { 
          owner: 'Wrocław Office'
        },
        amenities: ['Parking', 'Cafeteria', 'Conference Room']
      })
    ],
    countries: [
      { code: 'PL', name: 'Poland' },
      { code: 'DE', name: 'Germany' },
      { code: 'ES', name: 'Spain' }
    ],
    officeAmenities: [
      { code: 'PARK', name: 'Parking' },
      { code: 'GYM', name: 'Gym' },
      { code: 'CAFE', name: 'Cafeteria' },
      { code: 'BIKE', name: 'Bike Storage' },
      { code: 'CONF', name: 'Conference Room' }
    ]
  };

  it('should filter offices by single country', () => {
    // given
    const criteria: Offices.GetOffices.RequestQuery = {
      countries: 'PL'
    };
    // when
    const results = filterOffices(criteria, mockDataset);
    // then
    expect(results).toHaveLength(3);
    expect(results.map(o => o.code)).toEqual(['pl-warsaw', 'pl-krakow', 'pl-wroclaw']);
  });

  it('should filter offices by multiple countries', () => {
    // given
    const criteria: Offices.GetOffices.RequestQuery = {
      countries: 'ES,DE'
    };
    // when
    const results = filterOffices(criteria, mockDataset);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(o => o.code)).toEqual(['de-berlin', 'es-bcn']);
  });

  it('should filter offices by amenities with ANY mode', () => {
    // given
    const criteria: Offices.GetOffices.RequestQuery = {
      amenities: 'BIKE,GYM'
    };
    // when
    const results = filterOffices(criteria, mockDataset);
    // then
    expect(results).toHaveLength(3);
    expect(results.map(o => o.code)).toEqual(['pl-warsaw', 'pl-krakow', 'es-bcn']);
  });

  it('should filter offices by amenities with ALL mode', () => {
    // given
    const criteria: Offices.GetOffices.RequestQuery = {
      amenities: 'GYM,CAFE',
      amenitiesFiltering: 'ALL'
    };
    // when
    const results = filterOffices(criteria, mockDataset);
    // then
    expect(results).toHaveLength(1);
    expect(results.map(o => o.code)).toEqual(['pl-warsaw']);
  });

  it('should return no results when multiple criteria dont match any office', () => {
    // given
    const criteria: Offices.GetOffices.RequestQuery = {
      countries: 'ES',
      amenities: 'GYM,CONF',
      amenitiesFiltering: 'ALL',
      phrase: 'central'
    };
    // when
    const results = filterOffices(criteria, mockDataset);
    // then
    expect(results).toHaveLength(0);
    expect(results.map(o => o.code)).toEqual([]);
  });

  it('should filter offices by multiple criteria', () => {
    // given
    const criteria: Offices.GetOffices.RequestQuery = {
      countries: 'PL',
      amenities: 'GYM,PARK',
      amenitiesFiltering: 'ALL',
    };
    // when
    const results = filterOffices(criteria, mockDataset);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(o => o.code)).toEqual(['pl-warsaw', 'pl-krakow']);
  });
});
