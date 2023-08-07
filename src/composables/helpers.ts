import { EXPOSED_EL } from '@/config'
import type { ComponentPublicInstance } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 validators
//----------------------------------------------------------------------------------------------------

export const isClient = typeof window !== 'undefined'
export const isString = (value: unknown): value is string => typeof value === 'string'
export const isFunction = (value: unknown): value is Function => value instanceof Function
export const isIOS = /*#__PURE__*/ getIsIOS()

//----------------------------------------------------------------------------------------------------
// 📌 getters
//----------------------------------------------------------------------------------------------------

export function getIsIOS() {
  return (
    isClient &&
    /*#__PURE__*/ window?.navigator?.userAgent &&
    /*#__PURE__*/ /iP(ad|hone|od)/.test(/*#__PURE__*/ window.navigator.userAgent)
  )
}

export function getRandomString(length: number): string {
  let result = ''
  while (result.length < length) {
    const randomSubstring = Math.random().toString(36).substring(2)
    result += randomSubstring.slice(0, length - result.length)
  }
  return result
}

export function getElementFromRef(
  vm: ComponentPublicInstance | Element | null,
  component: string
): HTMLElement | null {
  if (vm == null) return null
  if (vm instanceof Element) return vm as HTMLElement
  if (EXPOSED_EL in vm && vm[EXPOSED_EL] instanceof Element) return vm[EXPOSED_EL] as HTMLElement
  if (vm.$el instanceof Element) return vm.$el as HTMLElement

  throw new Error(`[vex] <${component}> has a non Element root child`)
}

//----------------------------------------------------------------------------------------------------
// 📌 specials
//----------------------------------------------------------------------------------------------------

export const noop = () => {}
