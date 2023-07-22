import { reactive, type InjectionKey, type Ref, shallowReactive, watchPostEffect, watch } from 'vue'

export type Layer = Ref<HTMLElement | null>

export const branches = shallowReactive(new Set<Layer>())
export const layers = shallowReactive(new Set<Layer>())
export const layersWithInertOutside = shallowReactive(new Set<Layer>())

watchPostEffect(() => {
  if (layers.size === 0) {
    document.body.style.pointerEvents = ''
  }
  if (layers.size === 1) {
    document.body.style.pointerEvents = 'none'
  }
})
