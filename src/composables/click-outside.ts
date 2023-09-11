import type { Fn, Getter } from '@/types'
import { isIOS, noop } from './helpers'
import { useEventListener } from '@vueuse/core'

export interface useClickOutsideOptions {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: Getter<Getter<HTMLElement | null>[]>
  /**
   * Use capturing phase for internal event listener.
   * @default true
   */
  capture?: boolean
}

let _iOSWorkaround = false

/**
 * Listen for clicks outside of an element.
 */
export function useClickOutside(
  target: Getter<HTMLElement | null>,
  handler: (e: PointerEvent | MouseEvent) => void,
  options: useClickOutsideOptions = {}
): Fn {
  const { ignore = () => [], capture = true } = options

  if (!window) return noop

  // Fixes: https://github.com/vueuse/vueuse/issues/1520
  // How it works: https://stackoverflow.com/a/39712411
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true
    Array.from(window.document.body.children).forEach((el) => el.addEventListener('click', noop))
  }

  let shouldListen = true

  const shouldIgnore = (e: PointerEvent | MouseEvent) => {
    return ignore().some((getElement) => {
      const el = getElement()
      return el && (e.target === el || e.composedPath().includes(el))
    })
  }

  const stop = useEventListener(
    'pointerdown',
    (e: PointerEvent) => {
      const el = target()
      if (!el || el === e.target || e.composedPath().includes(el)) return

      shouldListen = e.detail === 0 ? !shouldIgnore(e) : shouldListen
      shouldListen && handler(e)
    },
    { passive: true, capture }
  )

  return stop
}
