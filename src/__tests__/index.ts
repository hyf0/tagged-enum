import { Enum } from '..'


describe('example', () => {
  test('redux-like', () => {
    const CounterAction = Enum({
      INC: null,
      DEC: null,
      RESET: (resetTo?: number)=> resetTo ?? 0,
    })

    type CounterAction = typeof CounterAction.$type$
    
    function reducer(state = { count: 0 }, action: CounterAction) {
      switch(action.type) {
        case 'INC': return { ...state, count: state.count += 1  }
        case 'DEC': return { ...state, count: state.count -= 1  }
        case 'RESET': return { ...state, count: action.payload   }
        default: return state
      }
      return state
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
  })
})