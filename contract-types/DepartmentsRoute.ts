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

import { Department, DepartmentInput, Money } from "./data-contracts";

export namespace Departments {
  /**
   * No description
   * @tags Departments
   * @name GetDepartments
   * @summary List all departments
   * @request GET:/departments
   * @response `200` `(Department)[]` Successful operation
   */
  export namespace GetDepartments {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Department[];
  }

  /**
   * No description
   * @tags Departments
   * @name CreateDepartment
   * @summary Create a new department
   * @request POST:/departments
   * @response `201` `Department` Department created successfully
   * @response `400` `void` Invalid input
   */
  export namespace CreateDepartment {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DepartmentInput;
    export type RequestHeaders = {};
    export type ResponseBody = Department;
  }

  /**
   * No description
   * @tags Departments
   * @name GetDepartmentsCount
   * @summary Get total number of departments
   * @request GET:/departments/count
   * @response `200` `Money` Successful operation
   */
  export namespace GetDepartmentsCount {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }

  /**
   * No description
   * @tags Departments
   * @name GetDepartmentById
   * @summary Get department by ID
   * @request GET:/departments/{departmentId}
   * @response `200` `Department` Successful operation
   * @response `404` `void` Department not found
   */
  export namespace GetDepartmentById {
    export type RequestParams = {
      departmentId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Department;
  }

  /**
   * No description
   * @tags Departments
   * @name UpdateDepartment
   * @summary Update department
   * @request PUT:/departments/{departmentId}
   * @response `200` `Department` Department updated successfully
   * @response `400` `void` Invalid input
   * @response `404` `void` Department not found
   */
  export namespace UpdateDepartment {
    export type RequestParams = {
      departmentId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = DepartmentInput;
    export type RequestHeaders = {};
    export type ResponseBody = Department;
  }

  /**
   * No description
   * @tags Departments
   * @name DeleteDepartment
   * @summary Delete department
   * @request DELETE:/departments/{departmentId}
   * @response `204` `void` Department deleted successfully
   * @response `404` `void` Department not found
   */
  export namespace DeleteDepartment {
    export type RequestParams = {
      departmentId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
