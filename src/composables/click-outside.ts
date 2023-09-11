import type { Fn, Getter, MaybeRefOrGetter, TemplateRef } from '@/types'
import { isIOS, noop } from './helpers'
import { useEventListener } from '@vueuse/core'
import { toValue } from 'vue'

export interface useClickOutsideOptions {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: MaybeRefOrGetter<TemplateRef[]>
  /**
   * Use capturing phase for internal event listener.
   * @default true
   */
  capture?: boolean
}

let _iOSWorkaround = false
const listeners = []

/**
 * Listen for clicks outside of an element.
 */
export function useClickOutsideV2(
  target: TemplateRef,
  handler: (e: PointerEvent | MouseEvent) => void,
  options: useClickOutsideOptions = {}
): Fn {
  const { ignore = [], capture = true } = options

  if (!window) return noop

  // Fixes: https://github.com/vueuse/vueuse/issues/1520
  // How it works: https://stackoverflow.com/a/39712411
  // TODO: consider using the cursor: pointer; hack instead
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true
    Array.from(window.document.body.children).forEach((el) => el.addEventListener('click', noop))
  }

  let shouldListen = true

  const shouldIgnore = (e: PointerEvent | MouseEvent) => {
    return toValue(ignore).some((templateRef) => {
      const el = templateRef.value
      return el && (e.target === el || e.composedPath().includes(el))
    })
  }

  const stop = useEventListener(
    'pointerdown',
    (e: PointerEvent) => {
      const el = target.value
      if (!el || el === e.target || e.composedPath().includes(el)) return

      shouldListen = e.detail === 0 ? !shouldIgnore(e) : shouldListen
      shouldListen && handler(e)
    },
    { passive: true, capture }
  )

  return stop
}
