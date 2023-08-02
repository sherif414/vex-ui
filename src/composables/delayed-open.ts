import type { MaybeRefOrGetter } from '@/types'
import { tryOnScopeDispose } from '@vueuse/core'
import { toValue } from 'vue'

interface UseDelayedOpenArgs {
  open(): void
  close(): void
  defaultOpenDelay?: MaybeRefOrGetter<number>
  defaultCloseDelay?: MaybeRefOrGetter<number>
}

export function useDelayedOpen(args: UseDelayedOpenArgs) {
  let openTimeoutID: ReturnType<typeof setTimeout> = -1
  let closeTimeoutID: ReturnType<typeof setTimeout> = -1

  const open = (delay?: number) => {
    const _delay = delay ?? toValue(args.defaultOpenDelay) ?? 0
    clearTimeouts()

    if (_delay === 0) {
      args.open()
    } else {
      openTimeoutID = window.setTimeout(args.open, _delay)
    }
  }

  const close = (delay?: number) => {
    const _delay = delay ?? toValue(args.defaultCloseDelay) ?? 0
    clearTimeouts()

    if (_delay === 0) {
      args.close()
    } else {
      closeTimeoutID = window.setTimeout(args.close, _delay)
    }
  }

  const clearTimeouts = () => {
    window.clearTimeout(openTimeoutID)
    window.clearTimeout(closeTimeoutID)
  }

  tryOnScopeDispose(clearTimeouts)

  return { open, close }
}
