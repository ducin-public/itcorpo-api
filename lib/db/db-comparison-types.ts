export type SingleComparisonOperator = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte';
export type MultiComparisonOperator = '$in' | '$nin';
export type LogicalOperator = '$and' | '$or' | '$nor' | '$not';

export type ComparisonCriteria<T> = {
    [K in SingleComparisonOperator]?: T;
} & {
    [K in MultiComparisonOperator]?: T[];
}

export type EvaluationOperator = '$where';
