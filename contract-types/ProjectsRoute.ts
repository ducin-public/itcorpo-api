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
  Money,
  Project,
  ProjectInput,
  ProjectStatus,
  ProjectWithTeam,
} from "./data-contracts";

export namespace Projects {
  /**
   * No description
   * @tags Projects, Pagination, Search
   * @name GetProjects
   * @summary List all projects
   * @request GET:/projects
   * @response `200` `(Project)[]` Successful operation
   * @response `400` `ErrorResponse` Invalid projects search criteria
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetProjects {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Filter projects by name
       * @example "Cloud migration"
       */
      projectName?: string;
      /**
       * Filter projects by status
       * @example "ACTIVE"
       */
      status?: ProjectStatus;
      /**
       * Filter projects by team member IDs according to `teamMembersFiltering`
       * @example "123,456,789"
       */
      teamMembers?: string;
      /**
       * If more than one ID is passed, return either projects with any of the team members (`ANY`) or with all of them (`ALL`)
       * @default "ANY"
       * @example "ALL"
       */
      teamMembersFiltering?: "ANY" | "ALL";
      /**
       * Minimum project budget amount
       * @example "10000"
       */
      budgetFrom?: string;
      /**
       * Maximum project budget amount
       * @example "50000"
       */
      budgetTo?: string;
      /**
       * Page number to retrieve
       * @example 1
       */
      page?: number;
      /**
       * Number of elements per page
       * @min 1
       * @max 50
       * @example 1
       */
      pageSize?: number;
      /**
       * Sort projects by field
       * @default "startDate"
       * @example "startDate"
       */
      sortBy?: "name" | "status" | "startDate" | "endDate" | "teamSize";
      /**
       * Sort order
       * @default "asc"
       * @example "asc"
       */
      sortOrder?: "asc" | "desc";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Project[];
  }

  /**
   * No description
   * @tags Projects
   * @name CreateProject
   * @summary Create a new project
   * @request POST:/projects
   * @response `201` `Project` Project created successfully
   * @response `400` `ErrorResponse` Invalid project input request body @see {@link ProjectInput}
   * @response `409` `ErrorResponse` Project with this name already exists in given time period
   * @response `422` `ErrorResponse` Invalid data state (e.g. manager not found, team members don't exist, invalid date range)
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace CreateProject {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProjectInput;
    export type RequestHeaders = {};
    export type ResponseBody = Project;
  }

  /**
   * No description
   * @tags Projects, Search
   * @name GetProjectsCount
   * @summary Get total number of projects
   * @request GET:/projects/count
   * @response `200` `Money` Successful operation
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetProjectsCount {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Filter projects by name
       * @example "Cloud migration"
       */
      projectName?: string;
      /**
       * Filter projects by status
       * @example "ACTIVE"
       */
      status?: ProjectStatus;
      /**
       * Filter projects by team member IDs according to `teamMembersFiltering`
       * @example "123,456,789"
       */
      teamMembers?: string;
      /**
       * If more than one ID is passed, return either projects with any of the team members (`ANY`) or with all of them (`ALL`)
       * @default "ANY"
       * @example "ALL"
       */
      teamMembersFiltering?: "ANY" | "ALL";
      /**
       * Minimum project budget amount
       * @example "10000"
       */
      budgetFrom?: string;
      /**
       * Maximum project budget amount
       * @example "50000"
       */
      budgetTo?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Money;
  }

  /**
   * No description
   * @tags Projects
   * @name GetProjectById
   * @summary Get project by ID
   * @request GET:/projects/{projectId}
   * @response `200` `Project` Successful operation
   * @response `404` `ErrorResponse` Project not found
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetProjectById {
    export type RequestParams = {
      /** @example "579ef28f-c539-41ff-abe2-e4f6b1c1afed" */
      projectId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = Project;
  }

  /**
   * No description
   * @tags Projects
   * @name UpdateProject
   * @summary Update project
   * @request PUT:/projects/{projectId}
   * @response `200` `Project` Project updated successfully
   * @response `400` `ErrorResponse` Invalid project input request body @see {@link ProjectInput}
   * @response `404` `ErrorResponse` Project not found
   * @response `409` `ErrorResponse` Project name already taken by another project in given time period
   * @response `422` `ErrorResponse` Invalid data state (e.g. manager not found, team members don't exist, invalid date range)
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace UpdateProject {
    export type RequestParams = {
      projectId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ProjectInput;
    export type RequestHeaders = {};
    export type ResponseBody = Project;
  }

  /**
   * No description
   * @tags Projects
   * @name DeleteProject
   * @summary Delete project
   * @request DELETE:/projects/{projectId}
   * @response `204` `void` Project deleted successfully
   * @response `404` `ErrorResponse` Project not found
   * @response `409` `ErrorResponse` Cannot delete project that is in ACTIVE status
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace DeleteProject {
    export type RequestParams = {
      projectId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Returns a list of employees that are assigned to the project.
   * @tags Projects
   * @name GetProjectTeam
   * @summary Get project team (employees assigned to the project)
   * @request GET:/projects/{projectId}/team
   * @response `200` `ProjectWithTeam` Successful operation
   * @response `404` `ErrorResponse` Employee not found
   * @response `500` `ErrorResponse`
   * @response `503` `ErrorResponse`
   */
  export namespace GetProjectTeam {
    export type RequestParams = {
      /** @example "579ef28f-c539-41ff-abe2-e4f6b1c1afed" */
      projectId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProjectWithTeam;
  }
}
