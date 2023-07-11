<script setup lang="ts">
import { Loader } from '@/components'
import { computed } from 'vue'

//==================================================
// 📌 component meta
//==================================================

const p = withDefaults(
  defineProps<{
    /**
     * whether the button is loading, shows a loading spinner and
     * disables click events.
     */
    loading?: boolean

    /**
     * disables the button and click events
     */
    disabled?: boolean

    /**
     * specifies the button variant
     * @default 'filled'
     */
    variant?: 'text' | 'filled' | 'outline' | 'light'

    /**
     * whether the button indicates a destructive action,
     * note that this only changes how the button looks,
     * not its behavior
     */
    destructive?: boolean

    /**
     * renders a smaller button
     */
    compact?: boolean

    /**
     * transforms the button into an icon-button
     */
    iconOnly?: boolean
  }>(),
  {
    variant: 'filled',
  }
)

const emit = defineEmits<{
  (e: 'click', event: Event): void
}>()

//==================================================
// 📌 classes
//==================================================

const classes = computed(() => [
  'vex-button',
  `--variant-${p.variant}`,
  {
    '--icon-only': p.iconOnly,
    '--compact': p.compact,
    '--loading': p.loading,
    '--destructive': p.destructive,
  },
])

//==================================================
// 📌 event handlers
//==================================================

function onClick(e: Event) {
  if (p.disabled || p.loading) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <button
    @click="onClick"
    :disabled="p.disabled"
    :aria-disabled="p.disabled || p.loading || undefined"
    :class="classes"
  >
    <Loader
      role="progressbar"
      aria-valuetext="loading"
      style="position: absolute"
      v-if="p.loading"
    />
    <span class="vex-button-content">
      <slot />
    </span>
  </button>
</template>

<style lang="scss">
.vex-button {
  appearance: none;
  position: relative;
  padding: 0;
  padding-inline: var(--vex-spacing-4);
  height: 2.5rem;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  outline: 2px solid transparent;
  border-radius: var(--vex-border-radius-md);
  cursor: pointer;
  line-height: 1;
  font-family: inherit;
  font-weight: 500;
  font-size: var(--vex-font-size-sm);
  transition-property: background, color;
  transition-duration: 150ms;
  transition-timing-function: var(--vex-transition-easing);
  white-space: nowrap;
  text-transform: capitalize;
  -webkit-tap-highlight-color: transparent;

  &:disabled {
    cursor: not-allowed;
    background-color: var(--vex-clr-disabled) !important;
    color: var(--vex-clr-on-disabled) !important;
    border: none !important;
  }

  &:focus-visible {
    outline-color: var(--vex-clr-primary-400);
  }

  &-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    gap: var(--vex-spacing-2);
  }

  &.--loading {
    cursor: default;
    .vex-button-content {
      visibility: hidden;
    }
  }

  &.--compact {
    height: 2rem;
    font-size: var(--vex-font-size-xs);
    padding-inline: var(--vex-spacing-3);
  }

  &.--icon-only {
    aspect-ratio: 1/1;
    padding-inline: 0 !important;
  }
}

// normal button

.vex-button.--variant-filled {
  background-color: var(--vex-clr-primary-400);
  color: white;
  outline-offset: 2px;
  border: none;

  &:not([aria-disabled='true']):active {
    background-color: var(--vex-clr-primary-500);
  }
}

.vex-button.--variant-light {
  background-color: var(--vex-clr-primary-200);
  color: var(--vex-clr-on-primary-500);
  border: none;

  &:not([aria-disabled='true']):active {
    background-color: var(--vex-clr-primary-300);
  }
}

.vex-button.--variant-outline {
  background-color: transparent;
  color: var(--vex-clr-primary-400);
  border: 1px solid var(--vex-border-clr-base);

  &:not([aria-disabled='true']):hover {
    background-color: var(--vex-clr-primary-100);
  }

  &:not([aria-disabled='true']):active {
    background-color: var(--vex-clr-primary-200);
  }
}

.vex-button.--variant-text {
  background-color: transparent;
  color: var(--vex-clr-primary-400);
  border: none;

  &:not([aria-disabled='true']):hover {
    background-color: var(--vex-clr-primary-100);
  }

  &:not([aria-disabled='true']):active {
    background-color: var(--vex-clr-primary-200);
  }
}

// destructive button

.vex-button.--destructive {
  &:focus-visible {
    outline-color: var(--vex-clr-danger-400);
  }

  &.--variant-filled {
    background-color: var(--vex-clr-danger-400);
    color: white;
    outline-offset: 2px;
    border: none;

    &:not([aria-disabled='true']):active {
      background-color: var(--vex-clr-danger-500);
    }
  }

  &.--variant-light {
    background-color: var(--vex-clr-danger-200);
    color: var(--vex-clr-danger-500);
    border: none;

    &:not([aria-disabled='true']):active {
      background-color: var(--vex-clr-danger-300);
    }
  }

  &.--variant-outline {
    background-color: transparent;
    color: var(--vex-clr-danger-400);
    border: 1px solid var(--vex-border-clr-base);

    &:not([aria-disabled='true']):hover {
      background-color: var(--vex-clr-danger-100);
    }

    &:not([aria-disabled='true']):active {
      background-color: var(--vex-clr-danger-200);
    }
  }

  &.--variant-text {
    background-color: transparent;
    color: var(--vex-clr-danger-400);
    border: none;

    &:not([aria-disabled='true']):hover {
      background-color: var(--vex-clr-danger-100);
    }

    &:not([aria-disabled='true']):active {
      background-color: var(--vex-clr-danger-200);
    }
  }
}
</style>
