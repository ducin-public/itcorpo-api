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

import { File } from "node:buffer";

export namespace Images {
  /**
   * @description Returns the image file by name
   * @tags System
   * @name AvatarsDetail
   * @summary Get image by name
   * @request GET:/images/avatars/{imageName}
   * @response `200` `File` Image file retrieved successfully
   * @response `404` `void` Image file not found
   */
  export namespace AvatarsDetail {
    export type RequestParams = {
      imageName: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = File;
  }

  /**
   * @description Returns the image file by name
   * @tags System
   * @name OfficesDetail
   * @summary Get image by name
   * @request GET:/images/offices/{imageName}
   * @response `200` `File` Image file retrieved successfully
   * @response `404` `void` Image file not found
   */
  export namespace OfficesDetail {
    export type RequestParams = {
      imageName: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = File;
  }

  /**
   * @description Returns the image file by name
   * @tags System
   * @name ErrorDetail
   * @summary Get image by name
   * @request GET:/images/error/{imageName}
   * @response `200` `File` Image file retrieved successfully
   * @response `404` `void` Image file not found
   */
  export namespace ErrorDetail {
    export type RequestParams = {
      imageName: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = File;
  }
}
