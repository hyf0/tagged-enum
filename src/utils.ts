
export const isVariantOf =
  <VariantConstructor extends { $type$ : string}>(variantConstructor: VariantConstructor) =>
  <T extends Record<any, any>>(target: T): target is Extract<T, { type: VariantConstructor['$type$'] }> => {
    return variantConstructor.$type$ === target.type
}