import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { mergeWithDepartment, employeeAge, employeeDTOFactory } from './employees-data-operations';
import { DBDepartment } from '../lib/db/db-zod-schemas/department.schema';
import { DBEmployee } from '../lib/db/db-zod-schemas/employee.schema';

describe('employees-data-operations', () => {
    const mockDepartments: DBDepartment[] = [
        { id: 1, name: 'Engineering' },
        { id: 2, name: 'Marketing' }
    ];

    const mockOffices = [
        {
            code: 'us-dallas',
            country: 'United States of America',
            city: 'Dallas',
            // ... other office properties not needed for the test
        }
    ];

    const mockEmployee: DBEmployee = {
        id: 1,
        nationality: 'US',
        departmentId: 1,
        keycardId: 'USC47731',
        account: 'US95 4352 0017 8858 3002 7387',
        officeCode: 'us-dallas',
        firstName: 'John',
        lastName: 'Doe',
        position: 'Senior Software Engineer',
        email: 'john.doe@itcorpo.com',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
        bio: 'Experienced software engineer with a focus on full-stack web development and cloud technologies.',
        imgURL: 'john-doe-7Yx3-pQ9k.jpg',
        employment: {
            contractType: 'PERMANENT',
            currentSalary: 120000,
            startDate: '2020-03-15',
            endDate: '2025-03-14'
        },
        personalInfo: {
            dateOfBirth: '1990-01-01',
            address: {
                street: '2130 Stillwell Ave',
                city: 'Dallas',
                country: 'US'
            },
            email: 'john.doe@gmail.com',
            phone: '+1 (214) 555-0123'
        },
    };

    describe('mergeWithDepartment', () => {
        it('should merge employee with department data', () => {
            const result = mergeWithDepartment(mockEmployee, mockDepartments);
            expect(result.department).toEqual('Engineering');
        });
    });

    describe('employeeAge', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should calculate correct age', () => {
            vi.setSystemTime(new Date('2023-01-01'));
            const result = employeeAge(mockEmployee);
            expect(result).toBe(33);
        });

        it('should calculate age for different birth years', () => {
            vi.setSystemTime(new Date('2023-01-01'));
            const employee = {
                ...mockEmployee,
                personalInfo: { ...mockEmployee.personalInfo, dateOfBirth: '1980-01-01' }
            };
            const result = employeeAge(employee);
            expect(result).toBe(43);
        });
    });
});
