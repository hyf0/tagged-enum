export { match } from './match'

type AnyFn = (...args: any[]) => any

type MapVariantDescToVariantConsturctor<T, P> = P extends AnyFn
  ? (...params: Parameters<P>) => Readonly<{
      type: T
      payload: ReturnType<P>
    }>
  : P extends null
  ? Readonly<{ type: T }>
  : never

type MapVariantDescToVariant<T, P> = P extends AnyFn
  ? Readonly<{
      type: T
      payload: ReturnType<P>
    }>
  : P extends null
  ? Readonly<{ type: T }>
  : never

type MapVariantDescToVarianUnion<T> = {
  [K in keyof T]: MapVariantDescToVariant<K, T[K]>
}[keyof T]

export function Enum<
  VariantDesc extends {
    [key: string]: null | AnyFn
  },
>(variantDesc: VariantDesc) {
  type VariantUnion = MapVariantDescToVarianUnion<VariantDesc>
  type EnumInstance = {
    [K in keyof VariantDesc]: MapVariantDescToVariantConsturctor<
      K,
      VariantDesc[K]
    >
  }

  let instance = {} as any
  Object.entries(variantDesc).forEach(([type, payloadMaker]) => {
    if (payloadMaker) {
      instance[type] = (...args: any[]) => {
        return Object.freeze({
          type,
          payload: payloadMaker(...args),
        })
      }
    } else {
      instance[type] = Object.freeze({
        type,
      })
    }
  })

  Object.defineProperties(instance, {
    $type$: {
      get() {
        throw new TypeError(
          'Enum#$type$ is only exist in type space. Do not visit it on runtime.',
        )
      },
    },
  })

  type Result = EnumInstance & {
    $type$: VariantUnion
  }
  return instance! as Result
}
