import type { OoxmlNode } from '../core'

export interface Placeholder {
  type?: string
  index?: string
  node?: OoxmlNode
}

// p:ph
export function parsePlaceholder(ph?: OoxmlNode, ctx?: any): Placeholder | undefined {
  if (ph && ph.name !== 'p:ph') {
    ph = ph.find('//p:nvPr/p:ph')
  }

  if (!ph)
    return undefined

  const index = ph?.attr('@idx')
  const hasPhIdx = index !== undefined
  const type = ph?.attr('@type') ?? (hasPhIdx ? 'body' : undefined)
  let node: OoxmlNode | undefined

  if (type) {
    const required = [`@type="${type}"`, hasPhIdx && `@idx="${index}"`]
      .filter(Boolean)
      .join(' and ')
    const path = `p:cSld/p:spTree/p:sp/p:nvSpPr/p:nvPr/p:ph[${required}]/ancestor::p:sp`
    node = ctx?.layout?.node?.find(path)
      ?? ctx?.master?.node?.find(path)
  }

  return {
    type,
    index,
    node,
  }
}
