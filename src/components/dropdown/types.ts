export interface Option {
  label: string
  value: any
  disabled?: boolean
}

export interface Item {
  option: Option
  selected: boolean
}
