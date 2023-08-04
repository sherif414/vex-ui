import { EXPOSED_EL } from '@/config'
import { Fragment, Comment, Text, cloneVNode } from 'vue'

import type { FunctionalComponent, ComponentPublicInstance, VNodeTypes, Ref, VNode } from 'vue'
const INVALID_VNODE_TYPES: VNodeTypes[] = [Fragment, Comment, Text, 'template']

export function useInjectRef(
  templateRef: Ref<HTMLElement | null>,
  slot: () => VNode[] | undefined,
  component: string
): FunctionalComponent {
  const vnode = (): VNode => {
    const vNodes = slot()
    if (!vNodes || vNodes.length !== 1 || INVALID_VNODE_TYPES.includes(vNodes[0].type)) {
      throw new Error(`[vex] <${component}> requires exactly a single root child at all times`)
    }
    return cloneVNode(
      vNodes[0],
      {
        ref: (vm) => (templateRef.value = getElementFromRef(vm, component)),
      },
      true
    )
  }

  return vnode
}

function getElementFromRef(
  vm: ComponentPublicInstance | Element | null,
  component: string
): HTMLElement | null {
  if (vm == null) return null
  if (vm instanceof Element) return vm as HTMLElement
  if (EXPOSED_EL in vm && vm[EXPOSED_EL] instanceof Element) return vm[EXPOSED_EL] as HTMLElement
  if (vm.$el instanceof Element) return vm.$el as HTMLElement

  throw new Error(`[vex] <${component}> received a non Element root child`)
}

// function getValidVNode(vnode: VNode | null){
//   if(vnode == null) return vnode
//   if(typeof vnode.type === 'string' && vnode.type !== 'template') return vnode

//   if(vnode.type === 'template'){
//     return getValidVNode(vnode.children)
//   }
// }
