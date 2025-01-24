/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  Employee,
  EmployeeInput,
  Money,
  ProjectEmployeeInvolvement,
} from "./data-contracts";

export namespace Employees {
  /**
   * No description
   * @tags Employees, Pagination, Search
   * @name GetEmployees
   * @summary List all employees
   * @request GET:/employees
   * @response `200` `(Employee)[]` Successful operation
   * @response `400` `ErrorResponse` Invalid employees search criteria
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetEmployees {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Filter employees by special groups
       * @default "ACTIVE"
       */
      group?:
        | "ACTIVE"
        | "INVOLVED"
        | "JOBLESS"
        | "DEPARTING"
        | "NEW_HIRES"
        | "PAST";
      /**
       * Filter employees by name
       * @example "John Doe"
       */
      employeeName?: string;
      /**
       * Filter employees by department ID
       * @example "123"
       */
      departmentId?: string;
      /**
       * Filter employees by skills according to `skillsFiltering`
       * @example "JavaScript,React"
       */
      skills?: string;
      /**
       * If more than one skill is passed, return either employees with any of the skills (`ANY`) or with all of them (`ALL`)
       * @default "ANY"
       * @example "ALL"
       */
      skillsFiltering?: "ANY" | "ALL";
      /**
       * Minimum salary amount
       * @example "5000"
       */
      salaryFrom?: string;
      /**
       * Maximum salary amount
       * @example "10000"
       */
      salaryTo?: string;
      /**
       * Page number to retrieve
       * @example 1
       */
      _page?: number;
      /**
       * Number of elements per page
       * @min 1
       * @max 50
       * @example 1
       */
      _pageSize?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Employee[];
  }

  /**
   * No description
   * @tags Employees
   * @name CreateEmployee
   * @summary Create a new employee
   * @request POST:/employees
   * @response `201` `Employee` Employee created successfully
   * @response `400` `ErrorResponse` Invalid employee input request body @see {@link EmployeeInput}
   * @response `409` `ErrorResponse` Employee with this email already exists
   * @response `422` `ErrorResponse` Invalid data state (e.g. department doesn't exist, office not found)
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace CreateEmployee {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = EmployeeInput;
    export type RequestHeaders = {};
    export type ResponseBody = Employee;
  }

  /**
   * No description
   * @tags Employees, Search
   * @name GetEmployeesCount
   * @summary Get total number of employees
   * @request GET:/employees/count
   * @response `200` `Money` Successful operation
   * @response `400` `ErrorResponse` Invalid employees search criteria
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetEmployeesCount {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Filter employees by special groups
       * @default "ACTIVE"
       */
      group?:
        | "ACTIVE"
        | "INVOLVED"
        | "JOBLESS"
        | "DEPARTING"
        | "NEW_HIRES"
        | "PAST";
      /**
       * Filter employees by name
       * @example "John Doe"
       */
      employeeName?: string;
      /**
       * Filter employees by department ID
       * @example "123"
       */
      departmentId?: string;
      /**
       * Filter employees by skills according to `skillsFiltering`
       * @example "JavaScript,React"
       */
      skills?: string;
      /**
       * If more than one skill is passed, return either employees with any of the skills (`ANY`) or with all of them (`ALL`)
       * @default "ANY"
       * @example "ALL"
       */
      skillsFiltering?: "ANY" | "ALL";
      /**
       * Minimum salary amount
       * @example "5000"
       */
      salaryFrom?: string;
      /**
       * Maximum salary amount
       * @example "10000"
       */
      salaryTo?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }

  /**
   * No description
   * @tags Employees
   * @name GetEmployeeById
   * @summary Get employee by ID
   * @request GET:/employees/{employeeId}
   * @response `200` `Employee` Successful operation
   * @response `404` `ErrorResponse` Employee not found
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetEmployeeById {
    export type RequestParams = {
      /** @example 91720 */
      employeeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Employee;
  }

  /**
   * No description
   * @tags Employees
   * @name UpdateEmployee
   * @summary Update employee
   * @request PUT:/employees/{employeeId}
   * @response `200` `Employee` Employee updated successfully
   * @response `400` `ErrorResponse` Invalid employee input request body @see {@link EmployeeInput}
   * @response `404` `ErrorResponse` Employee not found
   * @response `409` `ErrorResponse` Email already taken by another employee
   * @response `422` `ErrorResponse` Invalid data state (e.g. department doesn't exist, office not found)
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace UpdateEmployee {
    export type RequestParams = {
      employeeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = EmployeeInput;
    export type RequestHeaders = {};
    export type ResponseBody = Employee;
  }

  /**
   * No description
   * @tags Employees
   * @name DeleteEmployee
   * @summary Delete employee
   * @request DELETE:/employees/{employeeId}
   * @response `204` `void` Employee deleted successfully
   * @response `404` `ErrorResponse` Employee not found
   * @response `409` `ErrorResponse` Cannot delete employee that is assigned to active projects
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace DeleteEmployee {
    export type RequestParams = {
      employeeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
 * @description Returns a list of projects that the employee is assigned to.
 * @tags Employees
 * @name GetEmployeeProjects
 * @summary Get projects which employee is assigned to
 * @request GET:/employees/{employeeId}/projects
 * @response `200` `{
    employee: {
  \** @example 91720 *\
    id: number,
  \** @example "John Doe" *\
    name: string,
  \** @example "Software Developer" *\
    position: string,
  \** @example "Marketing" *\
    department: string,
  \** @example "https://placekitten.com/200/200" *\
    imgURL?: string,

},
    projects: (ProjectEmployeeInvolvement)[],

}` Successful operation
 * @response `404` `ErrorResponse` Employee not found
 * @response `500` `ErrorResponse`
 * @response `503` `ErrorResponse`
*/
  export namespace GetEmployeeProjects {
    export type RequestParams = {
      /** @example 91720 */
      employeeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      employee: {
        /** @example 91720 */
        id: number;
        /** @example "John Doe" */
        name: string;
        /** @example "Software Developer" */
        position: string;
        /** @example "Marketing" */
        department: string;
        /** @example "https://placekitten.com/200/200" */
        imgURL?: string;
      };
      projects: ProjectEmployeeInvolvement[];
    };
  }
}
