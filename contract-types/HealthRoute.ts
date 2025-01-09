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

import { HealthStatus } from "./data-contracts";

export namespace Health {
  /**
   * @description Endpoint to check the health of the API
   * @tags System
   * @name HealthCheck
   * @summary Health Check
   * @request GET:/health
   * @response `200` `HealthStatus` API is healthy
   * @response `500` `ErrorResponse` API is not healthy
   * @response `503` `(HealthStatus | ErrorResponse)` Server is unhealthy or temporarily unavailable.
   */
  export namespace HealthCheck {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthStatus;
  }
}
