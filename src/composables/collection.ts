import type { Getter } from '@/types'
import { provide, type InjectionKey, inject, shallowReactive } from 'vue'

export type CollectionContext = {
  register(el: HTMLElement): void
  unregister(el: HTMLElement): void
  getItems(): HTMLElement[]
  CollectionEl: Getter<HTMLElement | null>
}

export function createCollection(CollectionEl: Getter<HTMLElement | null>) {
  const items = shallowReactive(new Set<HTMLElement>())

  const getItems = () => {
    return [...items]
  }

  const register = (el: HTMLElement) => {
    items.add(el)
  }

  const unregister = (el: HTMLElement) => {
    items.delete(el)
  }

  const useCollection = () => {
    return {
      getItems,
      register,
      unregister,
      CollectionEl,
    }
  }

  return [getItems, useCollection] as const
}
