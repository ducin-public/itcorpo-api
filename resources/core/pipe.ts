export function pipe<T1, T2, T3, T4, T5, T6, T7, T8>(fn1: (input: T1) => T2, fn2: (input: T2) => T3, fn3: (input: T3) => T4, fn4: (input: T4) => T5, fn5: (input: T5) => T6, fn6: (input: T6) => T7, fn7: (input: T7) => T8): (input: T1) => T8;
export function pipe<T1, T2, T3, T4, T5, T6, T7>(fn1: (input: T1) => T2, fn2: (input: T2) => T3, fn3: (input: T3) => T4, fn4: (input: T4) => T5, fn5: (input: T5) => T6, fn6: (input: T6) => T7): (input: T1) => T7;
export function pipe<T1, T2, T3, T4, T5, T6>(fn1: (input: T1) => T2, fn2: (input: T2) => T3, fn3: (input: T3) => T4, fn4: (input: T4) => T5, fn5: (input: T5) => T6): (input: T1) => T6;
export function pipe<T1, T2, T3, T4, T5>(fn1: (input: T1) => T2, fn2: (input: T2) => T3, fn3: (input: T3) => T4, fn4: (input: T4) => T5): (input: T1) => T5;
export function pipe<T1, T2, T3, T4>(fn1: (input: T1) => T2, fn2: (input: T2) => T3, fn3: (input: T3) => T4): (input: T1) => T4;
export function pipe<T1, T2, T3>(fn1: (input: T1) => T2, fn2: (input: T2) => T3): (input: T1) => T3;
export function pipe<T1, T2>(fn1: (input: T1) => T2): (input: T1) => T2;
export function pipe(...fns: Function[]): (input: unknown) => unknown {
  return input => fns.reduce((acc, fn) => fn(acc), input);
}
