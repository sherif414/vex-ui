import { type Ref, ref } from 'vue'
import { isArray } from './helpers'

//----------------------------------------------------------------------------------------------------
// 📌 types
//----------------------------------------------------------------------------------------------------

type PrimitiveValue = string | number | boolean | symbol

export abstract class SelectionMode<T> {
  /**
   * Selects the given value and updates the selected array.
   * @param value - The value to be selected.
   * @param selected - The array of selected values.
   * @param shouldDeselect - Whether the value should be deselected if already selected.
   */
  abstract select(value: T, selected: Ref<T | T[]>, shouldDeselect: boolean): void
}

//----------------------------------------------------------------------------------------------------
// 📌 implementation
//----------------------------------------------------------------------------------------------------

/**
 * Represents a selection scope for managing a group of selectable values.
 */
export class SelectionScope<T extends PrimitiveValue> {
  #selectionMode: SelectionMode<T>

  /**
   * @param selectionMode - The selection mode to be used.
   * @param selected - The array of selected values, can be used to add default selected values.
   */
  constructor(public selected: Ref<T[]>, public mode: 'single' | 'multiple' = 'single') {
    this.#selectionMode = mode === 'single' ? new SingleSelection() : new MultiSelection()
  }

  set selectionMode(mode: 'single' | 'multiple') {
    if (mode === 'single') {
      this.#selectionMode = new SingleSelection()
    } else {
      this.#selectionMode = new MultiSelection()
    }
  }

  /**
   * Selects the given value using the current selection mode.
   * @param value - The value to be selected.
   */
  select(value: T, shouldDeselect: boolean): void {
    this.#selectionMode.select(value, this.selected, shouldDeselect)
  }

  /**
   * Resets the selected values.
   */
  resetSelected(): void {
    this.selected.value = []
  }
}

//===

export class SingleSelection<T> extends SelectionMode<T> {
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

export class MultiSelection<T> extends SelectionMode<T> {
  select(value: T, selected: Ref<T[]>, shouldDeselect: boolean): void {
    const isSelected = selected.value.includes(value)

    if (isSelected && shouldDeselect) {
      selected.value = selected.value.filter((_value) => _value !== value)
    } else if (!isSelected) {
      selected.value = [...selected.value, value]
    }
  }
}
