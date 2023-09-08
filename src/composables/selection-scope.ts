import { watch, type Ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 types
//----------------------------------------------------------------------------------------------------

type PrimitiveValue = string | number | boolean | symbol

export abstract class SelectionStrategy<T> {
  /**
   * Selects the given value and updates the selected array.
   * @param value - The value to be selected.
   * @param selected - The array of selected values.
   * @param shouldDeselect - Whether the value should be deselected if already selected.
   */
  abstract select(value: T, selected: Ref<T[]>, shouldDeselect: boolean): void
}

//----------------------------------------------------------------------------------------------------
// 📌 implementation
//----------------------------------------------------------------------------------------------------

/**
 * Represents a selection group for managing a group of selectable values.
 */
export class SelectionGroup<T extends PrimitiveValue> {
  deselection = () => true
  multiselect = () => false
  strategy: SelectionStrategy<T> = new SingleSelection()

  /**
   * @param selected - The array of selected values, can be used to add default selected values.
   * @param mode - The selection mode to be used, Defaults to 'single'.
   */
  constructor(
    public selected: Ref<T[]>,
    options: {
      multiselect?: () => boolean
      deselection?: () => boolean
    } = {}
  ) {
    const { deselection, multiselect } = options
    deselection && (this.deselection = deselection)
    multiselect && (this.multiselect = multiselect)

    watch(
      () => this.multiselect(),
      (multi) => {
        this.strategy = multi ? new MultiSelection() : new SingleSelection()
      },
      { immediate: true }
    )
  }

  /**
   * Selects the given value using the current selection mode.
   * @param value - The value to be selected.
   */
  select(value: T): void {
    this.strategy.select(value, this.selected, this.deselection())
  }

  /**
   * clears the selected values.
   */
  clearSelected(): void {
    this.selected.value = []
  }
}

//===

export class SingleSelection<T> extends SelectionStrategy<T> {
  select(value: T, selected: Ref<T[]>, shouldDeselect: boolean): void {
    const isSelected = selected.value.includes(value)

    if (isSelected && shouldDeselect) {
      selected.value = []
    } else if (!isSelected) {
      selected.value = [value]
    }
  }
}

//===

export class MultiSelection<T> extends SelectionStrategy<T> {
  select(value: T, selected: Ref<T[]>, shouldDeselect: boolean): void {
    const isSelected = selected.value.includes(value)

    if (isSelected && shouldDeselect) {
      selected.value = selected.value.filter((_value) => _value !== value)
    } else if (!isSelected) {
      selected.value = [...selected.value, value]
    }
  }
}
