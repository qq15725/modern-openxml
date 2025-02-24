import type { OOXMLNode } from '../core'
import { namespaces } from '../namespaces'
import { withAttr, withAttrs } from '../utils'

export interface Transition {
  transition?: {
    name?: string
    speed?: 'slow' | 'med' | 'fast'
    duration?: number
    attrs: Record<string, string>
  }
}

export function parseTransition(node: OOXMLNode | undefined): Transition | undefined {
  if (!node)
    return undefined
  const choice = node.find('mc:Choice')
  const choiceRequires = choice?.attr('@Requires')
  let transition = choice?.find('p:transition')
  const transitionRequires = transition?.attr('@Requires')
  if (
    !choice
    || (choiceRequires && !(choiceRequires in namespaces))
    || (transitionRequires && !(transitionRequires in namespaces))
  ) {
    // 不满足条件分支时使用备用分支
    transition = node.find('mc:Fallback/p:transition')
  }
  const speed = transition?.attr('@spd')
  const duration = transition?.attr('@p14:dur')
  const animation = transition?.dom.firstChild as SVGElement | undefined
  const name = animation?.nodeName
  const attrs = Object.fromEntries(
    (animation?.getAttributeNames() ?? []).map(k => [k, animation!.getAttribute(k)!]),
  )
  return {
    transition: {
      name,
      speed,
      duration: duration ? +duration : undefined,
      attrs,
    },
  } as Transition
}

export function stringifyTransition(transition: Transition['transition']): string {
  let res = ''
  if (transition?.name) {
    const key = transition.name
    const ns = key.split(':')[0]
    if (ns in namespaces) {
      const transitionMain = `<${key}${withAttrs(
        Object.entries(transition.attrs).map(([k, v]) => withAttr(k, v)),
      )} />`
      res = `<mc:AlternateContent xmlns:mc="${namespaces.mc}">
  <mc:Choice xmlns:p14="${namespaces.p14}" Requires="p14">
    <p:transition spd="${transition.speed ?? 'slow'}" p14:dur="${transition.duration ?? 699}">
        ${transitionMain}
    </p:transition>
  </mc:Choice>
  <mc:Fallback>
    <p:transition spd="slow">
        ${ns === 'p' ? transitionMain : '<p:fade/>'}
    </p:transition>
  </mc:Fallback>
</mc:AlternateContent>`
    }
  }
  return res
}
