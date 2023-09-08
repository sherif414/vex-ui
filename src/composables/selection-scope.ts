import { watch, type Ref } from 'vue'

type PrimitiveValue = string | number | boolean | symbol

/**
 * Represents a selection group for managing a group of selectable values.
 */
export class SelectionGroup<T extends PrimitiveValue> {
  deselection = () => false
  multiselect = () => false
  strategy: SelectionStrategy<T> = new SingleSelect()

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
        this.strategy = multi ? new MultiSelect() : new SingleSelect()
      },
      { immediate: true }
    )
  }

  /**
   * Selects or deselects the given value using the current selection mode.
   * @param value - The value to be selected or deselected.
   */
  select(value: T): void {
    this.strategy.select(value, this.selected, this.deselection())
  }

  clearSelected(): void {
    this.selected.value = []
  }
}

//===

export abstract class SelectionStrategy<T> {
  /**
   * Selects the given value and updates the selected array.
   * @param value - The value to be selected.
   * @param selected - The array of selected values.
   * @param deselectOnReselect - Whether the value should be deselected if already selected.
   */
  abstract select(value: T, selected: Ref<T[]>, deselectOnReselect: boolean): void

  /**
   * Deselects the given value and updates the selected array.
   * @param value - The value to be deselected.
   * @param selected - The array of selected values.
   */
  abstract deselect(selected: Ref<T[]>, value: T): void
}

//===

export class SingleSelect<T> extends SelectionStrategy<T> {
  select(value: T, selected: Ref<T[]>, shouldDeselect: boolean): void {
    const isSelected = selected.value.includes(value)

    if (isSelected && shouldDeselect) {
      this.deselect(selected)
    } else if (!isSelected) {
      selected.value = [value]
    }
  }

  deselect(selected: Ref<T[]>): void {
    selected.value = []
  }
}

//===

export class MultiSelect<T> extends SelectionStrategy<T> {
  select(value: T, selected: Ref<T[]>, shouldDeselect: boolean): void {
    const isSelected = selected.value.includes(value)

    if (isSelected && shouldDeselect) {
      this.deselect(selected, value)
    } else if (!isSelected) {
      selected.value = [...selected.value, value]
    }
  }

  deselect(selected: Ref<T[]>, value: T): void {
    selected.value = selected.value.filter((_value) => _value !== value)
  }
}
