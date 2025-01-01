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

import { Money, Office, OfficeInput } from "./data-contracts";

export namespace Offices {
  /**
   * No description
   * @tags Offices
   * @name GetOffices
   * @summary List all offices
   * @request GET:/offices
   * @response `200` `(Office)[]` Successful operation
   */
  export namespace GetOffices {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Office[];
  }

  /**
   * No description
   * @tags Offices
   * @name CreateOffice
   * @summary Create a new office
   * @request POST:/offices
   * @response `201` `Office` Office created successfully
   * @response `400` `void` Invalid input
   */
  export namespace CreateOffice {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = OfficeInput;
    export type RequestHeaders = {};
    export type ResponseBody = Office;
  }

  /**
   * No description
   * @tags Offices
   * @name GetOfficesCount
   * @summary Get total number of offices
   * @request GET:/offices/count
   * @response `200` `Money` Successful operation
   */
  export namespace GetOfficesCount {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }

  /**
   * No description
   * @tags Offices
   * @name GetOfficeById
   * @summary Get office by ID
   * @request GET:/offices/{officeId}
   * @response `200` `Office` Successful operation
   * @response `404` `void` Office not found
   */
  export namespace GetOfficeById {
    export type RequestParams = {
      officeId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Office;
  }

  /**
   * No description
   * @tags Offices
   * @name UpdateOffice
   * @summary Update office
   * @request PUT:/offices/{officeId}
   * @response `200` `Office` Office updated successfully
   * @response `400` `void` Invalid input
   * @response `404` `void` Office not found
   */
  export namespace UpdateOffice {
    export type RequestParams = {
      officeId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = OfficeInput;
    export type RequestHeaders = {};
    export type ResponseBody = Office;
  }

  /**
   * No description
   * @tags Offices
   * @name DeleteOffice
   * @summary Delete office
   * @request DELETE:/offices/{officeId}
   * @response `204` `void` Office deleted successfully
   * @response `404` `void` Office not found
   */
  export namespace DeleteOffice {
    export type RequestParams = {
      officeId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
