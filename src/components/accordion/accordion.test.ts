import { mount } from '@vue/test-utils'
import Accordion from './Accordion.vue'
import AccordionItem from './AccordionItem.vue'
import { describe, it, expect } from 'vitest'
import { h } from 'vue'

describe('Accordion', () => {
  it('renders the correct variant class', () => {
    const wrapper = mount(Accordion, {
      props: { variant: 'outline' },
    })

    expect(wrapper.classes()).toContain('vex-accordion-variant-outline')
  })

  it('renders the correct number of items', () => {
    const wrapper = mount(Accordion, {
      slots: {
        default: [
          h(AccordionItem, {
            header: 'Item 1',
            content: 'Content for item 1',
            headingLevel: '3',
          }),
          h(AccordionItem, {
            header: 'Item 2',
            content: 'Content for item 2',
            headingLevel: '3',
          }),
        ],
      },
    })

    expect(wrapper.findAllComponents(AccordionItem)).toHaveLength(2)
  })

  it('expands/collapses items properly', async () => {
    const wrapper = mount(Accordion, {
      slots: {
        default: [
          h(AccordionItem, {
            header: 'Item 1',
            content: 'Content for item 1',
            headingLevel: '3',
          }),
          h(AccordionItem, {
            header: 'Item 2',
            content: 'Content for item 2',
            headingLevel: '3',
          }),
        ],
      },
    })

    const [item1, item2] = wrapper.findAllComponents(AccordionItem)

    expect(item1.find('button').attributes('aria-expanded')).toBe('false')
    expect(item2.find('button').attributes('aria-expanded')).toBe('false')

    await item1.find('.vex-accordion-item-button').trigger('click')
    expect(item1.find('button').attributes('aria-expanded')).toBe('true')
    expect(item2.find('button').attributes('aria-expanded')).toBe('false')

    await item2.find('.vex-accordion-item-button').trigger('click')
    expect(item1.find('button').attributes('aria-expanded')).toBe('false')
    expect(item2.find('button').attributes('aria-expanded')).toBe('true')
  })
})

describe('AccordionItem', () => {
  it('renders the header and content', () => {
    const wrapper = mount(Accordion, {
      slots: {
        default: [
          h(AccordionItem, {
            initiallyExpanded: true,
            header: 'Test header',
            content: 'Test Content',
            headingLevel: '3',
          }),
        ],
      },
    })

    const item = wrapper.findComponent(AccordionItem)

    expect(wrapper.text()).toContain('Test header')
    expect(wrapper.text()).toContain('Test Content')
  })

  it('emits a toggle event when clicked', async () => {
    const wrapper = mount(Accordion, {
      slots: {
        default: [
          h(AccordionItem, {
            header: 'Test header',
            content: 'Test Content',
            headingLevel: '3',
          }),
        ],
      },
    })

    const item = wrapper.findComponent(AccordionItem)

    await item.find('.vex-accordion-item-button').trigger('click')
    expect(item.emitted('toggle')).toBeTruthy()
  })

  it('expands/hides the content when toggled', async () => {
    const wrapper = mount(Accordion, {
      slots: {
        default: [
          h(AccordionItem, {
            header: 'Test header',
            content: 'Test Content',
            headingLevel: '3',
          }),
        ],
      },
    })

    const item = wrapper.findComponent(AccordionItem)

    expect(item.classes()).not.toContain('vex-accordion-item-open')
    expect(item.find('.vex-accordion-item-content').exists()).toBeFalsy()

    await item.find('.vex-accordion-item-button').trigger('click')

    expect(item.classes()).toContain('vex-accordion-item-open')
    expect(item.find('.vex-accordion-item-content').exists()).toBeTruthy()
    expect(
      (item.find('.vex-accordion-item-content').element as HTMLElement).style.display
    ).not.toBe('none')

    await item.find('.vex-accordion-item-button').trigger('click')
    expect(
      (item.find('.vex-accordion-item-content').element as HTMLElement).style.display
    ).toBe('none')
  })
})
