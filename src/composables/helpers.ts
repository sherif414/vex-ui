export const isString = (value: unknown): value is string => typeof value === 'string'

export function getRandomString(length: number): string {
  let result = ''
  while (result.length < length) {
    const randomSubstring = Math.random().toString(36).substring(2)
    result += randomSubstring.slice(0, length - result.length)
  }
  return result
}
