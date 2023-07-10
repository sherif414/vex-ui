import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Button from './Button.vue'

describe('Button', () => {
  it('renders properly', () => {
    const wrapper = mount(Button, { slots: { default: 'content' } })
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.classes()).toContain('vex-button')
    expect(wrapper.text()).toBe('content')
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

  it('destructive button', () => {
    const wrapper = mount(Button, { props: { destructive: true } })
    expect(wrapper.classes()).toContain('vex-button-destructive')
  })

  it('disabled state', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBe('')
  })

  it('icon-only', () => {
    const wrapper = mount(Button, { props: { iconOnly: true } })
    expect(wrapper.classes()).toContain('vex-button-icon-only')
  })

  it('loading state', () => {
    const button = mount(Button, { props: { loading: true } })
    expect(button.classes()).toContain('vex-button-loading')
  })
})
