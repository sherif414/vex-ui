<script setup lang="ts">
import { IconCheck } from '@/icons'
import { TransitionExpand } from '@/transitions'
import { useMemo } from '@/composables'
import { useChipGroupCtx } from './context'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

defineOptions({
  inheritAttrs: false,
})

const p = withDefaults(
  defineProps<{
    /**
     * specifies the chip's unique value.
     */
    value: string
  }>(),
  {}
)

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

defineSlots<{
  default: (props: {}) => any
}>()

//----------------------------------------------------------------------------------------------------

const {
  selected: [getSelected, setSelected],
} = useChipGroupCtx('Chip')

const isChecked = useMemo<boolean>(() =>
  getSelected((v) => (Array.isArray(v) ? v.includes(p.value) : v === p.value))
)
</script>

<template>
  <div
    @click="setSelected(p.value)"
    :class="['vex-chip', isChecked() && '--checked']"
    tabindex="-1"
    v-bind="$attrs"
  >
    <!-- check icon -->

    <TransitionExpand transition-prop="width">
      <IconCheck aria-hidden="true" class="vex-chip-check" v-show="isChecked()" />
    </TransitionExpand>

    <!-- content -->

    <span class="vex-chip-content">
      <slot />
    </span>
  </div>
</template>
