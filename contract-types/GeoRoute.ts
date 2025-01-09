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

import { Geo } from "./data-contracts";

export namespace Geo {
  /**
   * @description Returns a dictionary of country codes and country names
   * @tags Geo
   * @name GetGeo
   * @summary Get geographical data
   * @request GET:/geo
   * @response `200` `Geo` Successful operation
   * @response `500` `ErrorResponse` Internal server error
   */
  export namespace GetGeo {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Geo;
  }
}
