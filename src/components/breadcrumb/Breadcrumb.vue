<script setup lang="ts">
import { onBeforeUpdate, onMounted, onUpdated, ref } from 'vue'

//==================================================
// 📌 component meta
//==================================================

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

//==================================================
// 📌 aria-current
//==================================================

const rootEl = ref<HTMLElement | null>(null)

if (p.autoAriaCurrent) {
  onBeforeUpdate(() => {
    rootEl.value?.querySelector('a:last-of-type')?.removeAttribute('aria-current')
  })

  onUpdated(() => {
    rootEl.value?.querySelector('a:last-of-type')?.setAttribute('aria-current', 'page')
  })

  onMounted(() => {
    rootEl.value?.querySelector('a:last-of-type')?.setAttribute('aria-current', 'page')
  })
}
</script>

<template>
  <div ref="rootEl" role="navigation" aria-label="breadcrumb" class="vex-breadcrumb">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.vex-breadcrumb {
  display: flex;
  align-items: center;

  & a {
    text-decoration: none;
  }

  & > *:last-child {
    color: var(--vex-clr-primary-400);
  }

  & > *:not(:last-child) {
    color: var(--vex-on-surface-muted);

    &::after {
      content: '/';
      font-size: var(--vex-font-size-sm);
      margin-inline: var(--vex-spacing-4);
      pointer-events: none;
    }
  }
}
</style>
