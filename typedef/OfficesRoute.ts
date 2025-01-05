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
   * @tags Offices
   * @name GetOffices
   * @summary List all offices
   * @request GET:/offices
   * @response `200` `(Office)[]` Successful operation
   */
  export namespace GetOffices {
    export type RequestParams = {};
    export type RequestQuery = {
      countries?: any;
      amenities?: any;
      phrase?: any;
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
    export type RequestQuery = {
      countries?: any;
      amenities?: any;
      phrase?: any;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }

  /**
   * No description
   * @tags Offices
   * @name GetOfficeByCode
   * @summary Get office by ID
   * @request GET:/offices/{officeCode}
   * @response `200` `Office` Successful operation
   * @response `404` `void` Office not found
   */
  export namespace GetOfficeByCode {
    export type RequestParams = {
      officeId: string;
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
   * @response `400` `void` Invalid input
   * @response `404` `void` Office not found
   */
  export namespace UpdateOffice {
    export type RequestParams = {
      officeId: string;
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
   * @response `404` `void` Office not found
   */
  export namespace DeleteOffice {
    export type RequestParams = {
      officeId: string;
      officeCode: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
