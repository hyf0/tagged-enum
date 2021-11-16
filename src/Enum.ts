import { EnumInstanceBase } from "./shared"

type AnyFn = (...args: any[]) => any
type VariantFactory = AnyFn

export type VariantNameMark = '$type$'

type VariantConsturctorFromInput<
  VariantName extends string,
  VariantInfo extends { [key: string]: VariantFactory | null },
> = VariantInfo[VariantName] extends VariantFactory
  ? {
      (
        ...params: Parameters<VariantInfo[VariantName]>
      ): VariantUnionFromInput<VariantInfo>
      $type$: VariantName
    }
  : {
    (): VariantUnionFromInput<VariantInfo>
    $type$: VariantName
  }

type VariantFromInput<VariantName, VariantConstructor> =
  VariantConstructor extends VariantFactory
    ? Readonly<{
        type: VariantName
        payload: ReturnType<VariantConstructor>
      }>
    : VariantConstructor extends null
    ? Readonly<{ type: VariantName }>
    : never

type VariantUnionFromInput<VariantInput> = {
  [VariantName in keyof VariantInput]: VariantFromInput<
    VariantName,
    VariantInput[VariantName]
  >
}[keyof VariantInput]

export function Enum<
  VariantInput extends {
    [key: string]: null | AnyFn
  },
>(variantInput: VariantInput) {
  type VariantUnion = VariantUnionFromInput<VariantInput>
  type EnumInstance = {
    [VariantName in keyof VariantInput]: VariantConsturctorFromInput<
      VariantName & string,
      VariantInput
    >
  }

  const instance = Object.create(EnumInstanceBase)
  for (let variantName in variantInput) {
    const variantConstructor = variantInput[variantName]
    if (typeof variantConstructor === 'function') {
      instance[variantName] = (...args: any[]) => {
        return Object.freeze({
          type: variantName,
          payload: variantConstructor(...args),
        })
      }
    } else if (variantConstructor === null) {
      const variant = Object.freeze({
        type: variantName,
      })
      instance[variantName] = () => variant
    } else {
      throw new TypeError(
        `Expect \`null\` | \`function\` but got ${typeof variantConstructor}`,
      )
    }
  }

  type Result = EnumInstance & {
    $type$: VariantUnion
  }
  return instance as Result
}
