import { render, h, VNode, Component, FunctionalComponent, markRaw } from 'vue'

import ToastGroup from './ToastGroup.vue'
import { getRandomString } from '@/composables/helpers'

export interface ToastifyParams {
  content: string | Component | VNode | FunctionalComponent
  type?: 'success' | 'warning' | 'danger' | 'info' | 'primary'
  duration?: number
}

export interface ToastItem extends ToastifyParams {
  key: string
}

let group: VNode | null = null

export function useToast() {
  if (!group) {
    group = h(ToastGroup)
    const groupFragment = document.createDocumentFragment() as unknown as Element

    render(group, groupFragment)
    document.body.appendChild(groupFragment)
  }

  /**
   * creates new toasts
   * @returns a function that removes the toast
   */
  function toastify(params: ToastifyParams) {
    const item = markRaw({ ...params, key: getRandomString(6) })

    group.component?.exposed?.add(item)

    /**
     * @description removes the toast
     */
    const remove = () => {
      group.component?.exposed?.remove(item)
    }

    return remove
  }

  return {
    toastify,
  }
}
