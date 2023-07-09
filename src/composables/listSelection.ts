import {
  watch,
  provide,
  toRef,
  type InjectionKey,
  type Ref,
  reactive,
  computed,
  ref,
  toValue,
} from 'vue'

export const SELECTION_INJECTION_KEY = Symbol() as InjectionKey<{
  onSelect: (value: string) => void
  selected: Ref<string | string[]>
}>

export interface SelectionProps {
  modelValue?: string | string[]
  multiple?: boolean
  items: { label: string; value: string }[]
}

export type SelectionEmits = (e: 'update:modelValue', value?: string | string[]) => void

export function useListSelection(props: SelectionProps, emit: SelectionEmits) {
  const multiple = toRef(() => props.multiple)
  const selected = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
  })

  const itemsMap = computed(() => {
    const map = new Map<string, string>()
    props.items.forEach((i) => {
      map.set(i.value, i.label)
    })
    return map
  })

  const selectedLabels = computed<string | string[]>(() => {
    if (!Array.isArray(selected.value)) {
      return itemsMap.value.get(selected.value)
    }
    return selected.value.map((i) => itemsMap.value.get(i))
  })

  function onSelect(value: string): void {
    // single-select
    if (!multiple.value && !Array.isArray(selected.value)) {
      if (selected.value === value) return
      selected.value = value
    }

    // multi-select
    else if (multiple.value && Array.isArray(selected.value)) {
      if (selected.value.includes(value)) {
        selected.value = selected.value.filter((v) => v !== value)
      } else {
        selected.value = [...selected.value, value]
      }
    }

    // fallback to fix multiple + non array modelValue
    else {
      selected.value = multiple.value ? [value] : value
    }
  }

  watch(multiple, (val) => {
    selected.value = val ? [] : undefined
  })

  provide(SELECTION_INJECTION_KEY, {
    onSelect,
    selected,
  })

  return {
    selected,
    selectedLabels,
  }
}
