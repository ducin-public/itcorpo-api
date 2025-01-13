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

import { Money, Office, OfficeAmenity, OfficeInput } from "./data-contracts";

export namespace Offices {
  /**
   * @description Returns an array of office amenity objects that can be assigned to offices
   * @tags Offices
   * @name GetOfficeAmenities
   * @summary Retrieve list of possible office amenities
   * @request GET:/offices/amenities
   * @response `200` `(OfficeAmenity)[]` Successful operation
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
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
   * @request GET:/offices/amenities/count
   * @response `200` `Money` Successful operation
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetOfficeAmenitiesCount {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }

  /**
   * No description
   * @tags Offices, Search
   * @name GetOffices
   * @summary List all offices
   * @request GET:/offices
   * @response `200` `(Office)[]` Successful operation
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetOffices {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Full text search across country, city, address and estate owner fields
       * @example "Amsterdam"
       */
      phrase?: string;
      /**
       * Comma-separated list of country codes to filter by
       * @example "PL,US"
       */
      countries?: string;
      /**
       * Comma-separated list of amenity codes to filter by
       * @example "FREE_PARKING,SHOWER"
       */
      amenities?: string;
      /**
       * If more than one amenity is passed, return either offices with any of the amenities (`ANY`) or with all of them (`ALL`)
       * @default "ANY"
       * @example "ALL"
       */
      amenitiesFiltering?: "ANY" | "ALL";
    };
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
   * @response `400` `ErrorResponse` Invalid office input request body @see {@link OfficeInput}
   * @response `409` `ErrorResponse` Office with this code already exists
   * @response `422` `ErrorResponse` Invalid office configuration (e.g. invalid country code, unknown amenity)
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
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
   * @tags Offices, Search
   * @name GetOfficesCount
   * @summary Get total number of offices
   * @request GET:/offices/count
   * @response `200` `Money` Successful operation
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetOfficesCount {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Full text search across country, city, address and estate owner fields
       * @example "Amsterdam"
       */
      phrase?: string;
      /**
       * Comma-separated list of country codes to filter by
       * @example "PL,US"
       */
      countries?: string;
      /**
       * Comma-separated list of amenity codes to filter by
       * @example "FREE_PARKING,SHOWER"
       */
      amenities?: string;
      /**
       * If more than one amenity is passed, return either offices with any of the amenities (`ANY`) or with all of them (`ALL`)
       * @default "ANY"
       * @example "ALL"
       */
      amenitiesFiltering?: "ANY" | "ALL";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }

  /**
   * No description
   * @tags Offices
   * @name GetOfficeByCode
   * @summary Get office by office code
   * @request GET:/offices/{officeCode}
   * @response `200` `Office` Successful operation
   * @response `404` `ErrorResponse` Office not found
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetOfficeByCode {
    export type RequestParams = {
      officeCode: string;
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
   * @request PUT:/offices/{officeCode}
   * @response `200` `Office` Office updated successfully
   * @response `400` `ErrorResponse` Invalid office input request body @see {@link OfficeInput}
   * @response `404` `ErrorResponse` Office not found
   * @response `409` `ErrorResponse` Office code already taken by another office
   * @response `422` `ErrorResponse` Invalid office configuration (e.g. invalid country code, unknown amenity)
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace UpdateOffice {
    export type RequestParams = {
      officeCode: string;
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
   * @request DELETE:/offices/{officeCode}
   * @response `204` `void` Office deleted successfully
   * @response `404` `ErrorResponse` Office not found
   * @response `409` `ErrorResponse` Cannot delete office that has assigned employees
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace DeleteOffice {
    export type RequestParams = {
      officeCode: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
