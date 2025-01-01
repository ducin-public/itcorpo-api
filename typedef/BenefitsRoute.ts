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

import { Benefit, BenefitInput, Money } from "./data-contracts";

export namespace Benefits {
  /**
   * No description
   * @tags Benefits
   * @name GetBenefits
   * @summary List all benefits
   * @request GET:/benefits
   * @response `200` `(Benefit)[]` Successful operation
   */
  export namespace GetBenefits {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Benefit[];
  }

  /**
   * No description
   * @tags Benefits
   * @name CreateBenefit
   * @summary Create a new benefit
   * @request POST:/benefits
   * @response `201` `Benefit` Benefit created successfully
   * @response `400` `void` Invalid input
   */
  export namespace CreateBenefit {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BenefitInput;
    export type RequestHeaders = {};
    export type ResponseBody = Benefit;
  }

  /**
   * No description
   * @tags Benefits
   * @name GetBenefitsCount
   * @summary Get total number of benefits
   * @request GET:/benefits/count
   * @response `200` `Money` Successful operation
   */
  export namespace GetBenefitsCount {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }

  /**
   * No description
   * @tags Benefits
   * @name GetBenefitById
   * @summary Get benefit by ID
   * @request GET:/benefits/{benefitId}
   * @response `200` `Benefit` Successful operation
   * @response `404` `void` Benefit not found
   */
  export namespace GetBenefitById {
    export type RequestParams = {
      benefitId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Benefit;
  }

  /**
   * No description
   * @tags Benefits
   * @name UpdateBenefit
   * @summary Update benefit
   * @request PUT:/benefits/{benefitId}
   * @response `200` `Benefit` Benefit updated successfully
   * @response `400` `void` Invalid input
   * @response `404` `void` Benefit not found
   */
  export namespace UpdateBenefit {
    export type RequestParams = {
      benefitId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = BenefitInput;
    export type RequestHeaders = {};
    export type ResponseBody = Benefit;
  }

  /**
   * No description
   * @tags Benefits
   * @name DeleteBenefit
   * @summary Delete benefit
   * @request DELETE:/benefits/{benefitId}
   * @response `204` `void` Benefit deleted successfully
   * @response `404` `void` Benefit not found
   */
  export namespace DeleteBenefit {
    export type RequestParams = {
      benefitId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
