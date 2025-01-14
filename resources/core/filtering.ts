export type Predicate<T> = (value: T) => boolean;

export const all = <T>(predicates: Predicate<T>[]): Predicate<T> =>
    (item: T) => predicates.every(predicate => predicate(item));

export const any = <T>(predicates: Predicate<T>[]): Predicate<T> =>
    (item: T) => predicates.some(predicate => predicate(item));
