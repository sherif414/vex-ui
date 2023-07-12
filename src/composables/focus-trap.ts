import type { FocusTrap } from 'focus-trap'
import { createFocusTrap, type Options } from 'focus-trap'
import { type MaybeRefOrGetter, watchEffect, toRef, onUnmounted } from 'vue'

export function useFocusTrap(
  el: MaybeRefOrGetter<HTMLElement | null | undefined>,
  active?: MaybeRefOrGetter<boolean>,
  options: Options = {}
): {
  activate: () => void
  deactivate: () => void
  pause: () => void
  resume: () => void
} {
  const target = toRef(el)
  const isActive = active === undefined ? null : toRef(active)
  let trap: FocusTrap | null = null

  watchEffect(() => {
    if (target.value) {
      trap = createFocusTrap(target.value, options)
    }
  })

  // implicitly switch to manual mode if no `active` arg was passed
  if (isActive) {
    watchEffect(() => {
      isActive.value ? trap?.activate() : trap?.deactivate()
    })
  }

  onUnmounted(() => {
    trap?.deactivate()
    trap = null
  })

  return {
    activate() {
      trap?.activate()
    },
    deactivate() {
      trap?.deactivate()
    },
    pause() {
      trap?.pause()
    },
    resume() {
      trap?.unpause()
    },
  }
}
