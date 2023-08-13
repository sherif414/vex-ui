import type { Getter, KeyIntent, NavigationKeys } from '@/types'
import { useEventListener } from '@vueuse/core'
import { getKeyIntent } from './helpers'

type keydownHandler = (e: KeyboardEvent, intent: KeyIntent, key: NavigationKeys) => void
const VALID_KEYS = [
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'End',
  'Home',
  'Enter',
  ' ',
  'Escape',
] as const

export function useKeydownIntent(target: Getter<HTMLElement | null>, cb: keydownHandler) {
  useEventListener(target, 'keydown', (e: KeyboardEvent) => {
    const key = e.key as NavigationKeys
    if (!VALID_KEYS.includes(key)) return

    const intent = getKeyIntent(key)
    cb(e, intent, key)
  })
}
