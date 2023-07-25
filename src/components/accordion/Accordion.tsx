import { useID, useListNavigation, useListSelection } from '@/composables'
import { IconArrowDown } from '@/icons'
import { IAdd } from 'iconsax-vue/linear'
import { TransitionExpand } from '@/transitions'
import {
  type ExtractPropTypes,
  type InjectionKey,
  type PropType,
  type Ref,
  type SetupContext,
} from 'vue'
import { computed, defineComponent, inject, provide, ref } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 Accordion
//----------------------------------------------------------------------------------------------------

const AccordionProps = {
  /**
   * whether to allow multiple accordion-items to be expanded at the same time
   */
  multiple: Boolean,

  /**
   * specifies the accordion variant, which changes how the accordion looks
   * @default 'default'
   */
  variant: {
    type: String as PropType<'outline' | 'ladder' | 'default' | 'light'>,
    default: 'default',
  },
}

type AccordionProps = ExtractPropTypes<typeof AccordionProps>
type ExpandedItems = string | string[] | undefined

const ACCORDION_CTX = Symbol() as InjectionKey<{
  setExpanded: (val: string) => void
  expandedItems: Ref<ExpandedItems>
  getIndex: () => string
}>

//----------------------------------------------------------------------------------------------------

const AccordionImpl = (p: AccordionProps, { slots }: SetupContext) => {
  const CHILDREN_SELECTOR = '.vex-accordion-item-trigger-button:enabled'
  const { onKeydown } = useListNavigation(CHILDREN_SELECTOR, true)

  const expandedItems = ref<ExpandedItems>()
  const { setSelected: setExpanded } = useListSelection(expandedItems, () => p.multiple, {
    DeSelectOnReSelect: true,
  })

  let count = 0
  provide(ACCORDION_CTX, {
    setExpanded: setExpanded,
    expandedItems,
    getIndex: () => `item:${count++}`,
  })

  return () => (
    <div class={['vex-accordion', `--variant-${p.variant}`]} onKeydown={onKeydown}>
      {slots.default?.()}
    </div>
  )
}
/**
 * demo title
 */
export const Accordion = defineComponent({ setup: AccordionImpl, props: AccordionProps })
export type Accordion = InstanceType<typeof Accordion>

//----------------------------------------------------------------------------------------------------
// 📌 Accordion Item
//----------------------------------------------------------------------------------------------------

const AccordionItemProps = {
  /**
   * expands the item and prevents it from being collapsed
   */
  alwaysExpanded: Boolean,
}
type AccordionItemProps = ExtractPropTypes<typeof AccordionItemProps>

const ACCORDION_ITEM_CTX = Symbol() as InjectionKey<{
  contentID: string
  triggerID: string
  isExpanded: Ref<boolean>
  setExpanded: (val: string) => void
  index: string
}>

//----------------------------------------------------------------------------------------------------

const AccordionItemImpl = (p: AccordionItemProps, { slots }: SetupContext) => {
  const ctx = inject(ACCORDION_CTX, null)
  if (!ctx) {
    throw new Error('[vex] <AccordionItem> is missing an <Accordion> parent component.')
  }
  const { expandedItems, getIndex, setExpanded } = ctx

  const index = getIndex()
  const isExpanded = computed<boolean>(() => {
    if (p.alwaysExpanded) return true
    return Array.isArray(expandedItems.value)
      ? expandedItems.value.includes(index)
      : expandedItems.value === index
  })

  provide(ACCORDION_ITEM_CTX, {
    contentID: useID(),
    triggerID: useID(),
    index,
    setExpanded,
    isExpanded,
  })

  return () => (
    <div class={['vex-accordion-item', isExpanded.value && '--expanded']}>{slots.default?.()}</div>
  )
}

export const AccordionItem = defineComponent({
  setup: AccordionItemImpl,
  props: AccordionItemProps,
})
export type AccordionItem = InstanceType<typeof AccordionItem>

//----------------------------------------------------------------------------------------------------
// 📌 Accordion Header
//----------------------------------------------------------------------------------------------------

const AccordionTriggerProps = {
  /**
   * prevents the item from being collapsed/expanded
   */
  disabled: Boolean,
}
type AccordionTriggerProps = ExtractPropTypes<typeof AccordionTriggerProps>

//----------------------------------------------------------------------------------------------------

const AccordionTriggerImpl = (p: AccordionTriggerProps, { slots }: SetupContext) => {
  const ctx = inject(ACCORDION_ITEM_CTX, null)
  if (!ctx) {
    throw new Error('[vex] <AccordionTrigger> is missing an <AccordionItem> parent component.')
  }
  const { setExpanded, contentID, isExpanded, triggerID, index } = ctx

  return () => (
    <h3 class="vex-accordion-item-trigger">
      <button
        class="vex-accordion-item-trigger-button"
        onClick={() => setExpanded(index)}
        aria-expanded={isExpanded.value}
        aria-controls={contentID}
        disabled={p.disabled}
        id={triggerID}
      >
        {slots.default?.()}
        <IAdd class="vex-accordion-item-trigger-button-chevron" />
      </button>
    </h3>
  )
}

export const AccordionTrigger = defineComponent({
  setup: AccordionTriggerImpl,
  props: AccordionTriggerProps,
})
export type AccordionTrigger = InstanceType<typeof AccordionTrigger>

//----------------------------------------------------------------------------------------------------
// 📌 Accordion Content
//----------------------------------------------------------------------------------------------------

const AccordionContentImpl = (p: {}, { slots }: SetupContext) => {
  const ctx = inject(ACCORDION_ITEM_CTX, null)
  if (!ctx) {
    throw new Error('[vex] <AccordionContent> is missing an <AccordionItem> parent component.')
  }
  const { contentID, isExpanded, triggerID } = ctx

  return () => (
    <TransitionExpand>
      {isExpanded.value && (
        <div
          class="vex-accordion-item-content"
          aria-labelledby={triggerID}
          role="region"
          id={contentID}
        >
          <div>{slots.default?.()}</div>
        </div>
      )}
    </TransitionExpand>
  )
}

export const AccordionContent = defineComponent({ setup: AccordionContentImpl })
export type AccordionContent = InstanceType<typeof AccordionContent>
