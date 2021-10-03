import { Enum, Variant } from '..'


describe('Enum', () => {
  let CounterAction = Enum(
    Variant('INC'),
    Variant('DEC'),
    Variant('RESET', (resetTo?: number)=> resetTo ?? 0)
  )
  beforeEach(() => {
    CounterAction = Enum(
      Variant('INC'),
      Variant('DEC'),
      Variant('RESET', (resetTo?: number)=> resetTo ?? 0)
    )
  })

  it('should be same reference for Variant has no payload', () => {
    expect(CounterAction.DEC).toBe(CounterAction.DEC)
    expect(CounterAction.INC).toBe(CounterAction.INC)
  })

  it('should be different reference for Variant has payload', () => {
    expect(CounterAction.RESET(0)).not.toBe(CounterAction.RESET(0))
  })

  it(`should be freezed for all Variant`, () => {
    const resetAction = CounterAction.RESET(0);
    expect(() => {
      // @ts-expect-error
      resetAction.payload = 99
    }).toThrowError()
    expect(resetAction.payload).toBe(0)
  })
})

