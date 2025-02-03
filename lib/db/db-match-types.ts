import { ComparisonCriteria, LogicalOperator } from "./db-comparison-types";

type FieldMatchCriteria<TItem extends object> = {
    [P in keyof TItem]?: ComparisonCriteria<TItem[P]>;
}

type LogicalMatchCriteria<TItem extends object> = {
    [K in LogicalOperator]?: Array<MatchCriteria<TItem>>;
}

export type WhereFunction<T> = (item: T) => boolean;

export type EvaluationCriteria<T> = {
    $where?: WhereFunction<T>;
}

export type MatchCriteria<TItem extends object> = FieldMatchCriteria<TItem> & LogicalMatchCriteria<TItem> & EvaluationCriteria<TItem>;

/**
 * Sample usage:
 * 
 * ```
 * $match: {
 *   id: { $eq: 1 },
 *   name: { $in: ['a', 'b'] },
 *   $or: [
 *     { id: { $lt: 2 } },
 *     { 
 *       $and: [
 *         { id: { $gt: 2 } },
 *         { id: { $lt: 5 } }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export type MatchParams<TItem extends object> = {
    $match?: MatchCriteria<TItem>;
}
