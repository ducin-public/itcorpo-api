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

import { Expense, ExpenseInput, Money } from "./data-contracts";

export namespace Expenses {
  /**
   * No description
   * @tags Expenses
   * @name GetExpenses
   * @summary List all expenses
   * @request GET:/expenses
   * @response `200` `(Expense)[]` Successful operation
   */
  export namespace GetExpenses {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Expense[];
  }

  /**
   * No description
   * @tags Expenses
   * @name CreateExpense
   * @summary Create a new expense
   * @request POST:/expenses
   * @response `201` `Expense` Expense created successfully
   * @response `400` `void` Invalid input
   */
  export namespace CreateExpense {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ExpenseInput;
    export type RequestHeaders = {};
    export type ResponseBody = Expense;
  }

  /**
   * No description
   * @tags Expenses
   * @name GetExpensesCount
   * @summary Get total number of expenses
   * @request GET:/expenses/count
   * @response `200` `Money` Successful operation
   */
  export namespace GetExpensesCount {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }

  /**
   * No description
   * @tags Expenses
   * @name GetExpenseById
   * @summary Get expense by ID
   * @request GET:/expenses/{expenseId}
   * @response `200` `Expense` Successful operation
   * @response `404` `void` Expense not found
   */
  export namespace GetExpenseById {
    export type RequestParams = {
      expenseId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Expense;
  }

  /**
   * No description
   * @tags Expenses
   * @name UpdateExpense
   * @summary Update expense
   * @request PUT:/expenses/{expenseId}
   * @response `200` `Expense` Expense updated successfully
   * @response `400` `void` Invalid input
   * @response `404` `void` Expense not found
   */
  export namespace UpdateExpense {
    export type RequestParams = {
      expenseId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ExpenseInput;
    export type RequestHeaders = {};
    export type ResponseBody = Expense;
  }

  /**
   * No description
   * @tags Expenses
   * @name DeleteExpense
   * @summary Delete expense
   * @request DELETE:/expenses/{expenseId}
   * @response `204` `void` Expense deleted successfully
   * @response `404` `void` Expense not found
   */
  export namespace DeleteExpense {
    export type RequestParams = {
      expenseId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
