import type { Getter } from '@/types'
import { computedEager } from '@vueuse/core'
import type { Ref } from 'vue'
import { inject, provide, ref, watch } from 'vue'
import { isArray, isString } from './helpers'

type ObjectValue = { value: string }
type PrimitiveValue = string
type Value = PrimitiveValue | ObjectValue

interface SelectScope<T> {
  selected: Readonly<Ref<T | T[] | undefined>>
  setSelected: (value: T) => void
  resetSelected: (multiselect?: boolean) => void
  multiselect: Getter<boolean>
}

interface UseSelectOptions {
  multiselect?: Getter<boolean>
  deselection?: Getter<boolean>
}

//----------------------------------------------------------------------------------------------------

const SELECT_SCOPE_CTX = Symbol()

/**
 * handles multi and single select for a list of items.
 */
export function createSelectScope<T extends Value>(
  selected: Ref<T | T[] | undefined>,
  options: UseSelectOptions = {}
): SelectScope<T> {
  const { multiselect = () => false, deselection = () => false } = options

  const setSelected = (next: T) => {
    let prev = selected.value

    // multi-select
    if (Array.isArray(prev)) {
      selected.value = has(next, prev) ? prev.filter((v) => same(v, next)) : [...prev, next]
      return
    }

    // single-select
    if (prev === undefined || !same(prev, next)) {
      selected.value = next
      return
    }

    // deselect
    if (deselection()) {
      resetSelected()
    }
  }

  // validate the initial value and correct it if needed
  if (multiselect()) {
    if (!isArray(selected.value)) selected.value = []
  } else {
    if (isArray(selected.value)) selected.value = undefined
  }

  const resetSelected = (multi?: boolean) => {
    selected.value = multi ?? multiselect() ? [] : undefined
  }

  watch(multiselect, resetSelected)

  provide(SELECT_SCOPE_CTX, {
    selected,
    multiselect,
    setSelected,
    resetSelected,
  })

  return {
    selected,
    multiselect,
    setSelected,
    resetSelected,
  }
}

export function useSelectScope<T extends Value>(value: Getter<T>) {
  const ctx = inject<SelectScope<T>>(SELECT_SCOPE_CTX)
  if (!ctx) {
    throw new Error(
      '[vex] selection scope was not found, make sure this component is used within its appropriate parent.'
    )
  }

  const isSelected = computedEager(() => {
    const _selected = ctx.selected.value
    if (_selected == undefined) return false
    return isArray(_selected) ? has(value(), _selected) : same(value(), _selected)
  })

  return {
    selected: ctx.selected,
    multiselect: ctx.multiselect,
    setSelected: ctx.setSelected,
    isSelected,
  }
}

//----------------------------------------------------------------------------------------------------
// 📌 utils
//----------------------------------------------------------------------------------------------------

function has<T extends Value>(value: T, array: T[]): boolean {
  if (isString(value)) {
    return array.includes(value)
  }

  return array.some((v) => (v as ObjectValue).value === value.value)
}

function same(a: any, b: any): boolean {
  if (isString(a)) {
    return a === b
  } else {
    return a.value === b.value
  }
}

const boolean = ref(false)

boolean.value = false
