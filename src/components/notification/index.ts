import { h, markRaw, render } from 'vue'
import type { VNode, Component, FunctionalComponent } from 'vue'

import Notification from './Notification.vue'
import NotificationGroup from './NotificationGroup.vue'
import { getRandomString } from '@/composables/helpers'

export interface NotifyArgs {
  title?: string | VNode | Component | FunctionalComponent
  body?: string | VNode | Component | FunctionalComponent
  icon?: VNode | Component | FunctionalComponent
  type?: 'success' | 'danger' | 'warning' | 'primary'
  customContent?: VNode | Component | FunctionalComponent
}

export interface NotifyOptions {
  duration?: number
  persist?: boolean
  closable?: boolean
  showProgress?: boolean
}

export interface NotificationItem extends NotifyArgs, NotifyOptions {
  key: string
}

let group: VNode | null = null

/**
 * @returns notify - a function that creates new notification items
 */
function useNotification() {
  if (!group) {
    group = h(NotificationGroup)
    const groupFragment = document.createDocumentFragment() as unknown as Element

    render(group, groupFragment)
    document.body.appendChild(groupFragment)
  }

  /**
   * adds a new notification item
   * @returns A function that removes the notification item
   */
  function notify(args: NotifyArgs = {}, options: NotifyOptions = {}) {
    const item: NotificationItem = markRaw({
      key: getRandomString(6),
      ...args,
      ...options,
    })

    group.component?.exposed?.add(item)

    /**
     * @description removes the notification
     */
    const remove = () => {
      group.component?.exposed?.remove(item)
    }

    return remove
  }

  return {
    notify,
  }
}

export { useNotification, Notification }
