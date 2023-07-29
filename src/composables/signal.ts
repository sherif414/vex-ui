import type { MaybeSetter } from '@/types'
import { shallowRef, triggerRef } from 'vue'

interface UseSignalOptions {
  equals: boolean
}

export function useSignal<T>(value: T, options?: UseSignalOptions) {
  const r = shallowRef(value)

  const get = (): T => r.value
  const set = (v: MaybeSetter<T>) => {
    if (v instanceof Function) {
      r.value = v(r.value)
    } else {
      r.value = v
    }

    if (options?.equals === false) triggerRef(r)
  }

  return [get, set] as const
}
