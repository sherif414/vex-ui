import type { MaybeRefOrGetter } from '@/types'
import { tryOnScopeDispose } from '@vueuse/core'
import { toValue } from 'vue'

interface UseDelayedOpenOptions {
  open(): void
  close(): void
  defaultOpenDelay?: MaybeRefOrGetter<number>
  defaultCloseDelay?: MaybeRefOrGetter<number>
}

export function useDelayedOpen(options: UseDelayedOpenOptions) {
  let openTimeoutID: ReturnType<typeof setTimeout> = -1
  let closeTimeoutID: ReturnType<typeof setTimeout> = -1

  const open = (delay?: number) => {
    const _delay = delay ?? toValue(options.defaultOpenDelay) ?? 0
    clearTimeouts()

    if (_delay === 0) {
      options.open()
    } else {
      openTimeoutID = window.setTimeout(options.open, _delay)
    }
  }

  const close = (delay?: number) => {
    const _delay = delay ?? toValue(options.defaultCloseDelay) ?? 0
    clearTimeouts()

    if (_delay === 0) {
      options.close()
    } else {
      closeTimeoutID = window.setTimeout(options.close, _delay)
    }
  }

  const clearTimeouts = () => {
    window.clearTimeout(openTimeoutID)
    window.clearTimeout(closeTimeoutID)
  }

  tryOnScopeDispose(clearTimeouts)

  return { open, close }
}
