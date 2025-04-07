import type { IDOCElementDeclaration, StyleProperty } from 'modern-idoc'
import type { OOXMLNode, OOXMLQueryType } from '../core'
import { parseNonVisualDrawingProperties } from './non-visual-drawing-properties'
import { parseNonVisualProperties } from './non-visual-properties'
import { parseShapeProperties } from './shape-properties'

export interface ConnectionShapeMeta {
  type: 'connection-shape'
  placeholderType?: string
  placeholderIndex?: string
}

export interface ConnectionShape extends IDOCElementDeclaration {
  style: StyleProperty
  meta: ConnectionShapeMeta
}

// p:cxnSp
export function parseConnectionShape(node?: OOXMLNode, ctx?: any): ConnectionShape | undefined {
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
    ...nvPr,
    ...cNvPr,
    ...spPr,
    style: {
      ...cNvPr?.style,
      ...spPr?.style,
    },
    meta: {
      ...cNvPr?.meta,
      type: 'connection-shape',
      placeholderType: placeholder?.type,
      placeholderIndex: placeholder?.index,
    },
  }
}
