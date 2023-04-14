export type AnyFn = (...args: any[]) => any;

// /**
//  * This would evaluate/expand a type into the final representation
//  */
// export type ForceExpand<T> = T extends AnyFn
//   ? T
//   : T extends unknown
//   ? { [K in keyof T]: T[K] }
//   : never;

/**
 * This would evaluate/expand a type into the final representation
 */
type _ForceExpand<T> = T extends unknown
  ? { [K in keyof T]: _ForceExpand<T[K]> } & T extends AnyFn
    ? {
        (): T;
      }
    : T
  : never;
