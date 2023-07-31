// ported from @vueuse/core - computedWithControl

import type { Fn } from '@/types'
import type {
  ComputedGetter,
  ComputedRef,
  WatchOptions,
  WatchSource,
  WritableComputedOptions,
  WritableComputedRef,
} from 'vue'
import { computed, customRef, ref, watch } from 'vue'

export function useComputed<T>(
  fn: ComputedGetter<T>,
  source?: WatchSource | WatchSource[],
  options?: WatchOptions
): ComputedRef<T>

export function useComputed<T>(
  fn: WritableComputedOptions<T>,
  source?: WatchSource | WatchSource[],
  options?: WatchOptions
): WritableComputedRef<T>

/**
 * You may explicitly define the deps of computed.
 *
 * @param fn
 * @param source
 * @param options
 */
export function useComputed<T>(
  fn: ComputedGetter<T> | WritableComputedOptions<T>,
  source?: WatchSource | WatchSource[],
  options: WatchOptions = {
    flush: 'sync',
  }
) {
  if (!source) {
    return computed(fn as any)
  }

  let v: T = undefined!
  let track: Fn
  let trigger: Fn
  const dirty = ref(true)

  const update = () => {
    dirty.value = true
    trigger()
  }

  watch(source, update, options)

  const getter = typeof fn !== 'function' ? fn.get : fn
  const setter = typeof fn !== 'function' ? fn.set : undefined

  return customRef<T>((_track, _trigger) => {
    track = _track
    trigger = _trigger

    return {
      get() {
        if (dirty.value) {
          v = getter()
          dirty.value = false
        }
        track()
        return v
      },
      set(v) {
        setter?.(v)
      },
    }
  }) as ComputedRef<T>
}
