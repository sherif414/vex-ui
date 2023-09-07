import { computed, defineComponent, h, type InjectionKey, type Ref, type SlotsType } from 'vue'
import { useSelectionScope, useContext, useID } from '@/composables'
import { provide, ref, watch } from 'vue'
import type { Getter } from '@/types'
import { isArray } from '@/composables/helpers'
import type { Setter } from '@/types'
import { computedEager } from '@vueuse/core'

const ACCORDION_INJECTION_KEY = Symbol() as InjectionKey<{
  setExpanded: (value: string) => void
  expanded: Ref<string | string[] | undefined>
}>

function useAccordionCtx(component: string) {
  return useContext(ACCORDION_INJECTION_KEY, 'Accordion', component)
}

const ACCORDION_ITEM_INJECTION_KEY = Symbol() as InjectionKey<{
  contentID: string
  triggerID: string
  disabled: Getter<boolean>
  isExpanded: Ref<boolean>
  setExpanded: Setter<string>
}>

function useAccordionItemCtx(component: string) {
  return useContext(ACCORDION_ITEM_INJECTION_KEY, 'AccordionItem', component)
}

//----------------------------------------------------------------------------------------------------
// 📌 accordion
//----------------------------------------------------------------------------------------------------

const Accordion = defineComponent({
  setup(props, { slots }) {
    const { selected, setSelected, resetSelected } = useSelectionScope<string>(
      ref(props.multiple ? [] : undefined),
      {
        multiselect: () => props.multiple!,
        deselection: () => true,
      }
    )

    watch(() => props.multiple, resetSelected)

    provide(ACCORDION_INJECTION_KEY, {
      expanded: selected,
      setExpanded: setSelected,
    })

    return () => h('div', null, slots.default?.())
  },

  props: {
    multiple: Boolean,
  },
})

//----------------------------------------------------------------------------------------------------
// 📌 Accordion Item
//----------------------------------------------------------------------------------------------------

export interface AccordionItemProps {
  /**
   * expands the item and prevents it from being collapsed
   */
  alwaysExpanded?: boolean

  /**
   * expands the item on the first render
   */
  initiallyExpanded?: boolean

  /**
   * prevents the item from being collapsed/expanded
   */
  disabled?: boolean
}

const AccordionItem = defineComponent({
  setup(p, { slots }) {
    const { expanded, setExpanded } = useAccordionCtx('AccordionItem')

    const contentID = useID()
    const triggerID = useID()

    if (p.initiallyExpanded) {
      setExpanded(triggerID)
    }

    const isExpanded = computedEager<boolean>(() => {
      if (p.alwaysExpanded) return true

      const _expanded = expanded.value
      return isArray(_expanded) ? _expanded.includes(triggerID) : _expanded === triggerID
    })

    provide(ACCORDION_ITEM_INJECTION_KEY, {
      contentID,
      triggerID,
      setExpanded,
      isExpanded,
      disabled: () => p.disabled!,
    })

    return () =>
      h(
        'div',
        {
          class: { '--expanded': isExpanded.value },
        },
        slots.default?.({ expanded: isExpanded.value })
      )
  },

  props: {
    alwaysExpanded: Boolean,
    initiallyExpanded: Boolean,
    disabled: Boolean,
  },
  slots: Object as SlotsType<{
    default: { expanded: boolean }
  }>,
})

//----------------------------------------------------------------------------------------------------
// 📌 AccordionTrigger
//----------------------------------------------------------------------------------------------------

const AccordionTrigger = defineComponent({
  setup(_, { slots }) {
    const { setExpanded, contentID, isExpanded, triggerID, disabled } =
      useAccordionItemCtx('AccordionTrigger')

    return () =>
      h(
        'button',
        {
          id: triggerID,
          disabled: disabled(),
          onClick: () => setExpanded(triggerID),
          'aria-controls': contentID,
          'aria-expanded': isExpanded.value,
        },
        slots.default?.()
      )
  },
})

//----------------------------------------------------------------------------------------------------
// 📌 AccordionContent
//----------------------------------------------------------------------------------------------------

const AccordionContent = defineComponent({
  setup(_, { slots }) {
    const { contentID, triggerID } = useAccordionItemCtx('AccordionContent')

    return () =>
      h(
        'div',
        {
          id: contentID,
          role: 'region',
          'aria-labelledby': triggerID,
        },
        slots.default?.()
      )
  },
})

//----------------------------------------------------------------------------------------------------

type Accordion = InstanceType<typeof Accordion>
type AccordionItem = InstanceType<typeof AccordionItem>
type AccordionTrigger = InstanceType<typeof AccordionTrigger>
type AccordionContent = InstanceType<typeof AccordionContent>

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  //
}
