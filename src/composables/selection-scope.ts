import { watch, type Ref } from 'vue'

type PrimitiveValue = string | number | boolean | symbol

/**
 * Represents a selection group for managing a group of selectable values.
 */
export class SelectionGroup<T extends PrimitiveValue> {
  deselection = () => false
  multiselect = () => false
  selected: Ref<T[]>
  strategy: SelectionStrategy<T>

  constructor(
    selected: Ref<T[]>,
    options: {
      multiselect?: () => boolean
      deselection?: () => boolean
    } = {}
  ) {
    const { deselection, multiselect } = options

    this.selected = selected
    deselection && (this.deselection = deselection)
    multiselect && (this.multiselect = multiselect)
    this.strategy = this.multiselect()
      ? new MultiSelect(this.selected)
      : new SingleSelect(this.selected)

    watch(
      () => this.multiselect(),
      (multi) => {
        this.strategy = multi ? new MultiSelect(this.selected) : new SingleSelect(this.selected)
      }
    )
  }

  /**
   * Selects or deselects the given value using the current selection mode.
   * @param value - The value to be selected or deselected.
   */
  select(value: T): void {
    this.strategy.select(value, this.deselection())
  }

  deselect(value: T): void {
    this.strategy.deselect(value)
  }

  clearSelected(): void {
    this.selected.value = []
  }
}

//===

export abstract class SelectionStrategy<T> {
  protected selected: Ref<T[]>

  constructor(selected: Ref<T[]>) {
    this.selected = selected
  }

  /**
   * Selects the given value and updates the selected array.
   */
  abstract select(value: T, deselectOnReselect: boolean): void

  /**
   * Deselects the given value and updates the selected array.
   */
  abstract deselect(value: T): void

  /**
   * whether a value is selected
   */
  abstract isSelected(value: T): boolean
}

//===

export class SingleSelect<T> extends SelectionStrategy<T> {
  isSelected(value: T): boolean {
    return this.selected.value.includes(value)
  }

  deselect(): void {
    this.selected.value = []
  }

  select(value: T, deselectOnReselect: boolean): void {
    if (this.isSelected(value)) {
      if (deselectOnReselect) {
        this.deselect()
      }
    } else {
      this.selected.value = [value]
    }
  }
}

//===

export class MultiSelect<T> extends SelectionStrategy<T> {
  isSelected(value: T): boolean {
    return this.selected.value.includes(value)
  }

  deselect(value: T): void {
    this.selected.value = this.selected.value.filter((_value) => _value !== value)
  }

  select(value: T, deselectOnReselect: boolean): void {
    if (this.isSelected(value)) {
      if (deselectOnReselect) {
        this.deselect(value)
      }
    } else {
      this.selected.value = [...this.selected.value, value]
    }
  }
}
