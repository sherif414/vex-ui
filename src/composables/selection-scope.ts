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

export interface SelectionScopeArgs<T> {
  selectionMode?: SelectionMode<T>
  selected?: Ref<T[]>
}

//----------------------------------------------------------------------------------------------------
// 📌 implementation
//----------------------------------------------------------------------------------------------------

/**
 * Represents a selection scope for managing selected values.
 */
export class SelectionScope<T extends PrimitiveValue> {
  #selectionMode: SelectionMode<T>
  #selected: Ref<T[]>

  /**
   * Creates a new SelectionScope instance.
   * @param options - The options for the selection scope.
   * @param options.selectionMode - The selection mode to be used.
   * @param options.selected - The array of selected values, can be used to add default selected values.
   */
  constructor(options: SelectionScopeArgs<T> = {}) {
    const { selected = ref([]), selectionMode = new SingleSelection() } = options
    this.#selected = selected

    if (selectionMode instanceof SelectionMode) {
      this.#selectionMode = selectionMode
    } else {
      throw new Error('[vex] invalid selection mode')
    }
  }

  /**
   * Gets the array of selected values.
   */
  get selected(): T[] {
    return this.#selected.value
  }

  get selectionMode(): SelectionMode<T> {
    return this.#selectionMode
  }

  set selectionMode(mode: SelectionMode<T>) {
    if (mode instanceof SelectionMode) {
      this.#selectionMode = mode
    } else {
      throw new Error('[vex] invalid selection mode')
    }
  }

  /**
   * Selects the given value using the current selection mode.
   * @param value - The value to be selected.
   */
  select(value: T, shouldDeselect: boolean): void {
    this.#selectionMode.select(value, this.#selected, shouldDeselect)
  }

  /**
   * Resets the selected values.
   */
  resetSelected(): void {
    this.#selected.value = []
  }
}

//===

/**
 * Represents a single selection mode.
 */
export class SingleSelection<T> extends SelectionMode<T> {
  /**
   * Selects or deselects a value in an array based on the provided parameters.
   * @param value - The value to select or deselect.
   * @param selected - The array of selected values.
   * @param shouldDeselect - Whether the value should be deselected if already selected.
   */
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

/**
 * Represents a multi-selection mode.
 */
export class MultiSelection<T> extends SelectionMode<T> {
  /**
   * Selects or deselects the given value based on its presence in the selected array.
   * @param value - The value to be selected or deselected.
   * @param selected - The array of selected values.
   * @param shouldDeselect - Optional parameter indicating whether to deselect the value.
   */
  select(value: T, selected: Ref<T[]>, shouldDeselect: boolean): void {
    const isSelected = selected.value.includes(value)

    if (isSelected && shouldDeselect) {
      selected.value = selected.value.filter((_value) => _value !== value)
    } else if (!isSelected) {
      selected.value = [...selected.value, value]
    }
  }
}
