export const EnumInstanceBase = Object.freeze({
  get $type$() {
    throw new TypeError(
      'Enum#$type$ is only exist in type space. Do not visit it on runtime.',
    )
  },
})