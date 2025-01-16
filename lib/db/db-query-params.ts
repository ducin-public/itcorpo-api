import { DBError } from "./db-error";
import { all } from '../../resources/core/filtering';

type SingleComparisonOperator = '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte';
type MultiComparisonOperator = '$in' | '$nin';
type LogicalOperator = '$and' | '$or';

type ComparisonCriteria<T> = {
    [K in SingleComparisonOperator]?: T;
} & {
    [K in MultiComparisonOperator]?: T[];
}

type FieldMatchCriteria<TItem extends object> = {
    [P in keyof TItem]?: ComparisonCriteria<TItem[P]>;
}

type LogicalMatchCriteria<TItem extends object> = {
    [K in LogicalOperator]?: Array<MatchCriteria<TItem>>;
}

type MatchCriteria<TItem extends object> = FieldMatchCriteria<TItem> & LogicalMatchCriteria<TItem>;

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

export type QueryParams<TItem extends object> = {
    $limit?: number;
    $skip?: number;
} & MatchParams<TItem>;

export const validateQueryParams = (params: QueryParams<any>): void => {
    if (params.$limit && (params.$limit < 1 || params.$limit > 100)) {
        throw new DBError(`Invalid limit value: ${params.$limit}`);
    }
    if (params.$skip && params.$skip < 0) {
        throw new DBError(`Invalid skip value: ${params.$skip}`);
    }
    if (params.$match) {
        if (Object.keys(params.$match).length === 0) {
            throw new DBError(`Empty match object`);
        }
        
        // Validate logical operators arrays are not empty
        if (params.$match.$and?.length === 0) {
            throw new DBError(`Empty $and array`);
        }
        if (params.$match.$or?.length === 0) {
            throw new DBError(`Empty $or array`);
        }
    }
}

export const createPredicateFromCriteria = <TItem extends object>($match: MatchCriteria<TItem>): (item: TItem) => boolean => {
    const predicates: Array<(item: TItem) => boolean> = [];
    
    for (const key in $match) {
        const value = ($match as any)[key];
        if (!value) continue;

        if (key === '$and' || key === '$or') {
            const conditions = value as Array<MatchCriteria<TItem>>;
            const nestedPredicates = conditions.map(condition => 
                createPredicateFromCriteria(condition)
            );
            
            if (key === '$and') {
                predicates.push((item) => nestedPredicates.every(pred => pred(item)));
            } else { // $or
                predicates.push((item) => nestedPredicates.some(pred => pred(item)));
            }
            continue;
        }

        const _value = value as any;
        const _key = key as keyof TItem;
        if ('$eq' in _value) {
            predicates.push((item) => item[_key] === _value['$eq']);
        }
        if ('$ne' in _value) {
            predicates.push((item) => item[_key] !== _value['$ne']);
        }
        if ('$gt' in _value) {
            predicates.push((item) => item[_key] > _value['$gt']);
        }
        if ('$gte' in _value) {
            predicates.push((item) => item[_key] >= _value['$gte']);
        }
        if ('$lt' in _value) {
            predicates.push((item) => item[_key] < _value['$lt']);
        }
        if ('$lte' in _value) {
            predicates.push((item) => item[_key] <= _value['$lte']);
        }
        if ('$in' in _value) {
            predicates.push((item) => _value['$in'].includes(item[_key]));
        }
        if ('$nin' in _value) {
            predicates.push((item) => !_value['$nin'].includes(item[_key]));
        }
    }
    return all(predicates);
};
