import type { NormalizedElement, NormalizedStyle } from 'modern-idoc'
import type { OoxmlNode, OOXMLQueryType } from '../core'
import type { NonVisualDrawingProperties } from './nonVisualDrawingProperties'
import { idGenerator } from 'modern-idoc'
import {
  withAttr,
  withAttrs,
  withIndents,
} from '../utils'
import { parseNonVisualDrawingProperties, stringifyNonVisualDrawingProperties } from './nonVisualDrawingProperties'
import { parseNonVisualProperties } from './nonVisualProperties'
import { parseShapeProperties, stringifyShapeProperties } from './shapeProperties'
import { parseTextBody, stringifyTextBody } from './textBody'

export type ShapeMeta = NonVisualDrawingProperties['meta'] & {
  inPptIs: 'Shape'
  placeholderType?: string
  placeholderIndex?: string
}

export interface Shape extends NormalizedElement {
  style: NormalizedStyle
  meta: ShapeMeta
}

// p:sp
export function parseShape(node?: OoxmlNode, ctx?: any): Shape | undefined {
  if (!node) {
    return undefined
  }

  const { placeholder, ...nvPr } = parseNonVisualProperties(node.find('p:nvSpPr/p:nvPr'), ctx) ?? {}
  const cNvPr = parseNonVisualDrawingProperties(node.find('p:nvSpPr/p:cNvPr'))
  ctx = { ...ctx, placeholder }
  const query = <T = any>(xpath: string, type: OOXMLQueryType = 'node'): T | undefined => {
    return node.query(xpath, type)
      ?? node?.query(`p:style/${xpath}`, type)
      ?? placeholder?.node?.query(xpath, type)
  }
  const { rawTransform2d: _, ...spPr } = parseShapeProperties(node.find('p:spPr'), {
    ...ctx,
    query: (xpath: string, type?: OOXMLQueryType) => query(`p:spPr/${xpath}`, type),
  }) ?? {}
  const txBody = parseTextBody(node.find('p:txBody'), {
    ...ctx,
    query: (xpath: string, type?: OOXMLQueryType) => query(`p:txBody/${xpath}`, type),
  })

  return {
    id: idGenerator(),
    ...nvPr,
    ...cNvPr,
    ...spPr,
    style: {
      ...cNvPr?.style,
      ...spPr?.style,
      ...txBody?.style,
    },
    text: node?.attr<boolean>('p:nvSpPr/p:cNvSpPr/@txBox', 'boolean') !== false
      ? txBody.text
      : undefined,
    meta: {
      ...cNvPr?.meta,
      inPptIs: 'Shape',
      placeholderType: placeholder?.type,
      placeholderIndex: placeholder?.index,
    },
  }
}

export function stringifyShape(sp: Shape): string {
  const cNvPr = stringifyNonVisualDrawingProperties(sp)
  const spPr = stringifyShapeProperties(sp as any)
  const txBody = stringifyTextBody(sp)

  return `<p:sp>
  <p:nvSpPr>
    ${withIndents(cNvPr, 2)}
    <p:cNvSpPr${withAttrs([
      !!sp.text?.content?.length && withAttr('txBox', '1'),
    ].filter(Boolean) as string[])}/>
    <p:nvPr/>
  </p:nvSpPr>
  ${withIndents(spPr)}
  ${withIndents(txBody)}
</p:sp>`
}
