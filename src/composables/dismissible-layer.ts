import { useFocusTrap, useRemoveBodyScroll } from '@/composables'
import { onClickOutside, useEventListener } from '@vueuse/core'
import type { Options } from 'focus-trap'
import type { Ref } from 'vue'
import { computed, onBeforeUnmount, shallowReactive, watch } from 'vue'

export type Layer = Ref<HTMLElement | null | undefined>
export const layers = shallowReactive(new Set<Layer>())
const bodyScroll = useRemoveBodyScroll()

watch(
  layers,
  () => {
    if (layers.size === 0) {
      document.body.style.pointerEvents = ''
      bodyScroll.unRemove()
      return
    }
    if (layers.size === 1) {
      document.body.style.pointerEvents = 'none'
      bodyScroll.remove()
      return
    }
  },
  { flush: 'sync' }
)

interface UseLayerListeners {
  onDismiss?: (e: Event) => void
  onClickOutside?: (e: PointerEvent) => void
  onEscapeKey?: (e: KeyboardEvent) => void
}

export function useLayer(
  LayerEl: Layer,
  listeners: UseLayerListeners = {},
  focusTrapOptions: Options = {}
) {
  layers.add(LayerEl)
  onBeforeUnmount(() => {
    layers.delete(LayerEl)
  })

  const isTopLayer = computed<boolean>(() => [...layers][layers.size - 1] === LayerEl)
  useFocusTrap(LayerEl, isTopLayer, focusTrapOptions)

  //----------------------------------------------------------------------------------------------------

  onClickOutside(LayerEl, (e) => {
    if (!isTopLayer.value) return
    listeners.onClickOutside?.(e)
    listeners.onDismiss?.(e)
  })

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isTopLayer.value) {
      listeners.onEscapeKey?.(e)
      listeners.onDismiss?.(e)
    }
  })

  return {
    pointerEvents: computed(() => (isTopLayer.value ? 'auto' : 'none')),
  }
}
