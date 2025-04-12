import type { ElementDeclaration, StyleProperty } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import type { GroupShape } from './group-shape'
import type { NonVisualDrawingProperties } from './non-visual-drawing-properties'
import type { SlideElement } from './slide'
import { parseNonVisualDrawingProperties } from './non-visual-drawing-properties'
import { parseNonVisualProperties } from './non-visual-properties'
import { parseElement } from './slide'
import { parseTransform2d } from './transform2d'

export type GraphicFrameMeta = NonVisualDrawingProperties['meta'] & {
  type: 'graphic-frame'
  placeholderType?: string
  placeholderIndex?: string
}

export interface GraphicFrame extends ElementDeclaration {
  style: StyleProperty
  meta: GraphicFrameMeta
  children: SlideElement[]
}

export function parseGraphicFrame(node?: OOXMLNode, ctx?: any): GraphicFrame | undefined {
  if (!node)
    return undefined

  const dataId = node.attr('a:graphic/a:graphicData/dgm:relIds/@r:dm')
  const dataNode = ctx.dataRels?.find((item: any) => item.id === dataId)?.node as OOXMLNode
  const drawingId = dataNode?.attr('dgm:dataModel/dgm:extLst/a:ext/dsp:dataModelExt/@relId')
  const drawing = ctx.drawingRels?.find((item: any) => item.id === drawingId)
  const shapeTree = (drawing?.node as OOXMLNode)?.find('dsp:drawing/dsp:spTree')

  const { placeholder, ...nvPr } = parseNonVisualProperties(shapeTree?.find('p:nvGraphicFramePr/p:nvPr')) ?? {}
  const cNvPr = parseNonVisualDrawingProperties(shapeTree?.find('p:nvGraphicFramePr/p:cNvPr'))
  ctx = { ...ctx, placeholder }
  // const query = <T = any>(xpath: string, type: OOXMLQueryType = 'node'): T | undefined => {
  //   return node.query(xpath, type)
  //     ?? node?.query(`p:style/${xpath}`, type)
  //     ?? placeholder?.node?.query(xpath, type)
  // }

  const xfrmNode = node.find('p:xfrm') ?? shapeTree?.find('dsp:grpSpPr/a:xfrm')
  const xfrm = parseTransform2d(xfrmNode)!
  const newCtx = {
    ...ctx,
    drawing,
    grpSpXfrms: [...(ctx.grpSpXfrms ?? []), xfrmNode],
  }

  return {
    ...nvPr,
    ...cNvPr,
    style: {
      ...cNvPr?.style,
      ...xfrm,
    },
    children: shapeTree
      ?.get('dsp:sp')
      .map(item => parseElement(item, newCtx))
      .filter(Boolean) as GroupShape['children'] ?? [],
    meta: {
      ...cNvPr?.meta,
      type: 'graphic-frame',
      placeholderType: placeholder?.type,
      placeholderIndex: placeholder?.index,
    },
  }
}

// export function parseDsp(sp: OOXMLNode, ctx?: any): Shape {
//   const spPr = parseShapeProperties(sp.find('dsp:spPr'), {
//     ...ctx,
//     style: sp.find('dsp:style'),
//   })
//   const cNvPr = parseNonVisualDrawingProperties(sp.find('dsp:nvSpPr/dsp:cNvPr'))
//   const txBody = parseTextBody(sp.find('dsp:txBody'), ctx)
//   const props = {
//     cNvPr,
//     txBody,
//     ...spPr,
//   }
//   return clearUndef({
//     type: 'shape',
//     ...props?.cNvPr,
//     image: props?.blipFill,
//     backgroundColor: props?.backgroundColor,
//     ...props?.txBody,
//     ...props?.geometry,
//   })
// }
