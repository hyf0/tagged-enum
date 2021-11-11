export const isVariantLike = <T extends any>(target: T): target is T & { type: string } => {
  return (
    typeof target === 'object' &&
    target !== null &&
    // @ts-ignore
    typeof target.type === 'string'
  )
}
