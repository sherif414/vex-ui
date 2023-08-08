import type { ComputedSet, Getter, Signal } from '@/types'
import { useEventListener } from '@vueuse/core'
import { nextTick } from 'vue'
import { useClickOutside, useDelayedOpen } from '.'

//----------------------------------------------------------------------------------------------------
// 📌 click open
//----------------------------------------------------------------------------------------------------

export function useClickOpen(
  trigger: Getter<HTMLElement | null>,
  content: Getter<HTMLElement | null>,
  visibility: Signal<boolean>
) {
  const [isOpen, setOpen] = visibility

  useEventListener(trigger, 'click', () => {
    setOpen((v) => !v)
    if (!isOpen()) return
    nextTick(() => content()?.focus())
  })

  useClickOutside(content, () => setOpen(false), { ignore: [trigger] })
}

//----------------------------------------------------------------------------------------------------
// 📌 keyboard open
//----------------------------------------------------------------------------------------------------

export function useKeyboardOpen(
  trigger: Getter<HTMLElement | null>,
  content: Getter<HTMLElement | null>,
  setOpen: ComputedSet<boolean>
) {
  useEventListener(trigger, 'keydown', (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', ' ', 'Enter'].includes(e.key)) {
      e.preventDefault()
      setOpen(true)
      nextTick(() => content()?.focus())
    }
  })

  useEventListener(content, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  })

  // firefox bug
  useEventListener(trigger, 'keyup', (e: KeyboardEvent) => {
    if (e.key === ' ') e.preventDefault()
  })
}

//----------------------------------------------------------------------------------------------------
// 📌 pointer open
//----------------------------------------------------------------------------------------------------

interface UsePointerOpenOptions {
  showDelay?: Getter<number>
  hideDelay?: Getter<number>
}

export function usePointerOpen(
  trigger: Getter<HTMLElement | null>,
  content: Getter<HTMLElement | null>,
  setOpen: ComputedSet<boolean>,
  options: UsePointerOpenOptions = {}
) {
  const { showDelay = () => 100, hideDelay = () => 100 } = options

  const { show, hide } = useDelayedOpen(
    () => setOpen(true),
    () => setOpen(false),
    {
      defaultShowDelay: showDelay,
      defaultHideDelay: hideDelay,
    }
  )

  useEventListener(trigger, 'pointerenter', () => show())
  useEventListener(trigger, 'pointerleave', () => hide())
  useEventListener(content, 'pointerenter', () => show())
  useEventListener(content, 'pointerleave', () => hide())
}
