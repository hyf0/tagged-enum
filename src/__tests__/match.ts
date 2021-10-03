import { Enum } from '..'
import { match } from '../match'

describe('match', () => {
  let CounterAction = Enum({
    INC: null,
    DEC: null,
    RESET: (resetTo?: number) => resetTo ?? 0,
    FROM_STRING: (input: string) => input,
  })
  type CounterAction = typeof CounterAction.$type$
  beforeEach(() => {
    CounterAction = Enum({
      INC: null,
      DEC: null,
      RESET: (resetTo?: number) => resetTo ?? 0,
      FROM_STRING: (input: string) => input,
    })
  })
  describe('example', () => {
    it('redux-like', () => {
      function reducer(state = { count: 0 }, action: CounterAction) {
        return match(action)({
          INC: () => ({ ...state, count: (state.count += 1) }),
          DEC: () => ({ ...state, count: (state.count -= 1) }),
          RESET: (payload) => ({ ...state, count: payload }),
          FROM_STRING: (payload) => ({
            ...state,
            count: parseInt(payload) || 0,
          }),
        })
      }

      let state = { count: 0 }

      function dispatch(action: CounterAction) {
        state = reducer(state, action)
      }

      dispatch(CounterAction.INC)
      dispatch(CounterAction.INC)
      dispatch(CounterAction.DEC)
      expect(state.count).toBe(1)

      dispatch(CounterAction.RESET(99))
      expect(state.count).toBe(99)

      dispatch(CounterAction.RESET())
      expect(state.count).toBe(0)

      dispatch(CounterAction.FROM_STRING('99'))
      expect(state.count).toBe(99)
    })
  })

  describe('exhaustive checking', () => {
    it('should throw error for non-valid input', () => {
      expect(() => {
        match({} as CounterAction)({
          INC: () => ({}),
          DEC: () => ({}),
          RESET: (payload) => ({}),
          FROM_STRING: (payload) => ({}),
        })
      }).toThrowError()
    })
    it('should throw error for non-exist match arm', () => {
      expect(() => {
        // @ts-expect-error
        match(CounterAction.INC as CounterAction)({
          // INC: () => ({ ...state, count: state.count += 1  }),
          DEC: () => ({}),
          RESET: (payload) => ({}),
          FROM_STRING: (payload) => ({}),
        })
      }).toThrowError()
    })
  })

  describe('non-exhaustive', () => {
    it('should throw error for non-valid input', () => {
      expect(() => {
        match({} as CounterAction)({
          // INC: () => ({}),
          DEC: () => ({}),
          RESET: (payload) => ({}),
          FROM_STRING: (payload) => ({}),
          _: () => ({})
        })
      }).toThrowError()
    })
    it('should fallback to default match arm for non-exist match arm', () => {
      expect(
        match(CounterAction.INC as CounterAction)({
          // INC: () => ({ ...state, count: state.count += 1  }),
          DEC: () => 0,
          RESET: (_payload) => 0,
          FROM_STRING: (_payload) => 0,
          _: () => 1,
        }),
      ).toBe(1)
    })
    it('should not fallback to default match arm for exist match arm', () => {
      expect(
        match(CounterAction.DEC as CounterAction)({
          // INC: () => ({ ...state, count: state.count += 1  }),
          DEC: () => -1,
          RESET: (_payload) => 0,
          FROM_STRING: (_payload) => 0,
          _: () => 1,
        }),
      ).toBe(-1)
    })
  })
})
