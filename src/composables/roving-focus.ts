import type { Getter, Orientation } from '@/types'
import { useEventListener } from '@vueuse/core'
import { wrapArray } from './helpers'
import { useKeydownIntent } from './keydown'

interface RovingFocusOptions {
  onEntryFocus?: (e: FocusEvent, focusFirst: (items: HTMLElement[]) => void) => void
  orientation?: Getter<Orientation>
}

export function useRovingFocus(
  group: Getter<HTMLElement | null>,
  getItems: Getter<HTMLElement[]>,
  options: RovingFocusOptions = {}
) {
  const { orientation, onEntryFocus } = options

  useEventListener(group, 'focus', function onGroupFocus(e: FocusEvent) {
    onEntryFocus ? onEntryFocus(e, focusFirst) : focusFirst(getItems())
  })

  useKeydownIntent(
    group,
    function onGroupKeydown(e, intent) {
      e.preventDefault()
      e.stopPropagation()

      let items = getItems().filter((item) => !(item as HTMLButtonElement).disabled)

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
    },
    { orientation }
  )
}

function focusFirst(items: HTMLElement[]) {
  for (const item of items) {
    const prevFocusedItem = document.activeElement
    if (item === prevFocusedItem) return
    item.focus()
    if (document.activeElement !== prevFocusedItem) return
  }
}
