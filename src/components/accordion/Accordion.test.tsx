import { mount } from '@vue/test-utils'
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '.'
import { describe, it, expect } from 'vitest'

describe('Accordion', () => {
  it('renders correctly', () => {
    // Arrange
    const wrapper = mount(() => (
      <Accordion class="vex-accordion">
        <AccordionItem class="vex-accordion-item">
          <AccordionTrigger class="vex-accordion-trigger">trigger</AccordionTrigger>
          <AccordionContent class="vex-accordion-content">content</AccordionContent>
        </AccordionItem>
      </Accordion>
    ))

    // Act
    const trigger = wrapper.findComponent(AccordionTrigger)
    const content = wrapper.findComponent(AccordionContent)

    // Assert
    expect(trigger.text()).toContain('trigger')
    expect(content.text()).not.toContain('content')
    expect(wrapper.classes()).toContain('vex-accordion')
  })

  it('renders the correct number of items', () => {
    // Arrange
    const wrapper = mount(() => (
      <Accordion class="vex-accordion">
        <AccordionItem class="vex-accordion-item">
          <AccordionTrigger class="vex-accordion-trigger">trigger 1</AccordionTrigger>
          <AccordionContent class="vex-accordion-content">content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem class="vex-accordion-item">
          <AccordionTrigger class="vex-accordion-trigger">trigger 2</AccordionTrigger>
          <AccordionContent class="vex-accordion-content">content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    ))

    // Assert
    expect(wrapper.findAll('.vex-accordion-item')).toHaveLength(2)
  })

  it('shows/hides the content when clicked', async () => {
    // Arrange
    const wrapper = mount(() => (
      <Accordion class="vex-accordion">
        <AccordionItem class="vex-accordion-item">
          <AccordionTrigger class="vex-accordion-trigger">trigger</AccordionTrigger>
          <AccordionContent class="vex-accordion-content">content</AccordionContent>
        </AccordionItem>
      </Accordion>
    ))

    // Act
    const item = wrapper.findComponent(AccordionItem)

    // Assert
    expect(item.classes()).not.toContain('--expanded')
    expect(item.find('.vex-accordion-content').exists()).toBe(false)

    // Act
    await item.find('.vex-accordion-trigger-button').trigger('click')

    // Assert
    expect(item.classes()).toContain('--expanded')
    expect(item.find('.vex-accordion-content').exists()).toBe(true)

    // Act
    await item.find('.vex-accordion-trigger-button').trigger('click')

    // Assert
    expect(item.classes()).not.toContain('--expanded')
    expect(item.find('.vex-accordion-content').exists()).toBe(false)
  })

  it('sets the proper aria attributes when expanded/collapsed', async () => {
    // Arrange
    const wrapper = mount(() => (
      <Accordion class="vex-accordion">
        <AccordionItem class="vex-accordion-item">
          <AccordionTrigger class="vex-accordion-trigger">trigger 1</AccordionTrigger>
          <AccordionContent class="vex-accordion-content">content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem class="vex-accordion-item">
          <AccordionTrigger class="vex-accordion-trigger">trigger 2</AccordionTrigger>
          <AccordionContent class="vex-accordion-content">content 2</AccordionContent>
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

  it('supports multiple items expansion', async () => {
    // Arrange
    const wrapper = mount(() => (
      <Accordion multiple>
        <AccordionItem class="vex-accordion-item">
          <AccordionTrigger class="vex-accordion-trigger">trigger 1</AccordionTrigger>
          <AccordionContent class="vex-accordion-content">content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem class="vex-accordion-item">
          <AccordionTrigger class="vex-accordion-trigger">trigger 2</AccordionTrigger>
          <AccordionContent class="vex-accordion-content">content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    ))

    // Act
    const [item1, item2] = wrapper.findAllComponents(AccordionItem)

    // Assert
    expect(item1.classes()).not.toContain('--expanded')
    expect(item2.classes()).not.toContain('--expanded')
    expect(item1.find('.vex-accordion-content').exists()).toBe(false)
    expect(item2.find('.vex-accordion-content').exists()).toBe(false)

    // Act
    await item1.find('.vex-accordion-trigger-button').trigger('click')

    // Assert
    expect(item1.classes()).toContain('--expanded')
    expect(item2.classes()).not.toContain('--expanded')
    expect(item1.find('.vex-accordion-content').exists()).toBe(true)
    expect(item2.find('.vex-accordion-content').exists()).toBe(false)

    // Act
    await item2.find('.vex-accordion-trigger-button').trigger('click')

    // Assert
    expect(item1.classes()).toContain('--expanded')
    expect(item2.classes()).toContain('--expanded')
    expect(item1.find('.vex-accordion-content').exists()).toBe(true)
    expect(item2.find('.vex-accordion-content').exists()).toBe(true)

    // Act
    await item1.find('.vex-accordion-trigger-button').trigger('click')

    // Assert
    expect(item1.classes()).not.toContain('--expanded')
    expect(item2.classes()).toContain('--expanded')
    expect(item1.find('.vex-accordion-content').exists()).toBe(false)
    expect(item2.find('.vex-accordion-content').exists()).toBe(true)

    // Act
    await item2.find('.vex-accordion-trigger-button').trigger('click')

    // Assert
    expect(item1.classes()).not.toContain('--expanded')
    expect(item2.classes()).not.toContain('--expanded')
    expect(item1.find('.vex-accordion-content').exists()).toBe(false)
    expect(item2.find('.vex-accordion-content').exists()).toBe(false)
  })
})