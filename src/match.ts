import { isVariantLike } from './helper'

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
  // exhaustive matching
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
    if (!isVariantLike(variant)) {
      if (defaultMatchArm != null) {
        return defaultMatchArm()
      } else {
        // throw when exhaustive checking
        throw new TypeError(`Got non-valid varint ${variant} for exhaustive matching, try using \`_\` to catch invalid varint`)
      }
    }

    let matcherArm = matcher[variant.type]
    if (matcherArm == null) {
      if (defaultMatchArm == null) {
        throw new Error(
          `Doesn't found any match arm for variant ${variant}. Try non-exhaustive matching instead`,
        )
      } else {
        return defaultMatchArm()
      }
    }

    return typeof variant.payload === 'undefined'
      ? matcherArm()
      : matcherArm(variant.payload)
  }
  return matchImpl
}
