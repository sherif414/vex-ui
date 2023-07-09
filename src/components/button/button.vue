<script setup lang="ts">
import { Loader } from '../loader'
import { computed, getCurrentScope, onMounted, onUpdated } from 'vue'

/**********************************
 * 📌 component meta
 ***********************************/

const props = withDefaults(
  defineProps<{
    /**
     * whether the button is loading, shows a loading spinner and
     * disables click events
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
     * specifies the button size
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg'

    /**
     * specifies the button type attribute
     * @default 'button'
     */
    type?: 'submit' | 'button' | 'reset'

    /**
     * transforms the button into an icon-button
     */
    iconOnly?: boolean
  }>(),
  {
    size: 'md',
    variant: 'filled',
    type: 'button',
  }
)

const emit = defineEmits<{
  (e: 'click', event: Event): void
}>()

/**********************************
 * 📌 classes & styles
 ***********************************/

const classes = computed(() => [
  'vex-button',
  `vex-button-variant-${props.variant}`,
  `vex-button-size-${props.size}`,
  props.destructive ? 'vex-button-destructive' : 'vex-button-primary',
  {
    'vex-button-icon-only': props.iconOnly,
  },
])

/**********************************
 * 📌 events
 ***********************************/

function handleClick(e: Event) {
  if (props.disabled || props.loading) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<template>
  <button
    @click="handleClick"
    :disabled="props.disabled"
    :aria-disabled="props.disabled || props.loading"
    :type="props.type"
    :class="classes"
  >
    <Loader style="position: absolute" v-if="props.loading" />
    <div :class="[props.loading && 'vex-button-loading', 'vex-button-content']">
      <slot />
    </div>
  </button>
</template>

<style lang="scss">
.vex-button {
  position: relative;
  padding: 0;
  overflow: hidden;
  appearance: none;
  font-family: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  outline: 2px solid transparent;
  border-radius: var(--vex-border-radius-md);
  cursor: pointer;
  line-height: 1;
  font-weight: 500;
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

  &-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &-loading {
    opacity: 0;
  }

  &-icon-only {
    aspect-ratio: 1/1;
    padding-inline: 0 !important;
  }
}

// sizes

.vex-button-size-sm {
  height: 2rem;
  font-size: var(--vex-font-size-xs);
  padding-inline: var(--vex-spacing-3);

  .vex-button-content {
    gap: var(--vex-spacing-2);
  }
}

.vex-button-size-md {
  height: 2.5rem;
  font-size: var(--vex-font-size-sm);
  padding-inline: var(--vex-spacing-4);

  .vex-button-content {
    gap: var(--vex-spacing-2);
  }
}

.vex-button-size-lg {
  height: 3rem;
  font-size: var(--vex-font-size-md);
  padding-inline: var(--vex-spacing-6);

  .vex-button-content {
    gap: var(--vex-spacing-3);
  }
}

// primary button

.vex-button-primary {
  &:focus-visible {
    outline-color: var(--vex-clr-primary-400);
  }

  &.vex-button-variant-filled {
    background-color: var(--vex-clr-primary-400);
    color: white;
    outline-offset: 2px;
    border: none;

    &:enabled:active {
      background-color: var(--vex-clr-primary-500);
    }
  }

  &.vex-button-variant-light {
    background-color: var(--vex-clr-primary-200);
    color: var(--vex-clr-on-primary-500);
    border: none;

    &:enabled:hover {
      background-color: var(--vex-clr-primary-300);
    }
  }

  &.vex-button-variant-outline {
    background-color: transparent;
    color: var(--vex-clr-primary-400);
    border: 1px solid var(--vex-border-clr-base);

    &:enabled:hover {
      background-color: var(--vex-clr-primary-100);
    }

    &:enabled:active {
      background-color: var(--vex-clr-primary-200);
    }
  }

  &.vex-button-variant-text {
    background-color: transparent;
    color: var(--vex-clr-primary-400);
    border: none;

    &:enabled:hover {
      background-color: var(--vex-clr-primary-100);
    }

    &:enabled:active {
      background-color: var(--vex-clr-primary-200);
    }
  }
}

// destructive button

.vex-button-destructive {
  &:focus-visible {
    outline-color: var(--vex-clr-danger-400);
  }

  &.vex-button-variant-filled {
    background-color: var(--vex-clr-danger-400);
    color: white;
    outline-offset: 2px;
    border: none;

    &:enabled:active {
      background-color: var(--vex-clr-danger-500);
    }
  }

  &.vex-button-variant-light {
    background-color: var(--vex-clr-danger-200);
    color: var(--vex-clr-danger-500);
    border: none;

    &:enabled:hover {
      background-color: var(--vex-clr-danger-300);
    }
  }

  &.vex-button-variant-outline {
    background-color: transparent;
    color: var(--vex-clr-danger-400);
    border: 1px solid var(--vex-border-clr-base);

    &:enabled:hover {
      background-color: var(--vex-clr-danger-100);
    }

    &:enabled:active {
      background-color: var(--vex-clr-danger-200);
    }
  }

  &.vex-button-variant-text {
    background-color: transparent;
    color: var(--vex-clr-danger-400);
    border: none;

    &:enabled:hover {
      background-color: var(--vex-clr-danger-100);
    }

    &:enabled:active {
      background-color: var(--vex-clr-danger-200);
    }
  }
}
</style>
