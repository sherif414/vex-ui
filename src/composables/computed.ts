import type { Fn } from '@/types'
import type { ComputedGetter, Ref, WatchOptions, WatchSource, WritableComputedOptions } from 'vue'
import { computed, customRef, watch } from 'vue'
import { isFunction } from './helpers'

export function useComputed<T>(
  fn: ComputedGetter<T> | WritableComputedOptions<T>,
  source?: WatchSource[],
  options: WatchOptions = {
    flush: 'sync',
  }
): Ref<T> {
  if (!source) {
    return computed(fn as any)
  }

  let v: T = undefined!
  let track: Fn
  let trigger: Fn
  let dirty = true

  const update = () => {
    dirty = true
    trigger()
  }

  watch(source, update, options)

  const getter = !isFunction(fn) ? fn.get : fn
  const setter = !isFunction(fn) ? fn.set : undefined

  return customRef<T>((_track, _trigger) => {
    track = _track
    trigger = _trigger

    return {
      get() {
        if (dirty) {
          v = getter()
          dirty = false
        }
        track()
        return v
      },
      set(v) {
        setter?.(v)
      },
    }
  })
}
