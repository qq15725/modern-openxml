import type { IDOCElementDeclaration, StyleDeclaration } from 'modern-idoc'
import type { OOXMLNode, OOXMLQueryType } from '../core'
import type { NonVisualDrawingProperties } from './non-visual-drawing-properties'
import { parsePBlipFill, stringifyFill } from '../drawing'
import { withIndents } from '../utils'
import { parseNonVisualDrawingProperties, stringifyNonVisualDrawingProperties } from './non-visual-drawing-properties'
import { parseNonVisualProperties, stringifyNonVisualProperties } from './non-visual-properties'
import { parseShapeProperties, stringifyShapeProperties } from './shape-properties'

export interface Picture extends IDOCElementDeclaration {
  style: Partial<StyleDeclaration>
  meta: NonVisualDrawingProperties['meta'] & {
    type: 'picture'
    placeholderType?: string
    placeholderIndex?: string
  }
}

// p:pic
export function parsePicture(node?: OOXMLNode, ctx?: any): Picture | undefined {
  if (!node) {
    return undefined
  }

  const { placeholder, ...nvPr } = parseNonVisualProperties(node.find('p:nvPicPr/p:nvPr'), ctx) ?? {}
  const cNvPr = parseNonVisualDrawingProperties(node?.find('p:nvPicPr/p:cNvPr'))
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
    image: parsePBlipFill(query('p:blipFill'), ctx),
    meta: {
      ...cNvPr?.meta,
      type: 'picture',
      placeholderType: placeholder?.type,
      placeholderIndex: placeholder?.index,
    },
  }
}

export function stringifyPicture(pic: Picture): string {
  const cNvPr = stringifyNonVisualDrawingProperties(pic)
  const nvPr = stringifyNonVisualProperties(pic)
  const pBlipFill = stringifyFill(pic.image, true)
  const spPr = stringifyShapeProperties(pic as any, true)

  return `<p:pic>
  <p:nvPicPr>
    ${withIndents(cNvPr, 2)}
    <p:cNvPicPr>
      <a:picLocks noChangeAspect="1"/>
    </p:cNvPicPr>
    ${withIndents(nvPr, 2)}
  </p:nvPicPr>
  ${withIndents(pBlipFill)}
  ${withIndents(spPr)}
</p:pic>`
}
