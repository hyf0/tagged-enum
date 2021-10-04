# Example

see `src/__test__` or [codesandbox](https://codesandbox.io/s/crazy-dijkstra-0nsmm?file=/src/index.ts)

# Install

```
yarn add tagged-enum
// or
npm i tagged-enum
```

# Usage

## Defining an Enum

### Ip Address

```ts
const IpAddr = Enum({
  V4: (a: number, b: number, c: number, d: number) => [a, b, c, d] as const,
  V6: (addr: string) => addr,
})

type IpAddr = typeof IpAddr.$type$

const home = IpAddr.V4(127, 0, 0, 1);

const loopback = IpAddr.V6('::1');
```

### Animal

```ts
const Animal = Enum({
    Fox: null,
    Rabbit: null,
    Custom: (species: string) => species,
})

const nick = Animal.Fox
const judy = Animal.Rabbit
const flash = Animal.Custom('sloth')
```

## `match`

### Coin

```ts
const Coin = Enum({
  Penny: null,
  Nickel: null,
  Dime: null,
  Quarter: null,
});
type Coin = typeof Coin.$type$;

function value_in_cents(coin: Coin): number {
  return match(coin)({
    Penny: () => {
      console.log("Lucky penny!");
      return 1
    },
    Nickel: () => 5,
    Dime: () => 10,
    Quarter: () => 25,
  });
}
```

## Exhaustive matching

```ts
const Coin = Enum({
  Penny: null,
  Nickel: null,
  Dime: null,
  Quarter: null,
});
type Coin = typeof Coin.$type$;

// Missing match arm for `Quarter`. Compiling error occurs.
function value_in_cents(coin: Coin): number {
  return match(coin)({
    Penny: () => {
      console.log("Lucky penny!");
      return 1
    },
    Nickel: () => 5,
    Dime: () => 10,
    // Quarter: () => 25,
  });
}
```

### Using `_` to catch cases aren't specified

```ts
const Coin = Enum({
  Penny: null,
  Nickel: null,
  Dime: null,
  Quarter: null,
});
type Coin = typeof Coin.$type$;

// With `_`, the missing match arms won't causes compiling errors.
function value_in_cents(coin: Coin): number {
  return match(coin)({
    Penny: () => {
      console.log("Lucky penny!");
      return 1
    },
    // Nickel: () => 5,
    // Dime: () => 10,
    // Quarter: () => 25,
    _: () => 0,
  });
}
```

# Limitation

tagged-enum is implemented in userland, not a built-in language feature. So, there are some limitations.

## Recursive Type

```ts
// List implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer ts(7022)
const List = Enum({
  Nil: null,
  Cons: (contains: number, tail: List) => ({ contains, tail, })
})
type List = typeof List.$type$;
```

## Generic Type

```ts
const Option = Enum({
  None: null,
  // `T` will be infered as `unkown`
  Some: <T>(value: T) => ({ value }),
})
type Option = typeof Option.$type$;
```

### Workaround

```ts
const OptionNumber = Enum({
  None: null,
  // `T` will be infered as `unknown`
  Some: (value: number) => ({ value }),
})
type OptionNumber = typeof OptionNumber.$type$;
```
