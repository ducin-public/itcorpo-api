import { DBError } from "./db-error";

export type QueryParams = {
    $limit: number;
    $skip: number;
}

export const validateQueryParams = (params: Partial<QueryParams>): void => {
    if (params.$limit && (params.$limit < 1 || params.$limit > 100)) {
        throw new DBError(`Invalid limit value: ${params.$limit}`);
    }
    if (params.$skip && params.$skip < 0) {
        throw new DBError(`Invalid skip value: ${params.$skip}`);
    }
}
