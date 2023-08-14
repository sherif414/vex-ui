import type { MaybeGetter, Getter } from '@/types'
import { useEventListener } from '@vueuse/core'
import { toValue } from 'vue'
import { getKeyIntent, wrapArray } from './helpers'

const NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'End', 'Home'] as const

type Orientation = 'vertical' | 'horizontal'
type NavigationKeys = 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End'

interface RovingFocusOptions {
  onEntryFocus?: (e: FocusEvent, focusFirst: (items: HTMLElement[]) => void) => void
  orientation?: MaybeGetter<Orientation>
}

export function useRovingFocus(
  group: Getter<HTMLElement | null>,
  getItems: Getter<HTMLElement[]>,
  options: RovingFocusOptions = {}
) {
  useEventListener(group, 'focus', function onGroupFocus(e: FocusEvent) {
    options.onEntryFocus ? options.onEntryFocus(e, focusFirst) : focusFirst(getItems())
  })

  useEventListener(group, 'keydown', function onGroupKeydown(e: KeyboardEvent) {
    const key = e.key as NavigationKeys
    if (!NAVIGATION_KEYS.includes(key)) return

    e.preventDefault()
    e.stopPropagation()

    let items = getItems().filter((item) => !(item as HTMLButtonElement).disabled)
    const intent = getKeyIntent(key, toValue(options.orientation))

    switch (intent) {
      case 'next': {
        const currFocusedItemIdx = items.indexOf(e.target as HTMLElement)
        items = wrapArray(items, currFocusedItemIdx + 1)
        focusFirst(items)
        break
      }

      case 'prev': {
        items.reverse()
        const currFocusedItemIdx = items.indexOf(e.target as HTMLElement)
        items = wrapArray(items, currFocusedItemIdx + 1)
        focusFirst(items)
        break
      }

      case 'first': {
        focusFirst(items)
        break
      }

      case 'last': {
        focusFirst(items.reverse())
        break
      }
    }
  })
}

function focusFirst(items: HTMLElement[]) {
  for (const item of items) {
    const prevFocusedItem = document.activeElement
    if (item === prevFocusedItem) return
    item.focus()
    if (document.activeElement !== prevFocusedItem) return
  }
}
