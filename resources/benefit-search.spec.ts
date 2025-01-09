import { describe, it, expect } from 'vitest'

import { DbSchema } from '../lib/db';
import { mockBenefitSubscription } from '../mocks/benefit-subscription.mock';
import { mockEmployee } from '../mocks/employee.mock';
import { processBenefitsSearchCriteria } from './benefit-search';
import { Benefits } from '../contract-types/BenefitsRoute';

describe('processBenefitsSearchCriteria', () => {
  const mockDb: Pick<DbSchema, 'benefits' | 'employees'> = {
    benefits: [
      mockBenefitSubscription({ 
        service: { name: 'MultiSport Card' },
        category: 'SPORT_WELLNESS',
        monthlyFee: 100,
        beneficiary: { email: 'john@example.com' },
        cancelledAtDate: undefined
      }),
      mockBenefitSubscription({ 
        service: { name: 'Private Medical Care' },
        category: 'HEALTHCARE',
        monthlyFee: 200,
        beneficiary: { email: 'jane@example.com' },
        cancelledAtDate: '2023-01-01'
      }),
      mockBenefitSubscription({ 
        service: { name: 'Gym Membership' },
        category: 'SPORT_WELLNESS',
        monthlyFee: 150,
        beneficiary: { email: 'bob@example.com' },
        cancelledAtDate: undefined
      }),
      mockBenefitSubscription({ 
        service: { name: 'Dental Care' },
        category: 'HEALTHCARE',
        monthlyFee: 75,
        beneficiary: { email: 'alice@example.com' },
        cancelledAtDate: undefined
      }),
      mockBenefitSubscription({ 
        service: { name: 'Lunch Card' },
        category: 'LUNCH_FOOD',
        monthlyFee: 300,
        beneficiary: { email: 'mark@example.com' },
        cancelledAtDate: undefined
      })
    ],
    employees: [
      mockEmployee({ id: 1, email: 'john@example.com' }),
      mockEmployee({ id: 2, email: 'jane@example.com' }),
      mockEmployee({ id: 3, email: 'bob@example.com' }),
      mockEmployee({ id: 4, email: 'alice@example.com' }),
      mockEmployee({ id: 5, email: 'mark@example.com' })
    ]
  }

  it('should filter by service name', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      serviceName: 'Card'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(2);
    expect(result.map(b => b.service.name)).toEqual(['MultiSport Card', 'Lunch Card']);
  });

  it('should filter by categories', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      categories: 'SPORT_WELLNESS,HEALTHCARE'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(4);
    expect(result.map(b => b.category)).toEqual(['SPORT_WELLNESS', 'HEALTHCARE', 'SPORT_WELLNESS', 'HEALTHCARE']);
  });

  it('should filter by minimum fee', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      feeFrom: '200'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(2);
    expect(result.map(b => b.monthlyFee)).toEqual([200, 300]);
  });

  it('should filter by maximum fee', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      feeTo: '100'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(2);
    expect(result.map(b => b.monthlyFee)).toEqual([100, 75]);
  });

  it('should filter by fee range', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      feeFrom: '100',
      feeTo: '200'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(3);
    expect(result.map(b => b.monthlyFee)).toEqual([100, 200, 150]);
  });

  it('should filter by minimum fee equal to maximum fee', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      feeFrom: '75',
      feeTo: '75'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(1);
    expect(result.map(b => b.monthlyFee)).toEqual([75]);
  });

  it('should filter by status ACTIVE', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      status: 'ACTIVE'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(4);
    expect(result.map(b => b.cancelledAtDate)).toEqual([undefined, undefined, undefined, undefined]);
  });

  it('should filter by status CANCELLED', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      status: 'CANCELLED'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(1);
    expect(result.map(b => b.cancelledAtDate)).toEqual(['2023-01-01']);
  });

  it('should filter by employeeId', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      employeeId: '1'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(1);
    expect(result.map(b => b.beneficiary.email)).toEqual(['john@example.com']);
  });

  it('should filter by multiple criteria with matches', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      categories: 'SPORT_WELLNESS',
      status: 'ACTIVE',
      feeFrom: '100',
      feeTo: '150',
      employeeId: '1'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(1);
    expect(result[0].service.name).toBe('MultiSport Card');
  });

  it('should return empty result for criteria with no matches', () => {
    // given
    const criteria: Benefits.GetBenefitSubscriptions.RequestQuery = {
      categories: 'SPORT_WELLNESS',
      status: 'CANCELLED',
      employeeId: '1',
      feeFrom: '200'
    };
    // when
    const result = processBenefitsSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(0);
  });
});
