import { describe, expect, it } from 'vitest';
import { getPaginationValues, PaginationParams } from './pagination';

describe('getPaginationValues', () => {
  const validTestCases: Array<{
    name: string;
    input: PaginationParams;
    expected: ReturnType<typeof getPaginationValues>;
  }> = [
    {
      name: 'should return default values when no params provided',
      input: { MAX_PAGE_SIZE: 100 },
      expected: { page: 1, pageSize: 100 }
    },
    {
      name: 'should parse valid page and pageSize',
      input: { page: 3, pageSize: 30, MAX_PAGE_SIZE: 100 },
      expected: { page: 3, pageSize: 30 }
    },
    {
      name: 'should handle numeric values with page/pageSize',
      input: { page: 4, pageSize: 15, MAX_PAGE_SIZE: 100 },
      expected: { page: 4, pageSize: 15 }
    },
    {
      name: 'should use default page size when only page provided',
      input: { page: 5, MAX_PAGE_SIZE: 100 },
      expected: { page: 5, pageSize: 100 }
    },
    {
      name: 'should use page 1 when only page size provided',
      input: { pageSize: 25, MAX_PAGE_SIZE: 100 },
      expected: { page: 1, pageSize: 25 }
    }
  ];

  const invalidTestCases: Array<{
    name: string;
    input: PaginationParams;
  }> = [
    {
      name: 'should throw error for negative page',
      input: { page: -2, pageSize: 10, MAX_PAGE_SIZE: 100 },
    },
    {
      name: 'should throw error for negative pageSize',
      input: { page: 1, pageSize: -10, MAX_PAGE_SIZE: 100 },
    },
    {
      name: 'should throw error for zero pageSize',
      input: { page: 1, pageSize: 0, MAX_PAGE_SIZE: 100 },
    },
    {
      name: 'should throw error when pageSize exceeds MAX_PAGE_SIZE',
      input: { page: 1, pageSize: 200, MAX_PAGE_SIZE: 100 },
    },
    {
      name: 'should throw error when pageSize is not an integer',
      input: { pageSize: NaN, MAX_PAGE_SIZE: 100 },
    },
  ];

  describe('valid cases', () => {
    validTestCases.forEach(({ name, input, expected }) => {
      it(name, () => {
        const result = getPaginationValues(input);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('invalid cases', () => {
    invalidTestCases.forEach(({ name, input }) => {
      it(name, () => {
        expect(() => getPaginationValues(input)).toThrow();
      });
    });
  });
});
