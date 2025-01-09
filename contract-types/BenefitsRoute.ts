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

import {
  BenefitCharge,
  BenefitChargesSearchCriteria,
  BenefitService,
  BenefitSubscription,
  BenefitSubscriptionInput,
  BenefitsSearchCriteria,
  Money,
} from "./data-contracts";

export namespace Benefits {
  /**
   * No description
   * @tags Benefits
   * @name GetBenefitServices
   * @summary List all available benefit services
   * @request GET:/benefits/services
   * @response `200` `(BenefitService)[]` Successful operation
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetBenefitServices {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BenefitService[];
  }

  /**
   * No description
   * @tags Benefits
   * @name GetBenefitCharges
   * @summary List all benefit charges
   * @request GET:/benefits/charges
   * @response `200` `(BenefitCharge)[]` Successful operation
   * @response `400` `ErrorResponse` Invalid benefit charges search criteria @see {@link BenefitChargesSearchCriteria}
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetBenefitCharges {
    export type RequestParams = {};
    export type RequestQuery = {
      subscriptionId?: any;
      providerServiceCode?: any;
      status?: any;
      billingPeriodFrom?: any;
      billingPeriodTo?: any;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BenefitCharge[];
  }

  /**
   * No description
   * @tags Benefits
   * @name GetBenefitSubscriptions
   * @summary List all benefits subscriptions
   * @request GET:/benefits
   * @response `200` `(BenefitSubscription)[]` Successful operation
   * @response `400` `ErrorResponse` Invalid benefit subscriptions search criteria @see {@link BenefitsSearchCriteria}
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetBenefitSubscriptions {
    export type RequestParams = {};
    export type RequestQuery = {
      serviceName?: any;
      categories?: any;
      employeeId?: any;
      feeFrom?: any;
      feeTo?: any;
      status?: any;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BenefitSubscription[];
  }

  /**
   * No description
   * @tags Benefits
   * @name CreateBenefit
   * @summary Create a new benefit
   * @request POST:/benefits
   * @response `201` `BenefitSubscription` Benefit created successfully
   * @response `400` `ErrorResponse` Invalid benefit subscription input request body @see {@link BenefitSubscriptionInput}
   * @response `409` `ErrorResponse` Benefit already exists for this employee and service
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace CreateBenefit {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BenefitSubscriptionInput;
    export type RequestHeaders = {};
    export type ResponseBody = BenefitSubscription;
  }

  /**
   * No description
   * @tags Benefits
   * @name GetBenefitsCount
   * @summary Get total number of benefits
   * @request GET:/benefits/count
   * @response `200` `Money` Successful operation
   * @response `400` `ErrorResponse` Invalid benefit subscriptions search criteria @see {@link BenefitsSearchCriteria}
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetBenefitsCount {
    export type RequestParams = {};
    export type RequestQuery = {
      serviceName?: any;
      employeeId?: any;
      feeFrom?: any;
      feeTo?: any;
      status?: any;
    };
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
   * @response `200` `BenefitSubscription` Successful operation
   * @response `404` `ErrorResponse` Benefit not found
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetBenefitById {
    export type RequestParams = {
      benefitId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BenefitSubscription;
  }

  /**
   * No description
   * @tags Benefits
   * @name UpdateBenefit
   * @summary Update benefit
   * @request PUT:/benefits/{benefitId}
   * @response `200` `BenefitSubscription` Benefit updated successfully
   * @response `400` `ErrorResponse` Invalid benefit subscription input request body @see {@link BenefitSubscriptionInput}
   * @response `404` `ErrorResponse` Benefit not found
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace UpdateBenefit {
    export type RequestParams = {
      benefitId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = BenefitSubscriptionInput;
    export type RequestHeaders = {};
    export type ResponseBody = BenefitSubscription;
  }

  /**
   * No description
   * @tags Benefits
   * @name UpdateBenefitSubscriptionStatus
   * @summary Cancel or renew benefit subscription
   * @request PATCH:/benefits/{benefitId}
   * @response `200` `BenefitSubscription` Benefit subscription status updated successfully
   * @response `400` `ErrorResponse` Invalid benefit subscription status update @see {@link BenefitSubscriptionInput}
   * @response `404` `ErrorResponse` Benefit subscription not found
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace UpdateBenefitSubscriptionStatus {
    export type RequestParams = {
      benefitId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = {
      operation: "CANCEL" | "RENEW";
    };
    export type RequestHeaders = {};
    export type ResponseBody = BenefitSubscription;
  }

  /**
   * No description
   * @tags Benefits
   * @name GetBenefitSubscriptionCharges
   * @summary List all benefit charges for a specific subscription
   * @request GET:/benefits/{benefitId}/charges
   * @response `200` `(BenefitCharge)[]` Successful operation
   * @response `400` `ErrorResponse` Invalid benefit charges search criteria @see {@link BenefitChargesSearchCriteria}
   * @response `404` `ErrorResponse` Benefit subscription not found
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetBenefitSubscriptionCharges {
    export type RequestParams = {
      benefitId: string;
    };
    export type RequestQuery = {
      providerServiceCode?: any;
      status?: any;
      billingPeriodFrom?: any;
      billingPeriodTo?: any;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = BenefitCharge[];
  }
}
