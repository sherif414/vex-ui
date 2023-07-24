<script setup lang="ts">
import { onBeforeUpdate, onMounted, onUpdated, ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    /**
     * whether to automatically add `aria-current="page"`
     * to the last `a` link in the breadcrumb,
     * some routing libraries - like vue-router -
     * already take care of this.
     */
    autoAriaCurrent?: boolean
  }>(),
  {}
)

//----------------------------------------------------------------------------------------------------
// 📌 aria-current
//----------------------------------------------------------------------------------------------------

const BreadcrumbEl = ref<HTMLElement | null>(null)

if (p.autoAriaCurrent) {
  onBeforeUpdate(() => {
    BreadcrumbEl.value?.querySelector('a:last-of-type')?.removeAttribute('aria-current')
  })

  onUpdated(() => {
    BreadcrumbEl.value?.querySelector('a:last-of-type')?.setAttribute('aria-current', 'page')
  })

  onMounted(() => {
    BreadcrumbEl.value?.querySelector('a:last-of-type')?.setAttribute('aria-current', 'page')
  })
}
</script>

<template>
  <div ref="BreadcrumbEl" role="navigation" aria-label="breadcrumb" class="vex-breadcrumb">
    <slot></slot>
  </div>
</template>
