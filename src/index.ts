
type AnyFn = (...args: any[]) => any;

type MapVariantDescToVariantConsturctor<T> = T extends {
  type: string
  payloadMaker: AnyFn
}
  ? (...params: Parameters<T['payloadMaker']>) => Readonly<{
    type:  T['type']
    payload: ReturnType<T['payloadMaker']>
  }>
  : T extends {
    type: string
    payloadMaker?: undefined
  }
  ? Readonly<{ type: T['type'] }>
  : never

type MapVariantDescToVariant<T> = T extends {
  type: string
  payloadMaker: AnyFn
}
  ? Readonly<{
    type: T['type']
    payload: ReturnType<T['payloadMaker']>
  }>
  : T extends {
    type: string
  }
  ? Readonly<{ type: T['type'] }>
  : never



export function Enum<
  VariantDescList extends VariantDesc[],
  >(...variantDescList: VariantDescList) {
  type VariantDescUnion = VariantDescList[number]
  type VariantUnion = MapVariantDescToVariant<VariantDescUnion>
  type EnumInstance = {
    [K in VariantDescUnion['type']]: MapVariantDescToVariantConsturctor<
      Extract<VariantDescUnion, { type: K }>
    >
  }

  let instance = {} as any
  variantDescList.forEach((v) => {
    const { type, payloadMaker } = v
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


  type Result = EnumInstance & {
    $type$: VariantUnion
  }
  return instance! as Result
}
type GetEnumUnion<
  T extends {
    $type$: any
  },
  > = T['$type$']

type VariantDesc = { type: string, payloadMaker?: AnyFn }

export function Variant<Tag extends string>(type: Tag): { type: Tag }
export function Variant<
  Tag extends string,
  PayloadMaker extends (...args: any) => any,
  >(
    type: Tag,
    payloadMaker: PayloadMaker,
): { type: Tag; payloadMaker: PayloadMaker }
export function Variant(
  type: string,
  payloadMaker?: (...args: any) => any,
): VariantDesc {
  if (payloadMaker) {
    return {
      type: type,
      payloadMaker,
    }
  } else {
    return {
      type: type,
    }
  }
}
