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

export namespace Auth {
  /**
 * No description
 * @tags Auth
 * @name GetAuthToken
 * @summary Get JWT authentication token
 * @request GET:/auth
 * @response `200` `{
  \** JWT token signed with server's secret *\
    token: string,

}` Successfully generated JWT token
 * @response `401` `ErrorResponse` Authentication failed
 * @response `500` `ErrorResponse`
 * @response `503` `ErrorResponse`
*/
  export namespace GetAuthToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** JWT token signed with server's secret */
      token: string;
    };
  }
}
