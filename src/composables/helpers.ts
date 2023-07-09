export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return true

  return Array.isArray(value) && value.length === 0
}

export const isNullOrUndefined = (value: unknown): value is undefined | null => {
  return value === null || value === undefined
}

export const isEmptyArray = (arr: unknown): boolean => {
  return Array.isArray(arr) && arr.length === 0
}

export const isObject = (obj: unknown): obj is Record<string, unknown> =>
  obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj)

export const isNumeric = (value: unknown): value is number =>
  (typeof value === 'string' || typeof value === 'number') &&
  value !== '' &&
  !isNaN(Number(value))

export const isString = (value: unknown): value is string => typeof value === 'string'

export function getRandomString(length: number): string {
  let result = ''
  while (result.length < length) {
    const randomSubstring = Math.random().toString(36).substring(2)
    result += randomSubstring.slice(0, length - result.length)
  }
  return result
}
