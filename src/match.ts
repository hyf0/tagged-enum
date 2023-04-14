import { AnyFn } from "./shared";

type VariantBase = {
  type: string;
  payload?: any;
};

type ExtractReturnValueOfMatcher<Matcher extends Record<string, AnyFn>> = {
  [Key in keyof Matcher]: ReturnType<Matcher[Key]>;
}[keyof Matcher];


type CreateExhaustiveMatcherFromVariantUnion<Variant extends VariantBase, ReturnValue> = {
  [K in Variant["type"]]: Extract<Variant, { type: K }> extends { payload: any }
    ? (payload: Extract<Variant, { type: K }>["payload"]) => ReturnValue
    : () => ReturnValue;
};

type CreateNonExhaustiveMatcherFromVariantUnion<Variant extends VariantBase, ReturnValue> = Partial<CreateExhaustiveMatcherFromVariantUnion<Variant, ReturnValue>> & {
    _: (payload: unknown) => ReturnValue
}

export function match<
  Variant extends VariantBase,
  Matcher extends CreateExhaustiveMatcherFromVariantUnion<Variant, any>
>(
  variant: Variant,
  matcher: Matcher
): ExtractReturnValueOfMatcher<typeof matcher>
export function match<
  Variant extends VariantBase,
  Matcher extends  CreateNonExhaustiveMatcherFromVariantUnion<Variant, any>,
>(
  variant: Variant,
  matcher: Matcher
): ExtractReturnValueOfMatcher<typeof matcher>
export function match(variant: VariantBase, matcher: Record<string, AnyFn>): unknown {
  const defaultArm = matcher["_"];
  const matchedArm = matcher[variant.type];
  if (matchedArm == null) {
    if (defaultArm != null) {
      return defaultArm(variant.payload);
    } else {
      throw new TypeError(`No match arm for variant ${variant}.`);
    }
  } else {
    return matchedArm(variant.payload);
  }
}