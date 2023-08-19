// ported from @vueuse/core - computedWithControl

import type { ComputableGetter, Fn, Getter, Signal } from '@/types'
import type {
  ComputedGetter,
  ComputedRef,
  Ref,
  WatchOptions,
  WatchSource,
  WritableComputedOptions,
  WritableComputedRef,
} from 'vue'
import { computed, customRef, ref, watch } from 'vue'
import { isFunction } from './helpers'
import { toSignal } from './signal'

export function useComputed<T>(
  fn: ComputedGetter<T>,
  source?: WatchSource | WatchSource[],
  options?: WatchOptions
): Getter<T>

export function useComputed<T>(
  fn: WritableComputedOptions<T>,
  source?: WatchSource | WatchSource[],
  options?: WatchOptions
): Signal<T>

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
    if (isFunction(fn)) {
      const _computed = computed<T>(fn)
      return () => _computed.value
    }

    const _computed = computed<T>(fn)
    return toSignal(_computed)
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

  const getter = !isFunction(fn) ? fn.get : fn
  const setter = !isFunction(fn) ? fn.set : undefined

  const _computed = customRef<T>((_track, _trigger) => {
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
  }) as WritableComputedRef<T>

  if (!isFunction(setter)) {
    return () => _computed.value as Getter<T>
  }

  return toSignal(_computed)
}
