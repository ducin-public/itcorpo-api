import { describe, it, expect } from 'vitest'

import { DbSchema } from '../lib/db/db-schema';
import { mockBenefitCharge } from '../mocks/benefit-charge.mock';
import { mockBenefitSubscription } from '../mocks/benefit-subscription.mock';
import { processBenefitChargesSearchCriteria } from './benefit-charges-search';
import { Benefits } from '../contract-types/BenefitsRoute';

describe('processBenefitChargesSearchCriteria', () => {
  const mockSubscription1 = mockBenefitSubscription({ id: '1' });
  const mockSubscription2 = mockBenefitSubscription({ id: '2' });
  
  const mockDb: Pick<DbSchema, 'benefitCharges'> = {
    benefitCharges: [
      mockBenefitCharge({ 
        subscriptionId: mockSubscription1.id,
        billingPeriodStart: '2023-01-10',
        billingPeriodEnd: '2023-01-20',
        status: 'PENDING',
        providerServiceCode: 'MS-CARD-01'
      }),
      mockBenefitCharge({ 
        subscriptionId: mockSubscription1.id,
        billingPeriodStart: '2023-02-10',
        billingPeriodEnd: '2023-02-20',
        status: 'PAID',
        providerServiceCode: 'MS-CARD-01'
      }),
      mockBenefitCharge({ 
        subscriptionId: mockSubscription2.id,
        billingPeriodStart: '2023-03-10',
        billingPeriodEnd: '2023-03-20',
        status: 'PENDING',
        providerServiceCode: 'GYM-PLUS-02'
      }),
      mockBenefitCharge({ 
        subscriptionId: mockSubscription2.id,
        billingPeriodStart: '2023-04-10',
        billingPeriodEnd: '2023-04-20',
        status: 'CANCELLED',
        providerServiceCode: 'GYM-PLUS-02'
      }),
      mockBenefitCharge({ 
        subscriptionId: mockSubscription2.id,
        billingPeriodStart: '2023-05-10',
        billingPeriodEnd: '2023-05-20',
        status: 'PAID',
        providerServiceCode: 'GYM-PLUS-02'
      })
    ]
  };

  it('should filter by subscription ID', () => {
    // given
    const criteria: Benefits.GetBenefitCharges.RequestQuery = {
      subscriptionId: mockSubscription1.id
    };
    // when
    const result = processBenefitChargesSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(2);
    expect(result.map(c => c.subscriptionId)).toEqual(['1', '1']);
  });

  it('should filter by providerServiceCode', () => {
    // given
    const criteria: Benefits.GetBenefitCharges.RequestQuery = {
      providerServiceCode: 'MS-CARD-01'
    };
    // when
    const result = processBenefitChargesSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(2);
    expect(result.map(c => c.providerServiceCode)).toEqual(['MS-CARD-01', 'MS-CARD-01']);
  });

  it('should filter by billingPeriodFrom only', () => {
    // given
    const criteria: Benefits.GetBenefitCharges.RequestQuery = {
      billingPeriodFrom: '2023-03-19'
    };
    // when
    const result = processBenefitChargesSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(3);
    expect(result.map(c => c.billingPeriodStart)).toEqual(['2023-03-10', '2023-04-10', '2023-05-10']);
  });

  it('should filter by billingPeriodTo only', () => {
    // given
    const criteria: Benefits.GetBenefitCharges.RequestQuery = {
      billingPeriodTo: '2023-02-11'
    };
    // when
    const result = processBenefitChargesSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(2);
    expect(result.map(c => c.billingPeriodEnd)).toEqual(['2023-01-20', '2023-02-20']);
  });

  it('should filter by both billing period bounds', () => {
    // given
    const criteria: Benefits.GetBenefitCharges.RequestQuery = {
      billingPeriodFrom: '2023-02-01',
      billingPeriodTo: '2023-03-31'
    };
    // when
    const result = processBenefitChargesSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(2);
    expect(result.map(c => c.billingPeriodStart)).toEqual(['2023-02-10', '2023-03-10']);
  });

  describe('billing period edge cases', () => {
    it('should match charge when period exactly matches charge period', () => {
      // given
      const criteria: Benefits.GetBenefitCharges.RequestQuery = {
        billingPeriodFrom: '2023-01-10',
        billingPeriodTo: '2023-01-20'
      };
      // when
      const result = processBenefitChargesSearchCriteria(mockDb, criteria);
      // then
      expect(result).toHaveLength(1);
      expect(result.map(c => `${c.billingPeriodStart}-${c.billingPeriodEnd}`))
        .toEqual(['2023-01-10-2023-01-20']);
    });

    it('should match charge when period ends exactly at charge start', () => {
      // given
      const criteria: Benefits.GetBenefitCharges.RequestQuery = {
        billingPeriodTo: '2023-01-10'
      };
      // when
      const result = processBenefitChargesSearchCriteria(mockDb, criteria);
      // then
      expect(result).toHaveLength(1);
      expect(result.map(c => `${c.billingPeriodStart}-${c.billingPeriodEnd}`))
        .toEqual(['2023-01-10-2023-01-20']);
    });

    it('should match charge when period starts exactly at charge end', () => {
      // given
      const criteria: Benefits.GetBenefitCharges.RequestQuery = {
        billingPeriodFrom: '2023-01-20'
      };
      // when
      const result = processBenefitChargesSearchCriteria(mockDb, criteria);
      // then
      expect(result).toHaveLength(5);
      expect(result.map(c => `${c.billingPeriodStart}-${c.billingPeriodEnd}`))
        .toEqual([
          '2023-01-10-2023-01-20',
          '2023-02-10-2023-02-20',
          '2023-03-10-2023-03-20',
          '2023-04-10-2023-04-20',
          '2023-05-10-2023-05-20'
        ]);
    });

    it('should not match charge when period ends just before charge start', () => {
      // given
      const criteria: Benefits.GetBenefitCharges.RequestQuery = {
        billingPeriodFrom: '2023-01-01',
        billingPeriodTo: '2023-01-09'
      };
      // when
      const result = processBenefitChargesSearchCriteria(mockDb, criteria);
      // then
      expect(result).toHaveLength(0);
      expect(result.map(c => `${c.billingPeriodStart}-${c.billingPeriodEnd}`))
        .toEqual([]);
    });

    it('should not match charge when period starts just after charge end', () => {
      // given
      const criteria: Benefits.GetBenefitCharges.RequestQuery = {
        billingPeriodFrom: '2023-01-21',
        billingPeriodTo: '2023-01-31'
      };
      // when
      const result = processBenefitChargesSearchCriteria(mockDb, criteria);
      // then
      expect(result).toHaveLength(0);
      expect(result.map(c => `${c.billingPeriodStart}-${c.billingPeriodEnd}`))
        .toEqual([]);
    });
  });

  it('should filter by multiple criteria with matches', () => {
    // given
    const criteria: Benefits.GetBenefitCharges.RequestQuery = {
      subscriptionId: mockSubscription2.id,
      status: 'PENDING',
      billingPeriodFrom: '2023-03-01',
      billingPeriodTo: '2023-03-31',
      providerServiceCode: 'GYM-PLUS-02'
    };
    // when
    const result = processBenefitChargesSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(1);
    expect(result[0].billingPeriodStart).toBe('2023-03-10');
  });

  it('should return empty result for criteria with no matches', () => {
    // given
    const criteria: Benefits.GetBenefitCharges.RequestQuery = {
      subscriptionId: mockSubscription1.id,
      status: 'CANCELLED',
      billingPeriodFrom: '2023-03-01',
      providerServiceCode: 'MS-CARD-01'
    };
    // when
    const result = processBenefitChargesSearchCriteria(mockDb, criteria);
    // then
    expect(result).toHaveLength(0);
  });
});
