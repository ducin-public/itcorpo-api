import { describe, it, expect } from 'vitest'

import { processEmployeesSearchCriteria } from "./employee-search";
import { mockEmployee } from '../mocks/employee.mock';
import { DbSchema } from '../lib/db-schema';
import { Employees } from '../contract-types/EmployeesRoute';

describe('processEmployeesSearchCriteria', () => {
    const mockDb: Pick<DbSchema, 'employees' | 'departments'> = {
        departments: [
            { id: 1, name: "Management" },
            { id: 2, name: "Sales" }
        ],
        employees: [
            mockEmployee({ id: 1, firstName: 'John', lastName: 'Doe', department: 'Management', skills: ['java', 'spring'], salary: 5000 }),
            mockEmployee({ id: 2, firstName: 'Jane', lastName: 'Smith', department: 'Sales', skills: ['javascript', 'react'], salary: 6000 }),
            mockEmployee({ id: 3, firstName: 'Bob', lastName: 'Wilson', department: 'Management', skills: ['java', 'react', 'spring'], salary: 7000 }),
            mockEmployee({ id: 4, firstName: 'Alice', lastName: 'Brown', department: 'Sales', skills: ['python', 'django'], salary: 4500 }),
            mockEmployee({ id: 5, firstName: 'Charlie', lastName: 'Davis', department: 'Sales', skills: ['javascript', 'angular'], salary: 5500 })
        ]
    }

    it('should filter by departmentId', () => {
        // given
        const criteria: Employees.GetEmployees.RequestQuery = {
            departmentId: '1'
        };
        // when
        const result = processEmployeesSearchCriteria(mockDb, criteria);
        // then
        expect(result).toHaveLength(2);
        expect(result.map(e => e.id)).toEqual([1, 3]);
    });

    it('should filter by skills with ANY matching', () => {
        // given
        const criteria: Employees.GetEmployees.RequestQuery = {
            skills: 'java,react',
            skillsFiltering: 'ANY'
        };
        // when
        const result = processEmployeesSearchCriteria(mockDb, criteria);
        // then
        expect(result).toHaveLength(3);
        expect(result.map(e => e.id)).toEqual([1, 2, 3]);
    });

    it('should filter by skills with ALL matching', () => {
        // given
        const criteria: Employees.GetEmployees.RequestQuery = {
            skills: 'java,spring',
            skillsFiltering: 'ALL'
        };
        // when
        const result = processEmployeesSearchCriteria(mockDb, criteria);
        // then
        expect(result).toHaveLength(2);
        expect(result.map(e => e.id)).toEqual([1, 3]);
    });

    it('should filter by salaryFrom', () => {
        // given
        const criteria: Employees.GetEmployees.RequestQuery = {
            salaryFrom: '5500',
        };
        // when
        const result = processEmployeesSearchCriteria(mockDb, criteria);
        // then
        expect(result).toHaveLength(3);
        expect(result.map(e => e.id)).toEqual([2, 3, 5]);
    });

    it('should filter by salaryTo', () => {
        // given
        const criteria: Employees.GetEmployees.RequestQuery = {
            salaryTo: '6500',
        };
        // when
        const result = processEmployeesSearchCriteria(mockDb, criteria);
        // then
        expect(result).toHaveLength(4);
        expect(result.map(e => e.id)).toEqual([1, 2, 4, 5]);
    });

    it('should filter by salary range', () => {
        // given
        const criteria: Employees.GetEmployees.RequestQuery = {
            salaryFrom: '5500',
            salaryTo: '6500'
        };
        // when
        const result = processEmployeesSearchCriteria(mockDb, criteria);
        // then
        expect(result).toHaveLength(2);
        expect(result.map(e => e.id)).toEqual([2, 5]);
    });

    it('should filter by multiple criteria with matches', () => {
        // given
        const criteria: Employees.GetEmployees.RequestQuery = {
            departmentId: '1',
            skills: 'java,spring',
            skillsFiltering: 'ALL',
            salaryFrom: '5000',
            salaryTo: '7000'
        };
        // when
        const result = processEmployeesSearchCriteria(mockDb, criteria);
        // then
        expect(result).toHaveLength(2);
        expect(result.map(e => e.id)).toEqual([1, 3]);
    });

    it('should return empty array when no matches found', () => {
        // given
        const criteria: Employees.GetEmployees.RequestQuery = {
            departmentId: '1',
            skills: 'python',
            salaryFrom: '8000'
        };
        // when
        const result = processEmployeesSearchCriteria(mockDb, criteria);
        // then
        expect(result).toHaveLength(0);
    });
});
