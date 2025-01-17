import { describe, expect, it } from 'vitest';
import { getPaginationValues, PaginationParams } from './pagination';

describe('getPaginationValues', () => {
  const validTestCases: Array<{
    name: string;
    input: PaginationParams
    expected: ReturnType<typeof getPaginationValues>;
  }> = [
    {
      name: 'should return default values when no params provided',
      input: { MAX_PAGE_SIZE: 100 },
      expected: { page: 1, pageSize: 100 }
    },
    {
      name: 'should parse valid page and page size',
      input: { _page: 2, _pageSize: 20, MAX_PAGE_SIZE: 100 },
      expected: { page: 2, pageSize: 20 }
    },
    {
      name: 'should handle numeric values',
      input: { _page: 2, _pageSize: 5, MAX_PAGE_SIZE: 100 },
      expected: { page: 2, pageSize: 5 }
    },
    {
      name: 'should use default page size when only page provided',
      input: { _page: 3, MAX_PAGE_SIZE: 100 },
      expected: { page: 3, pageSize: 100 }
    },
    {
      name: 'should use page 1 when only page size provided',
      input: { _pageSize: 15, MAX_PAGE_SIZE: 100 },
      expected: { page: 1, pageSize: 15 }
    }
  ];

  const invalidTestCases: Array<{
    name: string;
    input: PaginationParams;
  }> = [
    {
      name: 'should throw error for negative page',
      input: { _page: -1, _pageSize: 10, MAX_PAGE_SIZE: 100 },
    },
    {
      name: 'should throw error for negative page size',
      input: { _page: 1, _pageSize: -5, MAX_PAGE_SIZE: 100 },
    },
    {
      name: 'should throw error for zero page size',
      input: { _page: 1, _pageSize: 0, MAX_PAGE_SIZE: 100 },
    },
    {
      name: 'should throw error when page size exceeds MAX_PAGE_SIZE',
      input: { _page: 1, _pageSize: 150, MAX_PAGE_SIZE: 100 },
    },
    {
      name: 'should throw error when page size is not an integer',
      input: { _pageSize: NaN, MAX_PAGE_SIZE: 100 },
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
