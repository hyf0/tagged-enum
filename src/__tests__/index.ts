import { Enum, match } from '..'

describe('example', () => {
  test('redux-like', () => {
    // non-exhaustive
    

    // non-exhaustive
    const StringOperation = Enum({
      INIT: null,
      CONCAT: (a: string, b: string) => [a, b] as const,
      FROM_NUMBER: (input: number) => input,
    })
    type StringOperation = typeof StringOperation.$type$
    let str = match(StringOperation.INIT as StringOperation)({ // => 'hello'
      INIT: () => 'hello',
      _: () => '',
    })
    str = match(StringOperation.INIT as StringOperation)({ // => 'default'
      // INIT: () => 'hello',
      _: () => 'default',
    })
  })

  test('redux-like', () => {
    // exhaustive
    const StringOperation = Enum({
      INIT: null,
      CONCAT: (a: string, b: string) => [a, b] as const,
      FROM_NUMBER: (input: number) => input,
    })
    type StringOperation = typeof StringOperation.$type$
    // compiling error occurs
    // @ts-expect-error
    let str = match(StringOperation.INIT as StringOperation)({ // => 'hello'
      INIT: () => 'hello',
    })

    str = match(StringOperation.INIT as StringOperation)({ // => 'default'
      INIT: () => 'hello',
      CONCAT: ([a, b]) => a + b,
      FROM_NUMBER: (input) => String(input)
    })
  })
})
