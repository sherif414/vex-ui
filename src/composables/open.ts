import type { ComputableSetter, Getter, Signal } from '@/types'
import { useEventListener } from '@vueuse/core'
import { nextTick } from 'vue'
import { useClickOutside, useDelayedOpen } from '.'
import { getKeyIntent } from './helpers'

//----------------------------------------------------------------------------------------------------
// 📌 click open
//----------------------------------------------------------------------------------------------------

interface UseClickOpenOptions {
  toggle?: Getter<boolean>
}

export function useClickOpen(
  trigger: Getter<HTMLElement | null>,
  content: Getter<HTMLElement | null>,
  open: Signal<boolean>,
  options: UseClickOpenOptions = {}
) {
  const { toggle = () => true } = options
  const [isOpen, setOpen] = open

  useEventListener(trigger, 'click', (e) => {
    setOpen(toggle() ? (v) => !v : true)
    if (!isOpen()) return
    e.preventDefault()
    nextTick(() => content()?.focus())
  })

  useClickOutside(content, () => setOpen(false), { ignore: [trigger] })
}

//----------------------------------------------------------------------------------------------------
// 📌 keyboard open
//----------------------------------------------------------------------------------------------------

const NAVIGATION_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'End', 'Home'] as const

type Orientation = 'vertical' | 'horizontal'
type NavigationKeys = 'ArrowDown' | 'ArrowUp' | 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End'

interface UseKeyboardOpenOptions {
  isMainTrigger?: boolean
  orientation?: Getter<Orientation>
}

export function useKeyboardOpen(
  trigger: Getter<HTMLElement | null>,
  content: Getter<HTMLElement | null>,
  setOpen: ComputableSetter<boolean>,
  options: UseKeyboardOpenOptions = {}
) {
  const { isMainTrigger, orientation = () => 'vertical' } = options

  useEventListener(trigger, 'keydown', (e: KeyboardEvent) => {
    const orient = orientation()

    if (isMainTrigger) {
      if (orient === 'vertical' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      if (orient === 'horizontal' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return

      e.preventDefault()
      e.stopPropagation()
      setOpen(true)
      nextTick(() => content()?.focus())
      return
    }

    const key = e.key as NavigationKeys
    if (!NAVIGATION_KEYS.includes(key)) return

    const intent = getKeyIntent(key, orient)
    if (intent !== 'show') return

    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
    nextTick(() => content()?.focus())
  })

  // firefox bug
  useEventListener(trigger, 'keyup', (e: KeyboardEvent) => {
    if (e.key === ' ') e.preventDefault()
  })

  useEventListener(content, 'keydown', (e: KeyboardEvent) => {
    const key = e.key as NavigationKeys
    if (!NAVIGATION_KEYS.includes(key)) return

    const intent = getKeyIntent(key, orientation())

    if (intent === 'hide') {
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
      nextTick(() => trigger()?.focus())
    }
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
  setOpen: ComputableSetter<boolean>,
  options: UsePointerOpenOptions = {}
) {
  const { showDelay = () => 150, hideDelay = () => 150 } = options

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
  useEventListener(content, 'pointerenter', () => {
    trigger()?.classList.add('--focused')
    show()
  })
  useEventListener(content, 'pointerleave', () => {
    trigger()?.classList.remove('--focused')
    hide()
  })
}
