import type { Getter, Signal } from '@/types'
import { useEventListener } from '@vueuse/core'
import { watch } from 'vue'

export function useListHighlight(
  list: Getter<HTMLElement | null>,
  highlight: Signal<number>,
  items: Set<HTMLElement>
) {
  const [highlighted, setHighlighted] = highlight

  watch(highlighted, setHighlightClass, { flush: 'sync' })

  function setHighlightClass(curr: number, prev: number) {
    const _items = [...items]
    _items[prev]?.classList.remove('--highlighted')
    _items[curr]?.classList.add('--highlighted')
  }

  useEventListener(list, 'keydown', highlightOnKeydown)

  function highlightOnKeydown(e: KeyboardEvent) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return

    const last = items.size - 1
    e.preventDefault()
    e.stopPropagation()

    switch (e.key) {
      case 'ArrowDown':
        setHighlighted((v) => (v >= last ? 0 : v + 1))
        break

      case 'ArrowUp':
        setHighlighted((v) => (v <= 0 ? last : v - 1))
        break

      case 'Home':
        setHighlighted(0)
        break

      case 'End':
        setHighlighted(last)
        break
    }
  }
}
