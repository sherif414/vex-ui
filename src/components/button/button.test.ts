import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Button from './Button.vue'

describe('Button', () => {
  it('renders with default props', () => {
    const wrapper = mount(Button)
    expect(wrapper.exists()).toBeTruthy()

    expect(wrapper.classes()).toEqual([
      'vex-button',
      'vex-button-variant-filled',
      'vex-button-size-md',
      'vex-button-primary',
    ])
  })

  it('emits a click event when clicked without an event handler', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')

    expect(wrapper.emitted('click')?.length).toBeTruthy()
  })

  it('emits a click event when clicked with an event handler', async () => {
    const wrapper = mount(Button, { props: { onClick: () => {} } })
    await wrapper.trigger('click')

    expect(wrapper.emitted('click')?.length).toBeTruthy()
  })

  it('shows a destructive button when using `destructive` prop', () => {
    const wrapper = mount(Button, { destructive: true })
    expect(wrapper.classes()).toContain('vex-button-destructive')
  })

  it('disables the button when the `disabled` prop is set', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.attributes('disabled')).toBe('')
  })

  it('displays a loading spinner when the `loading` prop is set', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    })

    expect(wrapper.find('.vex-button-loading').exists()).toBe(true)
  })

  it('applies the correct classes when the `iconOnly` prop is set', () => {
    const wrapper = mount(Button, {
      props: {
        iconOnly: true,
      },
      slots: {
        default: '<i class="fa fa-plus"></i>',
      },
    })

    expect(wrapper.classes()).toContain('vex-button-icon-only')
    expect(wrapper.find('i.fa.fa-plus').exists()).toBe(true)
  })
})
