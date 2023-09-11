import type { Fn, MaybeRefOrGetter, TemplateRef } from '@/types'
import { remove } from '@/utils'
import {
  EffectScope,
  effectScope,
  isRef,
  onScopeDispose,
  toValue,
  watch,
  type WatchSource,
} from 'vue'
import { isFunction, isIOS, noop } from './helpers'

interface Options {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: MaybeRefOrGetter<TemplateRef[]>
  /**
   * whether the listener is Active, use it to temporarily remove the listener.
   * @defaultValue true
   */
  isActive?: MaybeRefOrGetter<boolean>
}

/**
 * Listen for clicks outside of an element.
 */
export function useClickOutside(
  target: TemplateRef,
  listener: (e: PointerEvent) => void,
  options: Options = {}
): Fn {
  if (!window) return noop

  const { ignore = [], isActive = true } = options
  const initiallyActive = toValue(isActive)
  let isOutside = true

  const shouldIgnore = (e: PointerEvent) => {
    return toValue(ignore).some((templateRef) => {
      const el = templateRef.value
      return el && (e.target === el || e.composedPath().includes(el))
    })
  }

  const onClickOutside = (e: PointerEvent) => {
    const el = target.value
    if (!el || el === e.target || e.composedPath().includes(el)) return

    isOutside = e.detail === 0 ? !shouldIgnore(e) : isOutside
    isOutside && listener(e)
  }

  let cleanup = initiallyActive ? registerListener(onClickOutside) : noop

  if (isWatchSource(isActive)) {
    watch(isActive, (value) => {
      if (value) {
        cleanup = registerListener(onClickOutside)
      } else {
        cleanup()
      }
    })
  }

  onScopeDispose(cleanup)
  return cleanup
}

//----------------------------------------------------------------------------------------------------
// 📌 shared listener
//
// The idea is to have a single shared listener that automatically unregister itself
// when there are no active subscribers, the listener should loop through and run all
// the registered listeners.
//----------------------------------------------------------------------------------------------------

type Listener = (e: PointerEvent) => void

let scope: EffectScope | null
const listeners: Listener[] = []

function registerListener(listener: Listener) {
  listeners.push(listener)

  if (!scope) {
    scope = effectScope(true)
    scope.run(() => {
      useWindowEventListener((e: PointerEvent) => {
        listeners.forEach((listener) => listener(e))
      })
    })
  }

  return () => {
    remove(listeners, listener)
    if (scope && !listeners.length) {
      scope.stop()
      scope = null
    }
  }
}

//----------------------------------------------------------------------------------------------------
// 📌 utils
//----------------------------------------------------------------------------------------------------

function isWatchSource<T>(source: MaybeRefOrGetter<T>): source is WatchSource {
  if (isRef(source) || isFunction(source)) {
    return true
  }
  return false
}

function useWindowEventListener(listener: Listener) {
  useIosWorkaround()

  window.addEventListener('pointerdown', listener, { passive: true, capture: true })
  onScopeDispose(() => {
    window.removeEventListener('pointerdown', listener, { capture: true })
  })
}

// See: https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
let _iOSWorkaround = false
function useIosWorkaround() {
  if (!_iOSWorkaround && isIOS) {
    _iOSWorkaround = true
    Array.from(window.document.body.children).forEach((el) => el.addEventListener('click', noop))
  }
}
