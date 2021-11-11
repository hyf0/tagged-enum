import { isVariantOf, Enum } from '..'

describe('isVariantOf', () => {
  let CounterAction = Enum({
    INC: null,
    DEC: null,
    RESET: (resetTo?: number) => resetTo ?? 0,
    FROM_STRING: (input: string) => input,
  })
  beforeEach(() => {
    CounterAction = Enum({
      INC: null,
      DEC: null,
      RESET: (resetTo?: number) => resetTo ?? 0,
      FROM_STRING: (input: string) => input,
    })
  })

  it('should correctly narrow down type', () => {
    const action = CounterAction.RESET(-1)
    if (isVariantOf(CounterAction.RESET)(action)) {
      const resetTo: number = action.payload
      expect(resetTo).toBe(-1);
    }
  })
  it('should correctly narrow down type 2', () => {
    const action = CounterAction.DEC()
    let isRESETAction = false
    if (isVariantOf(CounterAction.RESET)(action)) {
      isRESETAction = true
    }
    expect(isRESETAction).toBe(false)
  })
})
