import { mount } from '@vue/test-utils'
import {} from '@storybook/testing-library'
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '..'
import { describe, it, expect } from 'vitest'
import { h } from 'vue'

describe('Accordion', () => {
  it('renders correctly', () => {
    // Arrange
    const wrapper = mount(() => (
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>trigger</AccordionTrigger>
          <AccordionContent>content</AccordionContent>
        </AccordionItem>
      </Accordion>
    ))

    // Act
    const item = wrapper.findComponent(AccordionItem)

    // Assert
    expect(wrapper.classes()).toContain('vex-accordion')
    expect(item.text()).toContain('trigger')
    expect(item.text()).toContain('content')
  })

  it('renders the correct number of items', () => {
    // Arrange
    const wrapper = mount(() => (
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>trigger 1</AccordionTrigger>
          <AccordionContent>content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>trigger 2</AccordionTrigger>
          <AccordionContent>content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    ))

    // Assert
    expect(wrapper.findAllComponents(AccordionItem)).toHaveLength(2)
  })

  it('expands/collapses items properly', async () => {
    // Arrange
    const wrapper = mount(() => (
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>trigger 1</AccordionTrigger>
          <AccordionContent>content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>trigger 2</AccordionTrigger>
          <AccordionContent>content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    ))

    // Act
    const [item1, item2] = wrapper.findAllComponents(AccordionItem)

    // Assert
    expect(item1.find('.vex-accordion-trigger-button').attributes('aria-expanded')).toBe('false')
    expect(item2.find('.vex-accordion-trigger-button').attributes('aria-expanded')).toBe('false')

    // Act
    await item1.find('.vex-accordion-trigger-button').trigger('click')

    // Assert
    expect(item1.find('.vex-accordion-trigger-button').attributes('aria-expanded')).toBe('true')
    expect(item2.find('.vex-accordion-trigger-button').attributes('aria-expanded')).toBe('false')

    // Act
    await item2.find('.vex-accordion-trigger-button').trigger('click')

    // Assert
    expect(item1.find('.vex-accordion-trigger-button').attributes('aria-expanded')).toBe('false')
    expect(item2.find('.vex-accordion-trigger-button').attributes('aria-expanded')).toBe('true')
  })
})

it('expands/hides the content when toggled', () => {
  // Arrange
  const wrapper = mount(() => (
    <Accordion>
      <AccordionItem>
        <AccordionTrigger>trigger</AccordionTrigger>
        <AccordionContent>content</AccordionContent>
      </AccordionItem>
    </Accordion>
  ))

  // Act
  const item = wrapper.findComponent(AccordionItem)

  // Assert
  expect(item.text()).toContain('trigger')
  expect(item.text()).toContain('content')
})

it('expands/hides the content when toggled', async () => {
  // Arrange
  const wrapper = mount(() => (
    <Accordion>
      <AccordionItem>
        <AccordionTrigger>trigger</AccordionTrigger>
        <AccordionContent>content</AccordionContent>
      </AccordionItem>
    </Accordion>
  ))

  // Act
  const item = wrapper.findComponent(AccordionItem)
  const trigger = wrapper.findComponent(AccordionTrigger)

  // Assert
  expect(item.classes()).not.toContain('--expanded')
  expect(item.find('.vex-accordion-content').exists()).toBeFalsy()

  // Act
  await trigger.trigger('click')

  // Assert
  expect(item.classes()).toContain('--expanded')
  expect(item.find('.vex-accordion-item-content').exists()).toBeTruthy()

  // Act
  await trigger.trigger('click')

  // Assert
  expect(item.find('.vex-accordion-content').exists()).toBeFalsy()
})
