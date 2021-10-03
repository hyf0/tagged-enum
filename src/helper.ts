export const isUndefined = (target: unknown): target is undefined =>
  typeof target === 'undefined'

export const isValidVariant = (target: Record<string, any>): boolean => {
  return (
    typeof target === 'object' &&
    target !== null &&
    typeof target.type === 'string'
  )
}
