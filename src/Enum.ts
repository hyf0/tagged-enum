type AnyFn = (...args: any[]) => any

type MapVariantDescItemToVariantConsturctor<T, P, VariantDesc> = P extends AnyFn
  ? (...params: Parameters<P>) => MapVariantDescToVarianUnion<VariantDesc>
  : P extends null
  ? MapVariantDescToVarianUnion<VariantDesc>
  : never

type MapVariantDescItemToVariant<T, P> = P extends AnyFn
  ? Readonly<{
      type: T
      payload: ReturnType<P>
    }>
  : P extends null
  ? Readonly<{ type: T }>
  : never

type MapVariantDescToVarianUnion<VariantDesc> = {
  [K in keyof VariantDesc]: MapVariantDescItemToVariant<K, VariantDesc[K]>
}[keyof VariantDesc]

export function Enum<
  VariantDesc extends {
    [key: string]: null | AnyFn
  },
>(variantDesc: VariantDesc) {
  type VariantUnion = MapVariantDescToVarianUnion<VariantDesc>
  type EnumInstance = {
    [K in keyof VariantDesc]: MapVariantDescItemToVariantConsturctor<
      K,
      VariantDesc[K],
      VariantDesc
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
