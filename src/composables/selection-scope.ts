import { watch, type Ref } from 'vue'

type PrimitiveValue = string | number | boolean | symbol

interface Options {
  multiselect?: () => boolean
  deselection?: () => boolean
}

/**
 * Represents a selection group for managing a group of selectable values.
 */
export class SelectionGroup<T extends PrimitiveValue> {
  deselection = () => false
  multiselect = () => false
  selected: Ref<T[]>
  private strategy: SelectionStrategy<T>

  constructor(selected: Ref<T[]>, options: Options = {}) {
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
        this.clearSelected()
        this.strategy = multi ? new MultiSelect(this.selected) : new SingleSelect(this.selected)
      }
    )
  }

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
  constructor(protected selected: Ref<T[]>) {}
  abstract deselect(value: T): void
  abstract isSelected(value: T): boolean
  abstract select(value: T, deselectOnReselect: boolean): void
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
