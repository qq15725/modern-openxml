import type { NormalizedElement, NormalizedStyle } from 'modern-idoc'
import type { OoxmlNode, OOXMLQueryType } from '../core'
import type { NonVisualDrawingProperties } from './nonVisualDrawingProperties'
import type { SlideElement } from './slide'
import { idGenerator } from 'modern-idoc'
import { withIndents } from '../utils'
import {
  parseNonVisualDrawingProperties,
  stringifyNonVisualDrawingProperties,
} from './nonVisualDrawingProperties'
import { parseNonVisualProperties } from './nonVisualProperties'
import { parseShapeProperties } from './shapeProperties'
import { stringifyTransform2d } from './transform2d'

export type GroupShapeMeta = NonVisualDrawingProperties['meta'] & {
  inPptIs: 'GroupShape'
  placeholderType?: string
  placeholderIndex?: string
}

export interface GroupShape extends NormalizedElement {
  style: NormalizedStyle
  children: SlideElement[]
  meta: GroupShapeMeta
}

export function parseGroupShape(node: OoxmlNode, ctx: any, parseElement: any): GroupShape {
  const { placeholder, ...nvPr } = parseNonVisualProperties(node.find('p:nvGrpSpPr/p:nvPr'), ctx) ?? {}
  const cNvPr = parseNonVisualDrawingProperties(node.find('p:nvGrpSpPr/p:cNvPr'))
  ctx = { ...ctx, placeholder }
  const queryGrpSp = <T = any>(xpath: string, type: OOXMLQueryType = 'node'): T | undefined => {
    return node.query(xpath, type)
      ?? node.query(`p:style/${xpath}`, type)
      ?? placeholder?.node?.query(xpath, type)
  }
  const { rawTransform2d, ...grpSpPr } = parseShapeProperties(node.find('p:grpSpPr'), {
    ...ctx,
    query: (xpath: string, type?: OOXMLQueryType) => queryGrpSp(`p:grpSpPr/${xpath}`, type),
  }) ?? {}

  const groupShape: GroupShape = {
    id: idGenerator(),
    ...nvPr,
    ...cNvPr,
    ...grpSpPr,
    style: {
      ...cNvPr?.style,
      ...grpSpPr?.style,
    },
    children: [],
    meta: {
      ...cNvPr?.meta,
      inPptIs: 'GroupShape',
      placeholderType: placeholder?.type,
      placeholderIndex: placeholder?.index,
    },
  }

  ctx = {
    ...ctx,
    parents: [
      ...(ctx.parents ?? []),
      { ...groupShape, transform2d: rawTransform2d },
    ],
  }

  groupShape.children = node.get('*').map(item => parseElement(item, ctx)).filter(Boolean)
  return {
    ...groupShape,
    fill: undefined,
    outline: undefined,
    background: undefined,
    foreground: undefined,
  }
}

export function stringifyGroupShape(grpSp: GroupShape, stringifyElement: any): string {
  const cNvPr = stringifyNonVisualDrawingProperties(grpSp)
  const xfrm = stringifyTransform2d(grpSp as any, true)
  const children = grpSp.children.map(stringifyElement) as string[]

  return `<p:grpSp>
  <p:nvGrpSpPr>
    ${withIndents(cNvPr, 2)}
    <p:cNvGrpSpPr/>
    <p:nvPr/>
  </p:nvGrpSpPr>
  <p:grpSpPr>
    ${withIndents(xfrm, 2)}
  </p:grpSpPr>
  ${withIndents(children)}
</p:grpSp>`
}
