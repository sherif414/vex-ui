import type { Fn, Getter } from '@/types'
import { tryOnScopeDispose } from '@vueuse/core'

interface UseDelayedOpenOptions {
  defaultShowDelay?: Getter<number | undefined>
  defaultHideDelay?: Getter<number | undefined>
}

export function useDelayedOpen(show: Fn, hide: Fn, options: UseDelayedOpenOptions) {
  let showTimeoutID: ReturnType<typeof setTimeout> = -1
  let hideTimeoutID: ReturnType<typeof setTimeout> = -1

  const _show = (delay?: number) => {
    clearTimeouts()
    const _delay = delay ?? options.defaultShowDelay?.() ?? 0

    if (_delay === 0) {
      show()
    } else {
      showTimeoutID = setTimeout(show, _delay)
    }
  }

  const _hide = (delay?: number) => {
    clearTimeouts()
    const _delay = delay ?? options.defaultHideDelay?.() ?? 0

    if (_delay === 0) {
      hide()
    } else {
      hideTimeoutID = setTimeout(hide, _delay)
    }
  }

  const clearTimeouts = () => {
    clearTimeout(showTimeoutID)
    clearTimeout(hideTimeoutID)
  }

  tryOnScopeDispose(clearTimeouts)

  return { show: _show, hide: _hide }
}
