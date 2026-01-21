type ObjectValues<T> = T[keyof T];

type KeyOf<T> = keyof typeof T;

type GetValues<T> = (typeof T)[keyof typeof T];

type Prettify<T> = {
  [K in keyof T]: Prettify<T[K]>;
} & {};

type ArrayFixedLength<
  T,
  Min extends number,
  Max extends number,
  A extends (T | undefined)[] = [],
  O extends boolean = false,
> = O extends false
  ? Min extends A["length"]
    ? ArrayFixedLength<T, Min, Max, A, true>
    : ArrayFixedLength<T, Min, Max, [...A, T], false>
  : Max extends A["length"]
    ? A
    : ArrayFixedLength<T, Min, Max, [...A, T?], false>;
