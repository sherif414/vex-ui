import type { Getter, KeyIntent, NavigationKey, Orientation } from '@/types'
import { useEventListener } from '@vueuse/core'
import { getKeyIntent, isNavigationKey } from './helpers'

type Stop = () => void
type keydownHandler = (e: KeyboardEvent, intent: KeyIntent, key: NavigationKey) => void
type UseKeydownIntentOptions = {
  orientation?: Getter<Orientation>
}

export function useKeydownIntent(
  target: Getter<HTMLElement | null>,
  handler: keydownHandler,
  options: UseKeydownIntentOptions = {}
): Stop {
  return useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    const key = e.key
    if (!isNavigationKey(key)) return

    const intent = getKeyIntent(key, options.orientation?.())
    handler(e, intent, key)
  })
}
