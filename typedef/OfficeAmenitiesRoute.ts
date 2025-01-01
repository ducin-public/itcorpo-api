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

import { Money, OfficeAmenity } from "./data-contracts";

export namespace OfficeAmenities {
  /**
   * @description Returns an array of office amenity objects that can be assigned to offices
   * @tags Offices
   * @name GetOfficeAmenities
   * @summary Retrieve list of possible office amenities
   * @request GET:/office-amenities
   * @response `200` `(OfficeAmenity)[]` Successful operation
   */
  export namespace GetOfficeAmenities {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = OfficeAmenity[];
  }

  /**
   * No description
   * @tags Offices
   * @name GetOfficeAmenitiesCount
   * @summary Get total number of office amenities
   * @request GET:/office-amenities/count
   * @response `200` `Money` Successful operation
   */
  export namespace GetOfficeAmenitiesCount {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }
}
