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

export namespace Health {
  /**
 * @description Endpoint to check the health of the API
 * @tags System
 * @name HealthCheck
 * @summary Health Check
 * @request GET:/health
 * @response `200` `{
  \** @example "OK" *\
    status?: string,
  \** @example "All systems operational" *\
    message?: string,

}` API is healthy
 * @response `500` `HealthStatus` API is not healthy
*/
  export namespace HealthCheck {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example "OK" */
      status?: string;
      /** @example "All systems operational" */
      message?: string;
    };
  }
}
