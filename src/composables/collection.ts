import type { Getter } from '@/types'
import { provide, type InjectionKey, inject, shallowReactive, type Ref } from 'vue'
import { tryOnScopeDispose } from '@vueuse/core'
import { useComputed } from './computed'

export type CollectionContext = {
  register: (data: ItemData) => void
  unregister: (data: ItemData) => void
  getItems(): ItemData[]
  CollectionEl: Ref<HTMLElement | null>
}

type ItemData = {
  id: string
  ref: Ref<HTMLElement | null>
  disabled?: Getter<boolean>
}

const COLLECTION_CTX = Symbol() as InjectionKey<CollectionContext>

export function createCollection(CollectionEl: Ref<HTMLElement | null>) {
  const itemsMap = shallowReactive<Map<Ref<HTMLElement | null>, ItemData>>(new Map())

  function getItems() {
    return [...itemsMap.values()]
  }

  const elements = useComputed(function getElements() {
    return [...itemsMap.keys()].reduce<HTMLElement[]>((arr, ref) => {
      const item = ref.value
      item != null && arr.push(item)
      return arr
    }, [])
  })

  function register(data: ItemData) {
    itemsMap.set(data.ref, data)
  }

  function unregister(data: ItemData) {
    itemsMap.delete(data.ref)
  }

  provide(COLLECTION_CTX, {
    getItems,
    register,
    unregister,
    CollectionEl,
  })

  return { itemsMap, elements }
}

export function useCollection(itemData: ItemData) {
  const ctx = inject(COLLECTION_CTX, null)
  if (!ctx) {
    throw new Error('[vex] collection item needs to be contained by a collection')
  }

  ctx.register(itemData)
  tryOnScopeDispose(() => ctx.unregister(itemData))

  return ctx
}
