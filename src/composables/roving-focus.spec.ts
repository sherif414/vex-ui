import { useRovingFocus } from '.'
import { ref } from 'vue'
import { describe, it, expect } from 'vitest'

describe('useRovingFocus', () => {
  it('should handle focus event by focusing the first item', () => {
    // Arrange
    const group = ref(document.createElement('div'))
    const items = ref([document.createElement('button'), document.createElement('a')])
    const options = {}

    // Act
    useRovingFocus(group, items, options)
    group.value.dispatchEvent(new FocusEvent('focus'))

    // Assert
    expect(document.activeElement).toBe(items.value[0])
  })

  it('should handle "next" keydown intent by focusing the next item', () => {
    // Arrange
    const group = ref(document.createElement('div'))
    const items = ref([document.createElement('button'), document.createElement('a')])
    const options = {}

    // Act
    useRovingFocus(group, items, options)
    group.value.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))

    // Assert
    expect(document.activeElement).toBe(items.value[1])
  })

  it('should handle "prev" keydown intent by focusing the previous item', () => {
    // Arrange
    const group = ref(document.createElement('div'))
    const items = ref([document.createElement('button'), document.createElement('a')])
    const options = {}

    // Act
    useRovingFocus(group, items, options)
    group.value.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))

    // Assert
    expect(document.activeElement).toBe(items.value[1])
  })

  it('should handle "first" keydown intent by focusing the first item', () => {
    // Arrange
    const group = ref(document.createElement('div'))
    const items = ref([document.createElement('button'), document.createElement('a')])
    const options = {}

    // Act
    useRovingFocus(group, items, options)
    group.value.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }))

    // Assert
    expect(document.activeElement).toBe(items.value[0])
  })

  it('should handle "last" keydown intent by focusing the last item', () => {
    // Arrange
    const group = ref(document.createElement('div'))
    const items = ref([document.createElement('button'), document.createElement('a')])
    const options = {}

    // Act
    useRovingFocus(group, items, options)
    group.value.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))

    // Assert
    expect(document.activeElement).toBe(items.value[1])
  })
})
