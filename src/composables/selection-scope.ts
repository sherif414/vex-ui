import { type Ref } from 'vue'
import { isArray } from './helpers'

//----------------------------------------------------------------------------------------------------
// 📌 types
//----------------------------------------------------------------------------------------------------

type PrimitiveValue = string | number | boolean | symbol
type Mode = 'single' | 'multiple'

export interface SelectionMode<T> {
  /**
   * Selects the given value and updates the selected array.
   * @param value - The value to be selected.
   * @param selected - The array of selected values.
   * @param shouldDeselect - Whether the value should be deselected if already selected.
   */
  select(value: T, selected: Ref<T | T[]>, shouldDeselect: boolean): void
}

//----------------------------------------------------------------------------------------------------
// 📌 implementation
//----------------------------------------------------------------------------------------------------

/**
 * Represents a selection scope for managing a group of selectable values.
 */
export class SelectionScope<T extends PrimitiveValue> {
  #mode: SelectionMode<T>

  /**
   * @param selected - The array of selected values, can be used to add default selected values.
   * @param mode - The selection mode to be used. Defaults to 'single'
   */
  constructor(public selected: Ref<T[]>, mode: Mode = 'single') {
    this.#mode = mode === 'single' ? new SingleSelection() : new MultiSelection()
  }

  get mode(): Mode {
    return this.#mode instanceof SingleSelection ? 'single' : 'multiple'
  }
  set mode(mode: Mode) {
    this.#mode = mode === 'single' ? new SingleSelection() : new MultiSelection()
  }

  /**
   * Selects the given value using the current selection mode.
   * @param value - The value to be selected.
   */
  select(value: T, shouldDeselect: boolean): void {
    this.#mode.select(value, this.selected, shouldDeselect)
  }

  /**
   * Resets the selected values.
   */
  resetSelected(): void {
    this.selected.value = []
  }
}

//===

export class SingleSelection<T> implements SelectionMode<T> {
  select(value: T, selected: Ref<T | T[] | undefined>, shouldDeselect: boolean): void {
    const isSelected = !isArray(selected.value) ? selected.value === value : false

    if (isSelected && shouldDeselect) {
      selected.value = undefined
    } else if (!isSelected) {
      selected.value = value
    }
  }
}

//===

export class MultiSelection<T> implements SelectionMode<T> {
  select(value: T, selected: Ref<T[]>, shouldDeselect: boolean): void {
    const isSelected = selected.value.includes(value)

    if (isSelected && shouldDeselect) {
      selected.value = selected.value.filter((_value) => _value !== value)
    } else if (!isSelected) {
      selected.value = [...selected.value, value]
    }
  }
}
