type Some<T> = Readonly<{
  type: 'Some'
  payload: T
}>

type None = {
  type: 'None'
}

type Option<T> = Some<T> | None

const none: None = Object.freeze({
  type: 'None',
})

const Some: {
  <T>(payload: T): Option<T>
  $type$: 'Some'
} = (payload) =>
  Object.freeze({
    type: 'Some',
    payload,
  })
Some.$type$ = 'Some'

const None: {
  <T = any>(): Option<T>
  $type$: 'None'
} = () => none

None.$type$ = 'None'

export { Option, Some, None }
