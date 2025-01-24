import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { mergeWithDepartment, employeeAge, employeeDTOFactory } from './employees-data-operations';
import { DBDepartment } from '../lib/db/db-zod-schemas/department.schema';
import { DBEmployee } from '../lib/db/db-zod-schemas/employee.schema';

describe('employees-data-operations', () => {
    const mockDepartments: DBDepartment[] = [
        { id: 1, name: 'Engineering' },
        { id: 2, name: 'Marketing' }
    ];

    const mockEmployee: DBEmployee = {
        id: 1,
        nationality: 'US',
        departmentId: 1,
        keycardId: 'USC47731',
        account: 'US95 4352 0017 8858 3002 7387',
        salary: 120000,
        officeCode: 'us-dallas',
        firstName: 'John',
        lastName: 'Doe',
        position: 'Senior Software Engineer',
        contractType: 'PERMANENT',
        email: 'john.doe@itcorpo.com',
        hiredAt: '2020-03-15',
        expiresAt: '2025-03-14',
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
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
        bio: 'Experienced software engineer with a focus on full-stack web development and cloud technologies.',
        imgURL: 'john-doe-7Yx3-pQ9k.jpg'
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

    describe('employeeDTOFactory', () => {
        const dtoFactory = employeeDTOFactory(mockDepartments);

        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2023-01-01'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should transform employee to DTO', () => {
            const result = dtoFactory(mockEmployee);
            expect(result).toMatchInlineSnapshot(`
              {
                "account": "US95 4352 0017 8858 3002 7387",
                "bio": "Experienced software engineer with a focus on full-stack web development and cloud technologies.",
                "contractType": "PERMANENT",
                "department": "Engineering",
                "email": "john.doe@itcorpo.com",
                "expiresAt": "2025-03-14",
                "firstName": "John",
                "hiredAt": "2020-03-15",
                "id": 1,
                "imgURL": "john-doe-7Yx3-pQ9k.jpg",
                "keycardId": "USC47731",
                "lastName": "Doe",
                "name": "John Doe",
                "nationality": "US",
                "officeCode": "us-dallas",
                "personalInfo": {
                  "address": {
                    "city": "Dallas",
                    "country": "US",
                    "street": "2130 Stillwell Ave",
                  },
                  "age": 33,
                  "dateOfBirth": "1990-01-01",
                  "email": "john.doe@gmail.com",
                  "phone": "+1 (214) 555-0123",
                },
                "salary": 120000,
                "skills": [
                  "JavaScript",
                  "TypeScript",
                  "React",
                  "Node.js",
                  "AWS",
                ],
                "title": "Senior Software Engineer",
              }
            `)
        });
    });
});