import { describe, it, expect } from 'vitest'

import { Offices } from '../contract-types/OfficesRoute';
import { filterOffices } from './offices-filters'
import type { OfficeWithAmenitiesAndCountry } from './offices-filters';
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
        coordinates: { lat: 52.2297, lng: 21.0122 },
        capacity: 100,
        monthlyRental: 10000,
        estateOwner: { name: 'BBI Development' },
        amenities: ['Parking', 'Gym', 'Cafeteria']
      }),
      mockOffice({
        code: 'de-berlin',
        country: 'Germany',
        city: 'Berlin',
        address: 'Alexanderplatz 1',
        coordinates: { lat: 52.5200, lng: 13.4050 },
        capacity: 80,
        monthlyRental: 9000,
        estateOwner: { name: 'Berlin Properties' },
        amenities: ['Parking']
      }),
      mockOffice({
        code: 'pl-krakow',
        country: 'Poland',
        city: 'Kraków',
        address: 'Rynek 1',
        coordinates: { lat: 50.0647, lng: 19.9450 },
        capacity: 70,
        monthlyRental: 8000,
        estateOwner: { name: 'KRK Estates' },
        amenities: ['Parking', 'Gym', 'Conference Room']
      }),
      mockOffice({
        code: 'es-bcn',
        country: 'Spain',
        city: 'Barcelona',
        address: 'La Rambla 123',
        coordinates: { lat: 41.3809, lng: 2.1735 },
        capacity: 60,
        monthlyRental: 7000,
        estateOwner: { name: 'BCN Development' },
        amenities: ['Bike Storage', 'Cafeteria']
      }),
      mockOffice({
        code: 'pl-wroclaw',
        country: 'Poland',
        city: 'Wrocław',
        address: 'Strzegomska 142',
        coordinates: { lat: 51.1079, lng: 17.0385 },
        capacity: 50,
        monthlyRental: 6000,
        estateOwner: { name: 'Wrocław Office' },
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

  function getOfficesWithAmenitiesAndCountry(): OfficeWithAmenitiesAndCountry[] {
    return mockDataset.offices.map(office => ({
      ...office,
      _amenities: mockDataset.officeAmenities.filter(a => office.amenities.includes(a.name)),
      _country: mockDataset.countries.filter(c => c.name === office.country)
    }));
  }

  it('should filter offices by single country', () => {
    // given
    const criteria: Offices.GetOffices.RequestQuery = {
      countries: 'PL'
    };
    // when
    const results = filterOffices(criteria, getOfficesWithAmenitiesAndCountry());
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
    const results = filterOffices(criteria, getOfficesWithAmenitiesAndCountry());
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
    const results = filterOffices(criteria, getOfficesWithAmenitiesAndCountry());
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
    const results = filterOffices(criteria, getOfficesWithAmenitiesAndCountry());
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
    const results = filterOffices(criteria, getOfficesWithAmenitiesAndCountry());
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
    const results = filterOffices(criteria, getOfficesWithAmenitiesAndCountry());
    // then
    expect(results).toHaveLength(2);
    expect(results.map(o => o.code)).toEqual(['pl-warsaw', 'pl-krakow']);
  });
});
