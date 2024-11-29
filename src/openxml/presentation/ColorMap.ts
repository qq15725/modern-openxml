import { XmlObject } from '../../core'

export class ColorMap extends XmlObject {
  readonly tag = 'clrMap'

  parse(node: VNode | undefined) {
    if (!node)
      return undefined
    const el = node.getEl<HTMLElement>()
    const length = el.attributes.length
    const map: Record<string, any> = {}
    for (let i = 0; i < length; i++) {
      const attr = el.attributes.item(i)!
      map[attr.name] = attr.value
    }
    return map
  }
}
