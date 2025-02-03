import { CollectionName, CollectionType } from './db-connection';
import { MatchCriteria } from './db-match-types';

export type LookupStage<
    TSource extends object,
    TFromCollection extends CollectionName,
    TLocalKey extends keyof TSource,
    TForeignKey extends keyof CollectionType<TFromCollection>,
    TOutputKey extends string = string
> = {
    $lookup: {
        from: TFromCollection;
        localField: TLocalKey;
        foreignField: TForeignKey;
        as: TOutputKey;
    };
};

export type WithLookupResult<
    TSource extends object,
    TFromCollection extends CollectionName,
    TOutputKey extends string
> = TSource & {
    [K in TOutputKey]: CollectionType<TFromCollection>[]
};

export type MatchStage<TSource extends object> = {
    $match: MatchCriteria<TSource>;
};

export type AggregateStage<TSource extends object, TOutputKey extends string> =
    | MatchStage<TSource>
    | LookupStage<TSource, CollectionName, keyof TSource, any, TOutputKey>;

export type InferAggregateResult<
    TSource extends object,
    TStages extends readonly AggregateStage<TSource, string>[]
> = TStages extends readonly [infer First, ...infer Rest]
    ? First extends MatchStage<TSource>
        ? Rest extends readonly AggregateStage<TSource, string>[]
            ? InferAggregateResult<TSource, Rest>
            : TSource
        : First extends { $lookup: { from: infer From, as: infer As } }
            ? From extends CollectionName
                ? As extends string
                    ? Rest extends readonly AggregateStage<WithLookupResult<TSource, From, As>, string>[]
                        ? InferAggregateResult<WithLookupResult<TSource, From, As>, Rest>
                        : WithLookupResult<TSource, From, As>
                    : never
                : never
            : never
    : TSource;
