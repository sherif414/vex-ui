import type { Getter, KeyIntent, NavigationKeys, Orientation } from '@/types'
import { useEventListener } from '@vueuse/core'
import { getKeyIntent } from './helpers'

type keydownHandler = (e: KeyboardEvent, intent: KeyIntent, key: NavigationKeys) => void
type Stop = () => void
type UseKeydownIntentOptions = {
  orientation?: Getter<Orientation>
}

const VALID_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'End', 'Home'] as const

export function useKeydownIntent(
  target: Getter<HTMLElement | null>,
  handler: keydownHandler,
  options: UseKeydownIntentOptions = {}
): Stop {
  return useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    const key = e.key as NavigationKeys
    if (!VALID_KEYS.includes(key)) return

    const intent = getKeyIntent(key, options.orientation?.())
    handler(e, intent, key)
  })
}
