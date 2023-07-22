import type { RefOrGetter } from '@/types'
import type { FocusTrap } from 'focus-trap'
import { createFocusTrap, type Options } from 'focus-trap'
import { type MaybeRefOrGetter, toRef, onScopeDispose, watch } from 'vue'

const trapStack: FocusTrap[] = []

export function useFocusTrap(
  el: MaybeRefOrGetter<HTMLElement | null | undefined>,
  active?: RefOrGetter<boolean> | null,
  options: Options = {}
) {
  const target = toRef(el)
  let trap: FocusTrap | null = null
  const isActive = toRef(active)

  watch(target, create, { flush: 'post', immediate: true })

  watch(isActive, (val) => {
    if (!trap) return
    if (val) trap.active ? trap.pause() : trap.activate()
    else trap.pause()
  })

  function kill() {
    if (trap) {
      trap.deactivate()
      trapStack.splice(trapStack.indexOf(trap), 1)
      trap = null
    }
  }

  function create(el?: HTMLElement | null) {
    if (!el || trap) return
    trap = createFocusTrap(el, { ...options, trapStack })
    isActive.value && trap.activate()
    trapStack.push(trap)
  }

  onScopeDispose(kill)

  return {
    activate: () => create(target.value),
    deactivate: kill,
    pause: () => trap?.pause(),
    resume: () => trap?.unpause(),
  }
}
