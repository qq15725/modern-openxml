import type { NormalizedElement, NormalizedStyle } from 'modern-idoc'
import type { OoxmlNode, OOXMLQueryType } from '../core'
import type { NonVisualDrawingProperties } from './nonVisualDrawingProperties'
import { idGenerator } from 'modern-idoc'
import { parseBlipFill, stringifyFill } from '../drawing'
import { withIndents } from '../utils'
import { parseNonVisualDrawingProperties, stringifyNonVisualDrawingProperties } from './nonVisualDrawingProperties'
import { parseNonVisualProperties, stringifyNonVisualProperties } from './nonVisualProperties'
import { parseShapeProperties, stringifyShapeProperties } from './shapeProperties'

export type PictureMeta = NonVisualDrawingProperties['meta'] & {
  inPptIs: 'Picture'
  placeholderType?: string
  placeholderIndex?: string
}

export interface Picture extends NormalizedElement {
  style: NormalizedStyle
  meta: PictureMeta
}

// p:pic
export function parsePicture(node?: OoxmlNode, ctx?: any): Picture | undefined {
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
    id: idGenerator(),
    ...nvPr,
    ...cNvPr,
    ...spPr,
    style: {
      ...cNvPr?.style,
      ...spPr?.style,
    },
    foreground: {
      ...parseBlipFill(query('p:blipFill'), ctx),
      fillWithShape: true,
    },
    meta: {
      ...cNvPr?.meta,
      inPptIs: 'Picture',
      placeholderType: placeholder?.type,
      placeholderIndex: placeholder?.index,
    },
  }
}

export function stringifyPicture(pic: Picture): string {
  const cNvPr = stringifyNonVisualDrawingProperties(pic)
  const nvPr = stringifyNonVisualProperties(pic as any)
  const pBlipFill = stringifyFill(pic.foreground, true)
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
