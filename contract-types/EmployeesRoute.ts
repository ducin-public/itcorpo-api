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

import { Employee, EmployeeInput, Money } from "./data-contracts";

export namespace Employees {
  /**
   * No description
   * @tags Employees
   * @name GetEmployees
   * @summary List all employees
   * @request GET:/employees
   * @response `200` `(Employee)[]` Successful operation
   */
  export namespace GetEmployees {
    export type RequestParams = {};
    export type RequestQuery = {
      employeeName?: any;
      departmentId?: any;
      skills?: any;
      skillsFiltering?: any;
      salaryFrom?: any;
      salaryTo?: any;
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
   * @response `400` `void` Invalid input
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
   * @tags Employees
   * @name GetEmployeesCount
   * @summary Get total number of employees
   * @request GET:/employees/count
   * @response `200` `Money` Successful operation
   */
  export namespace GetEmployeesCount {
    export type RequestParams = {};
    export type RequestQuery = {
      employeeName?: any;
      departmentId?: any;
      skills?: any;
      skillsFiltering?: any;
      salaryFrom?: any;
      salaryTo?: any;
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
   * @response `404` `void` Employee not found
   */
  export namespace GetEmployeeById {
    export type RequestParams = {
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
   * @response `400` `void` Invalid input
   * @response `404` `void` Employee not found
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
   * @response `404` `void` Employee not found
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
}
