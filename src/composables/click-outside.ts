import type { ComputableGetter } from '@/types'
import { isIOS, noop } from './helpers'
import { useEventListener } from '@vueuse/core'

export interface useClickOutsideOptions {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: ComputableGetter<HTMLElement | null>[]
  /**
   * Use capturing phase for internal event listener.
   * @default true
   */
  capture?: boolean
}

let _iOSWorkaround = false

/**
 * Listen for clicks outside of an element.
 *
 * @see https://vueuse.org/onClickOutside
 */
export function useClickOutside(
  target: ComputableGetter<HTMLElement | null>,
  handler: (evt: PointerEvent | MouseEvent) => void,
  options: useClickOutsideOptions = {}
) {
  const { ignore = [], capture = true } = options

  if (!window) return

  // Fixes: https://github.com/vueuse/vueuse/issues/1520
  // How it works: https://stackoverflow.com/a/39712411
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true
    Array.from(window.document.body.children).forEach((el) => el.addEventListener('click', noop))
  }

  let shouldListen = true

  const shouldIgnore = (event: PointerEvent | MouseEvent) => {
    return ignore.some((target) => {
      const el = target()
      return el && (event.target === el || event.composedPath().includes(el))
    })
  }

  const listener = (event: PointerEvent | MouseEvent) => {
    const el = target()
    if (!el || el === event.target || event.composedPath().includes(el)) return
    if (event.detail === 0) shouldListen = !shouldIgnore(event)

    if (!shouldListen) {
      shouldListen = true
      return
    }

    handler(event)
  }

  const cleanup = [
    useEventListener('click', listener, { passive: true, capture }),
    useEventListener(
      'pointerdown',
      (e) => {
        const el = target()
        if (el) shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e)
      },
      { passive: true }
    ),
  ]

  const stop = () => cleanup.forEach((fn) => fn())

  return stop
}
