import type { RefOrGetter } from '@/types'
import type { FocusTrap } from 'focus-trap'
import { createFocusTrap, type Options } from 'focus-trap'
import { type MaybeRefOrGetter, watchEffect, toRef, onScopeDispose, watch } from 'vue'

const trapStack: FocusTrap[] = []

export function useFocusTrap(
  el: MaybeRefOrGetter<HTMLElement | null | undefined>,
  active?: RefOrGetter<boolean> | null,
  options: Options = {}
) {
  const target = toRef(el)
  let trap: FocusTrap | null = null
  const isActive = toRef(active)

  watchEffect(() => {
    if (target.value) {
      trap = createFocusTrap(target.value, options)
      isActive.value && trap.activate()
      trapStack.push(trap)
    }
  })

  // implicitly switch to manual mode if no `active` arg was passed
  watch(isActive, (val) => {
    if (val) trap?.activate()
    else trap?.deactivate()
  })

  onScopeDispose(() => {
    if (trap) {
      trap.deactivate()
      trapStack.splice(trapStack.indexOf(trap), 1)
      trap = null
    }
  })

  return {
    activate() {
      trap?.activate()
    },
    deactivate() {
      if (trap) {
        trap?.deactivate()
        trapStack.splice(trapStack.indexOf(trap), 1)
      }
    },
    pause() {
      trap?.pause()
    },
    resume() {
      trap?.unpause()
    },
  }
}
