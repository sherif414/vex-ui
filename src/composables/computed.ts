// ported from @vueuse/core - computedWithControl

import type { ComputableGetter, Fn, Getter, Signal } from '@/types'
import type {
  ComputedGetter,
  ComputedRef,
  WatchOptions,
  WatchSource,
  WritableComputedOptions,
  WritableComputedRef,
} from 'vue'
import { computed, customRef, ref, watch } from 'vue'
import { isFunction } from './helpers'

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
    return [() => _computed.value, (v: T) => (_computed.value = v)]
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

  return [
    function getter<U>(fn?: (v: T) => U): T | U {
      return isFunction(fn) ? fn(_computed.value) : _computed.value
    },
    function setter(fn: ((v: T) => T) | T): void {
      _computed.value = isFunction(fn) ? fn(_computed.value) : fn
    },
  ] as Signal<T>
}
