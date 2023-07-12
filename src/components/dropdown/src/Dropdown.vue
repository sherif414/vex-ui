<script lang="ts" setup>
import type { Placement } from '@floating-ui/vue'
import { useEventListener } from '@vueuse/core'
import { computed, nextTick, ref, toRef, watch } from 'vue'
import { Floating } from '@/components'
import { getRandomString } from '@/composables/helpers'

//===============================================
// 📌 component meta
//===============================================

const p = withDefaults(
  defineProps<{
    /**
     * should the dropdown be triggered by click or mouse hover
     * @default 'click'
     */
    trigger?: 'hover' | 'click'

    /**
     * specifies the dropdown placement relative to the reference element
     * @default 'bottom-start'
     */
    placement?: Placement

    /**
     * the dropdown will be positioned relative to this element.
     * note that if this is `undefined` - only undefined and not null -
     * the el.previousElement will be used
     * @default defaults to element.previousElement
     */
    referenceEl?: HTMLElement | null

    /**
     * whether to disable the dropdown.
     */
    disabled?: boolean

    /**
     * whether to hide the dropdown when clicked
     * @default true
     */
    hideOnClick?: boolean

    /**
     * whether to render the arrow
     */
    withArrow?: boolean

    /**
     * role
     */
    role?: 'menu' | 'listbox'
    id: string
    ariaLabelledby: string
  }>(),
  {
    trigger: 'click',
    placement: 'bottom-start',
    hideOnClick: true,
    role: 'menu',
  }
)

//===============================================
// 📌 positioning & visibility
//===============================================

// currently there is no way for the dropdown to know if the referenceEl
// is removed from the dom, if you have to remove the referenceEL and
// readd it prefer removing both the referenceEl and the dropdown
const anchor = ref<HTMLElement>()
const _referenceEl =
  p.referenceEl === undefined
    ? computed(() => anchor.value?.previousElementSibling as HTMLElement)
    : toRef(() => p.referenceEl)

const isDropdownVisible = ref(false)

function updateVisibility(value: boolean) {
  isDropdownVisible.value = value
}

function onClick() {
  if (p.hideOnClick) nextTick(() => updateVisibility(false))
}

//==================================================
// 📌 aria attributes
//==================================================

watch(isDropdownVisible, (val) => {
  if (_referenceEl.value) _referenceEl.value.ariaExpanded = `${val}`
})

watch(_referenceEl, (el) => {
  if (el) {
    el.ariaExpanded = `${isDropdownVisible.value}`
    el.ariaHasPopup = p.role
  }
})
//===============================================
// 📌 focus management
//===============================================

const floatingInstance = ref<InstanceType<typeof Floating> | null>(null)

useEventListener(_referenceEl, 'keydown', (e: KeyboardEvent) => {
  if (e.shiftKey || e.altKey || e.ctrlKey) return

  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    updateVisibility(true)
    focusFirstChild()
  }

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    updateVisibility(true)
    focusFirstChild()
  }
})

function focusFirstChild() {
  // because we use v-show.lazy, children may not be available
  // on initial render.
  nextTick(() => {
    ;(floatingInstance.value?.floatingEl as HTMLElement)?.focus()
  })
}

defineExpose({
  isDropdownVisible,
  floatingInstance,
})
</script>

<template>
  <span style="display: none" ref="anchor" />
  <Floating
    ref="floatingInstance"
    @keydown.esc.exact="updateVisibility(false)"
    @update:visible="updateVisibility"
    @click="onClick"
    :visible="p.disabled ? false : isDropdownVisible"
    :trigger="p.trigger"
    :reference="_referenceEl"
    :placement="p.placement"
    :offset="p.withArrow ? 6 : 4"
    :arrow="p.withArrow"
    :id="p.id"
    :aria-labelledby="p.ariaLabelledby"
    :role="p.role"
    tabindex="-1"
    v-bind="$attrs"
    class="vex-dropdown"
    transition="vex-fade"
  >
    <slot />
  </Floating>
</template>
