# Example

see `src/__test__` or

# usage

## Construct Enum

```ts
const StringOperation = Enum({
  INIT: null,
  CONCAT: (a: string, b: string) => [a, b] as const,
  FROM_NUMBER: (input: number) => input,
})
type StringOperation = typeof StringOperation.$type$

const init = StringOperation.INIT // => { type:INIT }
const concat = StringOperation.CONCAT('hello, ', 'world') // => { type:CONCAT, payload: ['hello, ', 'world'] }
const fromNumber = StringOperation.FROM_NUMBER(0) // => { type:FROM_NUMBER, payload: 0 }
```

## using with switch

```ts
const StringOperation = Enum({
  INIT: null,
  CONCAT: (a: string, b: string) => [a, b] as const,
  FROM_NUMBER: (input: number) => input,
})
type StringOperation = typeof StringOperation.$type$

function reducer(state = {value: ''}, action: StringOperation) {
  switch (action.type) {
    case 'INIT': return {...state, value: 'hello, world'},
    // typescript will infer `action.payload` as [string, string]
    case 'CONCAT': return {...state, value: action.payload[0] + action.payload[1]},
    // typescript will infer `action.payload` as number
    case 'FROM_NUMBER': return {...state, value: String(action.payload)},
  }
}
```

## using with `match`

```ts
const StringOperation = Enum({
  INIT: null,
  CONCAT: (a: string, b: string) => [a, b] as const,
  FROM_NUMBER: (input: number) => input,
})
type StringOperation = typeof StringOperation.$type$

function reducer(state = {value: ''}, action: StringOperation) {
  return match(action)({
    INIT: () => ({...state, value: 'hello, world'}),
    CONCAT: ([a, b]) => ({...state, value: a + b}),
    FROM_NUMBER: (input) => ({...state, value: String(input)}),
  })
}
```

## exhaustive matching

```ts
// exhaustive
const StringOperation = Enum({
  INIT: null,
  CONCAT: (a: string, b: string) => [a, b] as const,
  FROM_NUMBER: (input: number) => input,
})
type StringOperation = typeof StringOperation.$type$

// @ts-expect-error
let str = match(StringOperation.INIT as StringOperation)({ // => compiling error occurs
  INIT: () => 'hello',
})

// no compiling error occurs
str = match(StringOperation.INIT as StringOperation)({ // => 'default'
  INIT: () => 'hello',
  CONCAT: ([a, b]) => a + b,
  FROM_NUMBER: (input) => String(input)
})
```

## non-exhaustive matching

```ts
const StringOperation = Enum({
  INIT: null,
  CONCAT: (a: string, b: string) => [a, b] as const,
  FROM_NUMBER: (input: number) => input,
})
type StringOperation = typeof StringOperation.$type$

// no compiling error occurs
let str = match(StringOperation.INIT as StringOperation)({ // => 'hello'
  INIT: () => 'hello',
  _: () => '',
})

// no compiling error occurs
str = match(StringOperation.INIT as StringOperation)({ // => 'default'
  // INIT: () => 'hello',
  _: () => 'default',
})
```
