import { isUndefined, isValidVariant } from './helper'

type AnyVariant = {
  type: string
  payload?: any
}
type AnyFn = (...args: any[]) => any

type MapVariantToMatcher<T extends AnyVariant, ReturnValue> = {
  [K in T['type']]: Extract<T, { type: K }> extends { payload: any }
    ? (payload: Extract<T, { type: K }>['payload']) => ReturnValue
    : () => ReturnValue
}

export function match<Variant extends AnyVariant>(variant: Variant) {
  function matchImpl<ReturnValue>(
    matcher: Partial<MapVariantToMatcher<Variant, ReturnValue>> & {
      _: () => ReturnValue
    },
  ): ReturnValue
  function matchImpl<ReturnValue>(
    matcher: MapVariantToMatcher<Variant, ReturnValue>,
  ): ReturnValue
  function matchImpl(matcher: Record<string, AnyFn | undefined>) {
    let defaultMatchArm = matcher['_']
    if (!isValidVariant(variant)) {
      if (defaultMatchArm) {
        // TODO: should we call defaultMatchArm for non-valid input for non-exhaustive matching?
        // defaultMatchArm()
        throw new TypeError(`Got non-valid varint ${variant}`)
      } else {
        // throw when exhaustive checking
        throw new TypeError(`Got non-valid varint ${variant}`)
        // throw new TypeError(`Got non-valid varint ${variant} for exhaustive matching, try non-exhaustive matching instead`)
      }
    }

    let matcherArm = matcher[variant.type]
    if (isUndefined(matcherArm)) {
      if (isUndefined(defaultMatchArm)) {
        throw new Error(
          `Doesn't found any match arm for variant ${variant}. Try non-exhaustive matching instead`,
        )
      } else {
        return defaultMatchArm()
      }
    }

    return isUndefined(variant.payload)
      ? matcherArm()
      : matcherArm(variant.payload)
  }
  return matchImpl
}
