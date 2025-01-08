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

import { Money, Project, ProjectInput } from "./data-contracts";

export namespace Projects {
  /**
   * No description
   * @tags Projects
   * @name GetProjects
   * @summary List all projects
   * @request GET:/projects
   * @response `200` `(Project)[]` Successful operation
   */
  export namespace GetProjects {
    export type RequestParams = {};
    export type RequestQuery = {
      projectName?: any;
      status?: any;
      teamMembers?: any;
      teamMembersFiltering?: any;
      budgetFrom?: any;
      budgetTo?: any;
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
   * @response `400` `void` Invalid input
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
   * @tags Projects
   * @name GetProjectsCount
   * @summary Get total number of projects
   * @request GET:/projects/count
   * @response `200` `Money` Successful operation
   */
  export namespace GetProjectsCount {
    export type RequestParams = {};
    export type RequestQuery = {
      projectName?: any;
      status?: any;
      teamMembers?: any;
      teamMembersFiltering?: any;
      budgetFrom?: any;
      budgetTo?: any;
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
   * @response `404` `void` Project not found
   */
  export namespace GetProjectById {
    export type RequestParams = {
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
   * @response `400` `void` Invalid input
   * @response `404` `void` Project not found
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
   * @response `404` `void` Project not found
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
}
