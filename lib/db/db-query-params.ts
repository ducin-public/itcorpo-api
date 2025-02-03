import { DBError } from "./db-error";
import { all } from '../../resources/core/filtering';
import { logger } from "../logger";
import { MatchCriteria, MatchParams } from "./db-match-types";

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
    logger.debug(`query criteria: ${JSON.stringify(params)}`);
}

const createLogicalPredicate = <TItem extends object>($match: MatchCriteria<TItem>, operator: keyof MatchCriteria<TItem>): (item: TItem) => boolean => {
    const conditions = $match[operator] as Array<MatchCriteria<TItem>>;
    const nestedPredicates = conditions.map(condition => 
        createPredicateFromCriteria(condition)
    );

    switch (operator) {
        case '$and':
            return (item) => nestedPredicates.every(pred => pred(item));
        case '$or':
            return (item) => nestedPredicates.some(pred => pred(item));
        case '$nor':
            return (item) => !nestedPredicates.some(pred => pred(item));
        case '$not':
            return (item) => nestedPredicates.every(pred => !pred(item));
        default:
            throw new DBError(`Invalid logical operator: ${String(operator)}`);
    }
}

const createEvaluationPredicate = <TItem extends object>($match: MatchCriteria<TItem>): (item: TItem) => boolean => {
    if (!$match.$where) {
        return () => true;
    }
    return (item) => $match.$where!(item);
}

const createComparisonPredicate = <TItem extends object>($match: MatchCriteria<TItem>): (item: TItem) => boolean => {
    const predicates: Array<(item: TItem) => boolean> = [];
    return all(predicates);
    // FIXME: Implement this
}

export const createPredicateFromCriteria = <TItem extends object>($match: MatchCriteria<TItem>): (item: TItem) => boolean => {
    const predicates: Array<(item: TItem) => boolean> = [];
    
    for (const key in $match) {
        const value = ($match as any)[key];
        if (!value) continue;

        if (['$and', '$or', '$nor', '$not'].includes(key)) {
            predicates.push(createLogicalPredicate($match, key as keyof MatchCriteria<TItem>));
        }

        if (['$where'].includes(key)) {
            predicates.push(createEvaluationPredicate($match));
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
