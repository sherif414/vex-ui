<script setup lang="ts">
import { Flex } from '@/components'
import { useResizeObserver, useVModel } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'
import { Tab } from './types'

//===============================================
// 📌 component meta
//===============================================

const props = withDefaults(
  defineProps<{
    /**
     * specifies the array of tabs
     * @default []
     */
    tabs?: Tab[]

    /**
     * specifies the current active tab
     */
    modelValue?: Tab
  }>(),
  {
    tabs: () => [],
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value?: Tab)
}>()

//===============================================
// 📌 events
//===============================================

const activeTab = useVModel(props, 'modelValue', emit)

function handleClick(tab: Tab) {
  activeTab.value = tab
}

//===============================================
// 📌 pointer position & size
//===============================================
const pointerEl = ref<HTMLElement>()
onMounted(() => {
  watch(activeTab, resizePointer, { flush: 'post', immediate: true })
})

const rootEl = ref<HTMLElement | null>(null)
useResizeObserver(rootEl, resizePointer)

function resizePointer() {
  const activeEl =
    pointerEl.value?.parentElement.querySelector<HTMLElement>('.vex-tab-selected')

  if (!activeEl) {
    pointerEl.value.style.width = '0px'
    return
  }

  pointerEl.value.style.left = activeEl.offsetLeft + 'px'
  pointerEl.value.style.width = activeEl.getBoundingClientRect().width + 'px'
}
</script>

<template>
  <Flex ref="rootEl" class="vex-tab-wrapper" align-items="stretch">
    <div
      v-for="tab in props.tabs"
      :key="tab.value"
      :class="['vex-tab', activeTab?.value === tab.value && 'vex-tab-selected']"
      @click="handleClick(tab)"
    >
      {{ tab.label }}
    </div>
    <div ref="pointerEl" class="vex-tab-pointer" />
  </Flex>
</template>
