<script setup lang="ts">
import { IconArrowDown } from '@/icons'
import { ref } from 'vue'
import {
  Accordion,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from '../components/accordion'
import { TransitionExpand } from '@/transitions'

const expanded = ref()
</script>

<template>
  <Accordion v-model="expanded">
    <AccordionItem v-for="i in 3" :key="i" :value="`item ${i}`" #="{ isExpanded }">
      <AccordionItemTrigger>
        accordion header
        <IconArrowDown aria-hidden="true" class="vex-accordion-chevron" />
      </AccordionItemTrigger>

      <TransitionExpand :duration="750">
        <AccordionItemContent v-show="isExpanded">
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis iusto fuga possimus
            dolor! Officiis, natus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui
            vitae fugit hic, quidem, recusandae sint officia illo vel aliquid, nemo vero est
            molestiae expedita. Necessitatibus neque quod voluptatum suscipit eveniet. Lorem ipsum
            dolor sit amet, consectetur adipisicing elit. Corrupti vero expedita omnis, minus
            impedit, inventore minima, sint repellendus asperiores quam excepturi eum ratione
            doloremque natus corporis velit quibusdam nam earum!
          </div>
        </AccordionItemContent>
      </TransitionExpand>
    </AccordionItem>
  </Accordion>
</template>

<style lang="scss">
.vex-accordion {
  display: flex;
  flex-direction: column;
  color: var(--vex-c-neutral-900);
  border-radius: var(--vex-border-radius-sm);
}

//------ item ------//

.vex-accordion-item {
  display: flex;
  flex-direction: column;
  border-radius: var(--vex-border-radius-sm);
  transition: all 150ms ease;
  border-bottom: 1px solid var(--vex-c-neutral-200);
}

//------ trigger ------//

.vex-accordion-item-trigger {
  font-size: var(--vex-font-size-sm);
  border-radius: var(--vex-border-radius-sm);

  &-button {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: var(--vex-spacing-2);
    width: 100%;
    padding: var(--vex-spacing-3) var(--vex-spacing-4);
    border-radius: inherit;

    &:focus-visible {
      outline: 1px solid var(--vex-c-primary-500);
    }
  }
}

//------ content ------//

.vex-accordion-item-content {
  will-change: height;
  font-size: var(--vex-font-size-sm);

  & > div {
    padding: var(--vex-spacing-1) var(--vex-spacing-4) var(--vex-spacing-3) var(--vex-spacing-4);
    max-height: 200px;
    overflow-y: auto;
  }
}

//------ chevron ------//

.vex-accordion-chevron {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-inline-start: auto;
  transition: transform 300ms var(--vex-transition-easing);

  .vex-accordion-item.--expanded & {
    transform: rotate(180deg);
  }
}
</style>
