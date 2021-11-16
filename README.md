<!-- # Example

see `src/__test__` or [codesandbox](https://codesandbox.io/s/crazy-dijkstra-0nsmm?file=/src/index.ts)

- Todo + React Redux [codesandbox](https://codesandbox.io/s/goofy-tree-cp6xt)/[github](https://github.com/iheyunfei/that-enum-redux-example) -->

# 

# Install

```
yarn add that-enum
// or
npm i that-enum
```

# Usage

## `Enum`

### Animal

```ts
import { Enum } from 'that-enum'

const Animal = Enum({
  Fox: null,
  Rabbit: null,
  Custom: (species: string) => species,
})

type Animal = typeof Animal.$type$ // => { type: 'Fox' } | { type: 'Rabbit' } | { type: 'Custom', payload: string }

const nick /*: Animal */ = Animal.Fox() // => { type: 'FOX' }
const judy /*: Animal */ = Animal.Rabbit() // => { type: 'Robbit' }
const flash /*: Animal */ = Animal.Custom('Sloth') // => { type: 'Custom', payload: 'Sloth' }
```

### Ip Address

```ts
import { Enum } from 'that-enum'

const IpAddr = Enum({
  V4: (a: number, b: number, c: number, d: number) => [a, b, c, d] as const,
  V6: (addr: string) => addr,
})

type IpAddr = typeof IpAddr.$type$

const home = IpAddr.V4(127, 0, 0, 1)

const loopback = IpAddr.V6('::1')
```

## `match`

```ts

import { Enum, match } from 'that-enum'

const Coin = Enum({
  Penny: null,
  Nickel: null,
  Dime: null,
  Quarter: null,
  Custom: (n: number) => n,
})

type Coin = typeof Coin.$type$

function value_in_cents(coin: Coin): number {
  return match(coin)({
    Penny() {
      console.log('Lucky penny!')
      return 1
    },
    Nickel: () => 5,
    Dime: () => 10,
    Quarter: () => 25,
    Custom: (n /*: number */) => n,
  })
}
```

### Exhaustive matching

```ts
import { Enum, match } from 'that-enum'

const Coin = Enum({
  Penny: null,
  Nickel: null,
  Dime: null,
  Quarter: null,
  Custom: (n: number) => n,
})

type Coin = typeof Coin.$type$

// Missing match arm for `Custom`. Compiling error occurs.
function value_in_cents(coin: Coin): number {
  return match(coin)({
    Penny: () => {
      console.log('Lucky penny!')
      return 1
    },
    Nickel: () => 5,
    Dime: () => 10,
    Quarter: () => 25,
  })
}
```

### Using `_` to catch cases aren't specified

```ts
import { Enum, match } from 'that-enum'

const Coin = Enum({
  Penny: null,
  Nickel: null,
  Dime: null,
  Quarter: null,
})
type Coin = typeof Coin.$type$

// With `_`, the missing match arms won't causes compiling errors.
function value_in_cents(coin: Coin): number {
  return match(coin)({
    Penny: () => {
      console.log('Lucky penny!')
      return 1
    },
    // Nickel: () => 5,
    // Dime: () => 10,
    // Quarter: () => 25,
    _: () => 0,
  })
}
```

## `isVariantOf`

```ts
import { isVariantOf, Enum } from 'that-enum'

const IpAddr = Enum({
  V4: (a: number, b: number, c: number, d: number) => [a, b, c, d] as const,
  V6: (addr: string) => addr,
})

type IpAddr = typeof IpAddr.$type$ // => { type: 'V4', payload: [number, number, number, number] } | { type: 'V6', payload: string }

const addr /*: IpAddr */ = getCurrentAddr()

if (isVariantOf(IpAddr.V4)(addr)) {
  addr // => infer to { type: 'V4', payload: [number, number, number, number] }
} else {
  addr // => infer to { type: 'V6', payload: string }
}
```

## `Option<T>`

```ts
import { Option, Some, None } from 'that-enum'

// type Option<T> = Some<T> | None

it('match', () => {
  const right = 1
  let optionNum /*: Option<number> */ = Some(right) // => { type: 'Some', payload: number }
  let fn = jest.fn()
  match(optionNum)({
    Some(left) {
      fn(left)
    },
    None() {
      fn()
    },
  })
  expect(fn).toBeCalledWith(right)
  expect(fn).toBeCalledTimes(1)

  optionNum /*: Option<number> */ = None() // => { type: 'None'}
  fn = jest.fn()
  match(optionNum)({
    Some(left) {
      fn(left)
    },
    None() {
      fn()
    },
  })
  expect(fn).toBeCalledWith()
  expect(fn).toBeCalledTimes(1)
})


// Explicit type annotation needed for Option<T>

const implicit /*: Option<any> */ = None() // => { type: 'None' }

const explicit /*: Option<number> */ = None<number>() // => { type: 'None' }

const explicit2: Option<number> = None() // => { type: 'None' }

let explicit3 /*: Option<number> */ = Some(0) // => { type: 'None', payload: number }
explicit3 /*: Option<number> */ = None() // => { type: 'None' }
```

# Limitation

that-enum is implemented in userland, not a built-in language feature. So, there are some limitations.

## Recursive Type

```ts
// List implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer ts(7022)
const List = Enum({
  Nil: null,
  Cons: (contains: number, tail: List) => ({ contains, tail }),
})
type List = typeof List.$type$
```

## Generic Type

```ts
const Option = Enum({
  None: null,
  // `T` will be infered as `unkown`
  Some: <T>(value: T) => ({ value }),
})
type Option = typeof Option.$type$
```

### Workaround

`Option<T>` has been supported by `that-enum`.
