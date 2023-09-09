import { ref } from 'vue'
import { MultiSelect, SelectionGroup, SingleSelect } from '../selection-scope'
import { describe, it, expect } from 'vitest'

//----------------------------------------------------------------------------------------------------
// 📌 SingleSelection
//----------------------------------------------------------------------------------------------------

describe('SingleSelect', () => {
  it('should select a new value', () => {
    const selected = ref([])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.select('test', true)
    expect(selected.value).toEqual(['test'])
  })

  it('should deselect', () => {
    const selected = ref(['test'])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.deselect()
    expect(selected.value).toEqual([])
  })

  it('should return whether a value is selected', () => {
    const selected = ref([])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.select('test', false)
    expect(singleSelect.isSelected('test')).toBe(true)
  })

  it('should deselect when deselectOnReselect is true', () => {
    const selected = ref(['test'])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.select('test', true)
    expect(selected.value).toEqual([])
  })

  it('should not deselect when when deselectOnReselect is false', () => {
    const selected = ref(['test'])
    const singleSelect = new SingleSelect<string>(selected)
    singleSelect.select('test', false)
    expect(selected.value).toEqual(['test'])
  })
})

//----------------------------------------------------------------------------------------------------
// 📌 MultiSelect
//----------------------------------------------------------------------------------------------------

describe('MultiSelect', () => {
  it('should handle selecting an already selected value when deselect is true', () => {
    const selected = ref(['test1'])
    const multiSelect = new MultiSelect<string>(selected)
    multiSelect.select('test1', true)
    expect(selected.value).toEqual([])
  })

  it('should handle selecting an already selected value when deselect is false', () => {
    const selected = ref(['test1'])
    const multiSelect = new MultiSelect<string>(selected)
    multiSelect.select('test1', false)
    expect(selected.value).toEqual(['test1'])
  })

  it('should handle selecting a value that is not already selected when deselectOnReselect is true', () => {
    const selected = ref(['test1'])
    const multiSelect = new MultiSelect<string>(selected)
    multiSelect.select('test2', true)
    expect(selected.value).toEqual(['test1', 'test2'])
  })

  it('should handle selecting a value that is not already selected when deselectOnReselect is false', () => {
    const selected = ref(['test1'])
    const multiSelect = new MultiSelect<string>(selected)
    multiSelect.select('test2', false)
    expect(selected.value).toEqual(['test1', 'test2'])
  })

  it('should handle deselecting a value that is already selected', () => {
    const selected = ref(['test1', 'test2'])
    const multiSelect = new MultiSelect<string>(selected)
    multiSelect.deselect('test1')
    expect(selected.value).toEqual(['test2'])
  })

  it('should handle deselecting a value that is not already selected', () => {
    const selected = ref(['test1', 'test2'])
    const multiSelect = new MultiSelect<string>(selected)
    multiSelect.deselect('test3')
    expect(selected.value).toEqual(['test1', 'test2'])
  })
})

//----------------------------------------------------------------------------------------------------
// 📌 SelectionGroup
//----------------------------------------------------------------------------------------------------

describe('SelectionGroup', () => {
  it('can be instantiated', () => {
    const value = []
    const group = new SelectionGroup(ref(value))
    expect(group).toBeDefined()
  })

  it('can be instantiated with default value', () => {
    const value = 1
    const group = new SelectionGroup(ref([value]))
    expect(group.selected.value).toEqual([value])
  })

  it('should select a value', () => {
    const value = 1
    const group = new SelectionGroup(ref<number[]>([]), {})
    group.select(value)
    expect(group.selected.value).toEqual([value])
  })

  it('should select a value', () => {
    const value = 1
    const group = new SelectionGroup(ref<number[]>([]))
    group.select(value)
    expect(group.selected.value).toEqual([value])
  })

  it('should clear selected values', () => {
    const value = 1
    const group = new SelectionGroup(ref([value]))
    group.clearSelected()
    expect(group.selected.value).toEqual([])
  })

  it('should deselect a value if it is selected and deselectOnReselect is true', () => {
    const value = 1
    const group = new SelectionGroup(ref([value]), { deselection: () => true })
    group.select(value)
    expect(group.selected.value).toEqual([])
  })

  it('should not deselect a value if it is selected and deselectOnReselect is false', () => {
    const value = 1
    const group = new SelectionGroup(ref([value]), { deselection: () => false })
    group.select(value)
    expect(group.selected.value).toEqual([value])
  })

  it('can clear selected values even if it is already empty', () => {
    const value = 1
    const group = new SelectionGroup(ref([value]))
    group.clearSelected()
    expect(group.selected.value).toEqual([])
  })

  it('should deselect a value', () => {
    const value = 1
    const group = new SelectionGroup(ref([value]))
    group.deselect(value)
    expect(group.selected.value).toEqual([])
  })
})
