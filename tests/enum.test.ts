import { describe, it, expect } from 'vitest'
import { Enum } from '../src'


describe('Enum', () => {
  let CounterAction = Enum({
    INC: null,
    DEC: null,
    Reset: (resetTo?: number) => resetTo ?? 0,
    FromString: (input: string) => input,
  })
  type CounterAction = typeof CounterAction.$type

  it('should be same reference for Variant has no payload', () => {
    expect(CounterAction.DEC()).toBe(CounterAction.DEC())
    expect(CounterAction.INC()).toBe(CounterAction.INC())
  })
  it('should be different reference for Variant has payload', () => {
    expect(CounterAction.Reset(0)).not.toBe(CounterAction.Reset(0))
  })

  it(`should be freezed for all Variant`, () => {
    const resetAction = CounterAction.Reset(0) as typeof CounterAction.Reset.$type
    expect(Object.isFrozen(resetAction)).toBe(true)
    expect(resetAction.payload).toBe(0)
    
    expect(() => {
      // @ts-expect-error
      resetAction.payload = 99
    }).toThrowError()
    expect(resetAction.type === 'Reset' && resetAction.payload).toBe(0)
  })

  it(`Enum#$type should be undefined`, () => {
    expect(CounterAction.$type).toBe(undefined)
  })

  it(`should throw when received non-valid input `, () => {
    expect(() => {
      Enum({
        // @ts-expect-error
        FOO: '1',
      })
    }).toThrowError()
  })
})