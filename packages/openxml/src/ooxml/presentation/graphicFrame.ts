import type { NormalizedElement, NormalizedStyle, NormalizedTable, NormalizedTableCell } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import type { GroupShape } from './groupShape'
import type { NonVisualDrawingProperties } from './nonVisualDrawingProperties'
import type { SlideElement } from './slide'
import { idGenerator } from 'modern-idoc'
import { parseNonVisualDrawingProperties } from './nonVisualDrawingProperties'
import { parseNonVisualProperties } from './nonVisualProperties'
import { parseElement } from './slide'
import { parseTextBody } from './textBody'
import { parseTransform2d } from './transform2d'

export type GraphicFrameMeta = NonVisualDrawingProperties['meta'] & {
  inCanvasIs: 'Element2D'
  inPptIs: 'GraphicFrame'
  placeholderType?: string
  placeholderIndex?: string
}

export interface GraphicFrame extends NormalizedElement {
  style: NormalizedStyle
  meta: GraphicFrameMeta
  children: SlideElement[]
}

// a:graphic/a:graphicData/a:tbl
//
// DrawingML 表格:每个网格列都有一个 <a:tc>,被合并掉的格子用 hMerge/vMerge
// 标记,合并起点用 gridSpan/rowSpan;故列号 = <a:tc> 在行内的索引。
function parsePptxTable(tbl: OoxmlNode, ctx?: any): NormalizedTable {
  const columns = tbl.get('a:tblGrid/a:gridCol').map(c => ({
    width: c.attr<number>('@w', 'emu'),
  }))

  const trList = tbl.get('a:tr')
  const cells: NormalizedTableCell[] = []
  trList.forEach((tr, r) => {
    tr.get('a:tc').forEach((tc, c) => {
      if (tc.attr<boolean>('@hMerge', 'boolean') || tc.attr<boolean>('@vMerge', 'boolean')) {
        return // 被合并覆盖的格子
      }
      const colSpan = tc.attr<number>('@gridSpan', 'number') ?? 1
      const rowSpan = tc.attr<number>('@rowSpan', 'number') ?? 1
      const txBodyNode = tc.find('a:txBody')
      const txBody = txBodyNode
        ? parseTextBody(txBodyNode, { ...ctx, query: txBodyNode.query })
        : undefined
      const cell: NormalizedTableCell = {
        row: r,
        col: c,
        children: [
          {
            id: idGenerator(),
            style: txBody?.style,
            text: txBody?.text ?? { enabled: true, content: [] },
          },
        ],
      }
      if (colSpan > 1) {
        cell.colSpan = colSpan
      }
      if (rowSpan > 1) {
        cell.rowSpan = rowSpan
      }
      cells.push(cell)
    })
  })

  return {
    enabled: true,
    columns,
    rows: trList.map(tr => ({ height: tr.attr<number>('@h', 'emu') })),
    cells,
  }
}

function parseTableGraphicFrame(node: OoxmlNode, tbl: OoxmlNode, ctx?: any): GraphicFrame {
  const { placeholder, ...nvPr } = parseNonVisualProperties(node.find('p:nvGraphicFramePr/p:nvPr')) ?? {}
  const cNvPr = parseNonVisualDrawingProperties(node.find('p:nvGraphicFramePr/p:cNvPr'))
  const xfrm = parseTransform2d(node.find('p:xfrm'))!

  return {
    id: idGenerator(),
    ...nvPr,
    ...cNvPr,
    style: {
      ...cNvPr?.style,
      ...xfrm,
    },
    table: parsePptxTable(tbl, { ...ctx, placeholder }),
    children: [],
    meta: {
      ...cNvPr?.meta,
      inCanvasIs: 'Element2D',
      inPptIs: 'GraphicFrame',
      placeholderType: placeholder?.type,
      placeholderIndex: placeholder?.index,
    },
  }
}

export function parseGraphicFrame(node?: OoxmlNode, ctx?: any): GraphicFrame | undefined {
  if (!node)
    return undefined

  // 表格 graphicFrame
  const tbl = node.find('a:graphic/a:graphicData/a:tbl')
  if (tbl) {
    return parseTableGraphicFrame(node, tbl, ctx)
  }

  const dataId = node.attr('a:graphic/a:graphicData/dgm:relIds/@r:dm')
  const dataNode = ctx.dataRels?.find((item: any) => item.id === dataId)?.node as OoxmlNode
  const drawingId = dataNode?.attr('dgm:dataModel/dgm:extLst/a:ext/dsp:dataModelExt/@relId')
  const drawing = ctx.drawingRels?.find((item: any) => item.id === drawingId)
  const shapeTree = (drawing?.node as OoxmlNode)?.find('dsp:drawing/dsp:spTree')

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
    id: idGenerator(),
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
      inCanvasIs: 'Element2D',
      inPptIs: 'GraphicFrame',
      placeholderType: placeholder?.type,
      placeholderIndex: placeholder?.index,
    },
  }
}

// export function parseDsp(sp: OoxmlNode, ctx?: any): Shape {
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
