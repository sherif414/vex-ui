import {
  createCollection,
  useCollection,
  useContext,
  useID,
  useMemo,
  useRovingFocus,
  useSelect,
  useSignal,
  useTemplateRef,
} from '@/composables'
import { TransitionExpand } from '@/transitions'
import type { ComputableGetter, Getter, Orientation, Setter } from '@/types'
import { PlusIcon } from '@heroicons/vue/20/solid'
import type { InjectionKey, PropType } from 'vue'
import { defineComponent, provide } from 'vue'

//----------------------------------------------------------------------------------------------------
// 📌 Accordion
//----------------------------------------------------------------------------------------------------

const AccordionProps = {
  /**
   * whether to allow multiple accordion-items to be expanded at the same time
   */
  multiple: Boolean,
  /**
   * specifies the accordion variant.
   * @default 'default'
   */
  variant: {
    type: String as PropType<'outline' | 'ladder' | 'default' | 'light'>,
    default: 'default',
  },
  /**
   * sets the accordion orientation, mainly used for keyboard navigation.
   */
  orientation: {
    type: String as PropType<Orientation>,
    default: 'vertical',
  },
}

type ExpandedItems = string | string[] | undefined

const ACCORDION_CTX = Symbol() as InjectionKey<{
  expanded: [ComputableGetter<ExpandedItems>, Setter<string>]
}>

function useAccordionCtx(component: string) {
  return useContext(ACCORDION_CTX, 'Accordion', component)
}

//----------------------------------------------------------------------------------------------------

export const Accordion = defineComponent({
  setup(p, { slots }) {
    const [getAccordionEl, setAccordionEl] = useTemplateRef('Accordion')
    const { elements } = createCollection(getAccordionEl)

    useRovingFocus(getAccordionEl, elements, {
      orientation: () => p.orientation,
    })

    const expanded = useSelect(useSignal<ExpandedItems>(undefined), {
      multiselect: () => p.multiple,
      deselection: () => true,
    })

    provide(ACCORDION_CTX, {
      expanded,
    })

    return () => (
      <div ref={setAccordionEl} class={['vex-accordion', `--variant-${p.variant}`]}>
        {slots.default?.()}
      </div>
    )
  },
  props: AccordionProps,
  name: 'Accordion',
})
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

const ACCORDION_ITEM_CTX = Symbol() as InjectionKey<{
  contentID: string
  triggerID: string
  isExpanded: Getter<boolean>
  setExpanded: Setter<string>
}>

function useAccordionItemCtx(component: string) {
  return useContext(ACCORDION_ITEM_CTX, 'AccordionItem', component)
}

//----------------------------------------------------------------------------------------------------

export const AccordionItem = defineComponent({
  setup(p, { slots }) {
    const {
      expanded: [getExpanded, setExpanded],
    } = useAccordionCtx('AccordionItem')

    const contentID = useID()
    const triggerID = useID()

    const isExpanded = useMemo<boolean>(() => {
      if (p.alwaysExpanded) return true
      return getExpanded((v) => (Array.isArray(v) ? v.includes(triggerID) : v === triggerID))
    })

    provide(ACCORDION_ITEM_CTX, {
      contentID,
      triggerID,
      setExpanded,
      isExpanded,
    })

    return () => (
      <div class={['vex-accordion-item', { '--expanded': isExpanded() }]}>{slots.default?.()}</div>
    )
  },
  props: AccordionItemProps,
  name: 'AccordionItem',
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

//----------------------------------------------------------------------------------------------------

export const AccordionTrigger = defineComponent({
  setup(p, { slots }) {
    const { setExpanded, contentID, isExpanded, triggerID } =
      useAccordionItemCtx('AccordionTrigger')

    const [getTriggerEl, setTriggerEl] = useTemplateRef('AccordionItem')
    useCollection({ id: triggerID, disabled: () => p.disabled, ref: getTriggerEl })

    return () => (
      <h3 class="vex-accordion-trigger">
        <button
          ref={setTriggerEl}
          class="vex-accordion-trigger-button"
          onClick={() => setExpanded(triggerID)}
          aria-expanded={isExpanded()}
          aria-controls={contentID}
          disabled={p.disabled}
          id={triggerID}
        >
          {slots.default?.()}
          <PlusIcon class="vex-accordion-trigger-button-chevron" />
        </button>
      </h3>
    )
  },
  props: AccordionTriggerProps,
  name: 'AccordionTrigger',
})
export type AccordionTrigger = InstanceType<typeof AccordionTrigger>

//----------------------------------------------------------------------------------------------------
// 📌 Accordion Content
//----------------------------------------------------------------------------------------------------

export const AccordionContent = defineComponent({
  setup(_, { slots, attrs }) {
    const { contentID, isExpanded, triggerID } = useAccordionItemCtx('AccordionContent')

    return () => (
      <TransitionExpand>
        {isExpanded() && (
          <div
            {...attrs}
            class="vex-accordion-content"
            aria-labelledby={triggerID}
            role="region"
            id={contentID}
          >
            <div>{slots.default?.()}</div>
          </div>
        )}
      </TransitionExpand>
    )
  },
  inheritAttrs: false,
  name: 'AccordionContent',
})
export type AccordionContent = InstanceType<typeof AccordionContent>
