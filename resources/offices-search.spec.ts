import { describe, it, expect } from 'vitest'

import { processOfficesSearchCriteria } from './offices-search'
import { DbSchema } from '../lib/db'
import { mockOffice } from '../mocks/office.mock';
import { OfficesSearchCriteria } from '../contract-types/data-contracts';

describe('processOfficesSearchCriteria', () => {
  const mockDb: Pick<DbSchema, 'offices' | 'geo' | 'officeAmenities'> = {
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
    geo: {
      'PL': 'Poland',
      'DE': 'Germany',
      'ES': 'Spain'
    },
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
    const criteria: OfficesSearchCriteria = {
      countries: 'PL'
    };
    // when
    const results = processOfficesSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(3);
    expect(results.map(o => o.code)).toEqual(['pl-warsaw', 'pl-krakow', 'pl-wroclaw']);
  });

  it('should filter offices by multiple countries', () => {
    // given
    const criteria: OfficesSearchCriteria = {
      countries: 'ES,DE'
    };
    // when
    const results = processOfficesSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(o => o.code)).toEqual(['de-berlin', 'es-bcn']);
  });

  it('should filter offices by amenities with ANY mode', () => {
    // given
    const criteria: OfficesSearchCriteria = {
      amenities: 'BIKE,GYM'
    };
    // when
    const results = processOfficesSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(3);
    expect(results.map(o => o.code)).toEqual(['pl-warsaw', 'pl-krakow', 'es-bcn']);
  });

  it('should filter offices by amenities with ALL mode', () => {
    // given
    const criteria: OfficesSearchCriteria = {
      amenities: 'GYM,CAFE',
      amenitiesFiltering: 'ALL'
    };
    // when
    const results = processOfficesSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(1);
    expect(results.map(o => o.code)).toEqual(['pl-warsaw']);
  });

  it('should return no results when multiple criteria dont match any office', () => {
    // given
    const criteria: OfficesSearchCriteria = {
      countries: 'ES',
      amenities: 'GYM,CONF',
      amenitiesFiltering: 'ALL',
      phrase: 'central'
    };
    // when
    const results = processOfficesSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(0);
    expect(results.map(o => o.code)).toEqual([]);
  });

  it('should filter offices by multiple criteria', () => {
    // given
    const criteria: OfficesSearchCriteria = {
      countries: 'PL',
      amenities: 'GYM,PARK',
      amenitiesFiltering: 'ALL',
    };
    // when
    const results = processOfficesSearchCriteria(mockDb, criteria);
    // then
    expect(results).toHaveLength(2);
    expect(results.map(o => o.code)).toEqual(['pl-warsaw', 'pl-krakow']);
  });
});
