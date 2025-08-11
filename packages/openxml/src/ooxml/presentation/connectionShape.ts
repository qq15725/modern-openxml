import type { NormalizedElement, NormalizedStyle } from 'modern-idoc'
import type { OoxmlNode, OOXMLQueryType } from '../core'
import type { NonVisualDrawingProperties } from './nonVisualDrawingProperties'
import { idGenerator } from 'modern-idoc'
import { parseNonVisualDrawingProperties } from './nonVisualDrawingProperties'
import { parseNonVisualProperties } from './nonVisualProperties'
import { parseShapeProperties } from './shapeProperties'

export type ConnectionShapeMeta = NonVisualDrawingProperties['meta'] & {
  inPptIs: 'ConnectionShape'
  placeholderType?: string
  placeholderIndex?: string
}

export interface ConnectionShape extends NormalizedElement {
  style: NormalizedStyle
  meta: ConnectionShapeMeta
}

// p:cxnSp
export function parseConnectionShape(node?: OoxmlNode, ctx?: any): ConnectionShape | undefined {
  if (!node)
    return undefined
  const { placeholder, ...nvPr } = parseNonVisualProperties(node.find('p:nvCxnSpPr/p:nvPr'), ctx) ?? {}
  const cNvPr = parseNonVisualDrawingProperties(node.find('p:nvCxnSpPr/p:cNvPr'))
  ctx = { ...ctx, placeholder }
  const query = <T = any>(xpath: string, type: OOXMLQueryType = 'node'): T | undefined => {
    return node.query(xpath, type)
      ?? node.query(`p:style/${xpath}`, type)
      ?? placeholder?.node?.query(xpath, type)
  }
  const { rawTransform2d: _, ...spPr } = parseShapeProperties(node.find('p:spPr'), {
    ...ctx,
    query: (xpath: string, type?: OOXMLQueryType) => query(`p:spPr/${xpath}`, type),
  }) ?? {}
  return {
    id: idGenerator(),
    ...nvPr,
    ...cNvPr,
    ...spPr,
    style: {
      ...cNvPr?.style,
      ...spPr?.style,
    },
    meta: {
      ...cNvPr?.meta,
      inPptIs: 'ConnectionShape',
      placeholderType: placeholder?.type,
      placeholderIndex: placeholder?.index,
    },
  }
}
