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

import { DateString } from "./data-contracts";

export namespace License {
  /**
   * @description Returns the license text for the API
   * @tags System
   * @name LicenseList
   * @summary Get license information
   * @request GET:/license
   * @response `200` `DateString` License text retrieved successfully
   * @response `400` `ErrorResponse` Invalid Content-Type requested
   * @response `403` `ErrorResponse` Access to license file forbidden
   * @response `503` `ErrorResponse` License file not available
   */
  export namespace LicenseList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** Must be text/plain */
      "Content-Type": "text/plain";
    };
    export type ResponseBody = DateString;
  }
}
