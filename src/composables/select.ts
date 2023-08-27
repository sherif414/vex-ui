import type { Getter } from '@/types'
import { watch, provide, inject, computed, readonly } from 'vue'
import type { Ref, InjectionKey, ComputedRef } from 'vue'
import { isArray } from './helpers'

interface SelectScopeContext {
  selected: Readonly<Ref<string | string[] | undefined>>
  setSelected: (value: string) => void
  resetSelected: (multiselect?: boolean) => void
  multiselect: Getter<boolean>
}

const SELECT_SCOPE_CTX = Symbol() as InjectionKey<SelectScopeContext>

interface UseSelectOptions {
  multiselect?: Getter<boolean>
  deselection?: Getter<boolean>
}

/**
 * handles multi and single select for a list of items.
 */
export function createSelectScope(
  selected: Ref<string | string[] | undefined>,
  options: UseSelectOptions = {}
): SelectScopeContext {
  const { multiselect = () => false, deselection = () => false } = options

  const setSelected = (value: string) => {
    const prev = selected.value

    // multi-select
    if (Array.isArray(prev)) {
      selected.value = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      return
    }

    // single-select
    if (prev !== value) {
      selected.value = value
      return
    }

    // deselect
    if (deselection()) {
      selected.value = undefined
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

export function useSelectScope(): SelectScopeContext

export function useSelectScope(
  value: Getter<string>
): SelectScopeContext & { isSelected: ComputedRef<boolean> }

export function useSelectScope(value?: Getter<string>) {
  const ctx = inject(SELECT_SCOPE_CTX, null)
  if (!ctx) {
    throw new Error(
      '[vex] selection scope was not found, make sure this component is used within its appropriate parent.'
    )
  }

  if (value) {
    return {
      selected: ctx.selected,
      multiselect: ctx.multiselect,
      setSelected: ctx.setSelected,
      isSelected: computed(() => {
        const selectedVal = ctx.selected.value
        return isArray(selectedVal) ? selectedVal.includes(value()) : selectedVal === value()
      }),
    }
  }

  return {
    selected: ctx.selected,
    setSelected: ctx.setSelected,
    multiselect: ctx.multiselect,
  }
}
