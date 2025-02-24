import type { OOXMLNode } from '../core'

export type ColorMap = Record<string, string>

// p:clrMap
export function parseColorMap(clrMap?: OOXMLNode): ColorMap | undefined {
  if (!clrMap)
    return undefined

  const node = clrMap.getDOM<HTMLElement>()
  const length = node.attributes.length
  const map: ColorMap = {}
  for (let i = 0; i < length; i++) {
    const attr = node.attributes.item(i)!
    map[attr.name] = attr.value
  }
  return map
}
