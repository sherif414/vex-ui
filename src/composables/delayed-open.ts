import type { MaybeRefOrGetter } from '@/types'
import { tryOnScopeDispose } from '@vueuse/core'
import { toValue } from 'vue'

interface UseDelayedOpenOptions {
  open(): void
  close(): void
  openDelay: MaybeRefOrGetter<number>
  closeDelay: MaybeRefOrGetter<number>
}

export function useDelayedOpen(opt: UseDelayedOpenOptions) {
  let openTimeoutID: ReturnType<typeof setTimeout> = -1
  let closeTimeoutID: ReturnType<typeof setTimeout> = -1

  const open = () => {
    clearTimeouts()
    const delay = toValue(opt.openDelay)

    if (delay === 0) {
      opt.open()
    } else {
      openTimeoutID = window.setTimeout(opt.open, delay)
    }
  }

  const close = () => {
    clearTimeouts()
    const delay = toValue(opt.closeDelay)

    if (delay === 0) {
      opt.close()
    } else {
      closeTimeoutID = window.setTimeout(opt.close, delay)
    }
  }

  const clearTimeouts = () => {
    window.clearTimeout(openTimeoutID)
    window.clearTimeout(closeTimeoutID)
  }

  tryOnScopeDispose(clearTimeouts)

  return { open, close }
}
