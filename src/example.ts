
import { Enum, Variant } from './index'

const CounterAction = Enum(
  Variant('INC'),
  Variant('DEC'),
  Variant('RESET', (resetTo?: number)=> resetTo ?? 0)
)

type CounterAction = typeof CounterAction.$type$

function reducer(state = { count: 0 }, action: CounterAction) {

  return state
}

let state = { count: 0 }

function dispatch(action: CounterAction) {
  state = reducer(state, action)
}

dispatch(CounterAction.INC)
dispatch(CounterAction.INC)
dispatch(CounterAction.DEC)
state.count === 1
dispatch(CounterAction.RESET(99))
state.count === 99
dispatch(CounterAction.RESET())
state.count === 0