export { default as Dropdown } from './Dropdown.vue'
export { default as DropdownItem } from './DropdownItem.vue'

export interface Option {
  label: string
  value: any
  disabled?: boolean
}

export interface Item {
  option: Option
  selected: boolean
}
