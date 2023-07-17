import { h, markRaw, render } from 'vue'
import type { VNode, Component } from 'vue'
import NotificationRoot from './NotificationRoot.vue'
import { getRandomString } from '@/composables/helpers'

export interface NotifyProps {
  title?: string | Component
  body?: string | Component
  type?: 'success' | 'danger' | 'warning' | 'primary' | 'info'
  icon?: Component
  customContent?: Component
}

export interface NotifyOptions {
  duration?: number
  persist?: boolean
  closable?: boolean
  hideProgress?: boolean
}

export interface NotificationItem extends NotifyProps, NotifyOptions {
  key: string
}

let Root: VNode | null = null

function useNotification() {
  if (!Root) {
    Root = h(NotificationRoot)
    render(Root, document.createDocumentFragment() as unknown as Element)
  }

  /**
   * adds a new notification.
   * @returns A function that removes the notification.
   */
  function notify(args: NotifyProps = {}, options: NotifyOptions = {}) {
    const notification: NotificationItem = markRaw({
      key: getRandomString(6),
      ...args,
      ...options,
    })
    Root?.component?.exposed?.addNotification(notification)

    /**
     * removes the notification.
     */
    const remove = () => {
      Root?.component?.exposed?.removeNotification(notification)
    }

    return remove
  }

  return {
    notify,
  }
}

export { useNotification }
