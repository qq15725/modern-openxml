import type { NormalizedElement, NormalizedStyle, NormalizedTable, NormalizedTableCell } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import type { GroupShape } from './groupShape'
import type { NonVisualDrawingProperties } from './nonVisualDrawingProperties'
import type { SlideElement } from './slide'
import { idGenerator } from 'modern-idoc'
import { OoxmlValue } from '../core'
import { parseFill, stringifySolidFill } from '../drawing'
import { withAttr, withAttrs, withIndents } from '../utils'
import { parseNonVisualDrawingProperties, stringifyNonVisualDrawingProperties } from './nonVisualDrawingProperties'
import { parseNonVisualProperties } from './nonVisualProperties'
import { parseElement } from './slide'
import { parseTextBody, stringifyTextBody } from './textBody'
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
// a:lnL/a:lnR/a:lnT/a:lnB(与 a:ln 同构,但标签名不同,故不能直接复用 parseOutline)
// 转成 idoc 的 CSS 边框串
function lineToBorder(ln: OoxmlNode | undefined, ctx?: any): string | undefined {
  if (!ln || ln.find('a:noFill')) {
    return undefined
  }
  const width = ln.attr<number>('@w', 'ST_LineWidth')
  const color = parseFill(ln, ctx)?.color
  if (width === undefined && !color) {
    return undefined
  }
  const dash = ln.attr('a:prstDash/@val')
  const style = dash && dash !== 'solid' ? 'dashed' : 'solid'
  return `${width ?? 1}px ${style} ${color ?? '#000000'}`
}

function anchorToVerticalAlign(anchor?: string): 'top' | 'middle' | 'bottom' | undefined {
  if (anchor === 'ctr') {
    return 'middle'
  }
  if (anchor === 'b') {
    return 'bottom'
  }
  if (anchor === 't') {
    return 'top'
  }
  return undefined
}

function parseCellStyle(tcPr: OoxmlNode | undefined, ctx?: any): { background?: any, style?: NormalizedStyle } {
  if (!tcPr) {
    return {}
  }
  const result: { background?: any, style?: NormalizedStyle } = {}

  const fill = parseFill(tcPr, ctx)
  if (fill && (fill.color || fill.image || fill.linearGradient || fill.radialGradient)) {
    result.background = fill
  }

  const style: NormalizedStyle = {}
  const verticalAlign = anchorToVerticalAlign(tcPr.attr('@anchor'))
  if (verticalAlign) {
    style.verticalAlign = verticalAlign
  }
  const borderLeft = lineToBorder(tcPr.find('a:lnL'), ctx)
  const borderRight = lineToBorder(tcPr.find('a:lnR'), ctx)
  const borderTop = lineToBorder(tcPr.find('a:lnT'), ctx)
  const borderBottom = lineToBorder(tcPr.find('a:lnB'), ctx)
  if (borderLeft) {
    style.borderLeft = borderLeft
  }
  if (borderRight) {
    style.borderRight = borderRight
  }
  if (borderTop) {
    style.borderTop = borderTop
  }
  if (borderBottom) {
    style.borderBottom = borderBottom
  }
  if (Object.keys(style).length) {
    result.style = style
  }
  return result
}

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
      const { background, style } = parseCellStyle(tc.find('a:tcPr'), ctx)
      if (background) {
        cell.background = background
      }
      if (style) {
        cell.style = style
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

const TABLE_URI = 'http://schemas.openxmlformats.org/drawingml/2006/table'

interface GridSlot {
  type: 'origin' | 'covered' | 'empty'
  cell?: NormalizedTableCell
  colSpan?: number
  rowSpan?: number
  hMerge?: boolean
  vMerge?: boolean
}

function cellTxBody(cell: NormalizedTableCell): string {
  const child = cell.children?.[0] as any
  const tb = child ? stringifyTextBody(child) : undefined
  // stringifyTextBody 输出 <p:txBody>,表格单元格需 <a:txBody>
  return tb
    ? tb.replace('<p:txBody>', '<a:txBody>').replace('</p:txBody>', '</a:txBody>')
    : '<a:txBody><a:bodyPr/><a:lstStyle/><a:p/></a:txBody>'
}

function cellTcPr(cell: NormalizedTableCell): string {
  const va = (cell.style as any)?.verticalAlign
  const anchor = va === 'middle' ? 'ctr' : va === 'bottom' ? 'b' : va === 'top' ? 't' : undefined
  const bg = (cell.background as any)?.color
  const fill = bg ? stringifySolidFill(String(bg)) : ''
  return `<a:tcPr${anchor ? ` anchor="${anchor}"` : ''}>${fill}</a:tcPr>`
}

function stringifyTable(table: NonNullable<NormalizedElement['table']>): string {
  const nCols = table.columns.length
  const nRows = table.rows.length

  // 还原网格占位(合并格补 hMerge/vMerge)
  const grid: GridSlot[][] = Array.from({ length: nRows }, () =>
    Array.from({ length: nCols }, () => ({ type: 'empty' } as GridSlot)))
  for (const cell of table.cells) {
    const cs = cell.colSpan ?? 1
    const rs = cell.rowSpan ?? 1
    if (!grid[cell.row]?.[cell.col]) {
      continue
    }
    grid[cell.row][cell.col] = { type: 'origin', cell, colSpan: cs, rowSpan: rs }
    for (let r = cell.row; r < cell.row + rs && r < nRows; r++) {
      for (let c = cell.col; c < cell.col + cs && c < nCols; c++) {
        if (r === cell.row && c === cell.col) {
          continue
        }
        grid[r][c] = { type: 'covered', hMerge: c > cell.col, vMerge: r > cell.row }
      }
    }
  }

  const gridCols = table.columns
    .map(col => `<a:gridCol${withAttrs([withAttr('w', OoxmlValue.encode(col.width ?? 0, 'emu'))])}/>`)
    .join('')

  const rows = table.rows.map((row, r) => {
    const tcs = grid[r].map((slot) => {
      if (slot.type === 'origin' && slot.cell) {
        const attrs = withAttrs([
          (slot.colSpan ?? 1) > 1 && withAttr('gridSpan', slot.colSpan),
          (slot.rowSpan ?? 1) > 1 && withAttr('rowSpan', slot.rowSpan),
        ])
        return `<a:tc${attrs}>${cellTxBody(slot.cell)}${cellTcPr(slot.cell)}</a:tc>`
      }
      if (slot.type === 'covered') {
        const attrs = withAttrs([
          slot.hMerge && withAttr('hMerge', '1'),
          slot.vMerge && withAttr('vMerge', '1'),
        ])
        return `<a:tc${attrs}><a:txBody><a:bodyPr/><a:lstStyle/><a:p/></a:txBody><a:tcPr/></a:tc>`
      }
      return `<a:tc><a:txBody><a:bodyPr/><a:lstStyle/><a:p/></a:txBody><a:tcPr/></a:tc>`
    }).join('')
    return `<a:tr${withAttrs([withAttr('h', OoxmlValue.encode(row.height ?? 0, 'emu'))])}>${tcs}</a:tr>`
  }).join('')

  return `<a:tbl><a:tblPr firstRow="1" bandRow="1"/><a:tblGrid>${gridCols}</a:tblGrid>${rows}</a:tbl>`
}

export function stringifyGraphicFrame(node: GraphicFrame): string | undefined {
  // 目前仅支持表格 graphicFrame;diagram/chart 暂不回写
  if (!node.table) {
    return undefined
  }
  const cNvPr = stringifyNonVisualDrawingProperties(node)
  const s = node.style ?? {}
  return `<p:graphicFrame>
  <p:nvGraphicFramePr>
    ${withIndents(cNvPr, 2)}
    <p:cNvGraphicFramePr/>
    <p:nvPr/>
  </p:nvGraphicFramePr>
  <p:xfrm>
    <a:off${withAttrs([
      withAttr('x', OoxmlValue.encode(Number(s.left ?? 0), 'emu')),
      withAttr('y', OoxmlValue.encode(Number(s.top ?? 0), 'emu')),
    ])}/>
    <a:ext${withAttrs([
      withAttr('cx', OoxmlValue.encode(Number(s.width ?? 0), 'emu')),
      withAttr('cy', OoxmlValue.encode(Number(s.height ?? 0), 'emu')),
    ])}/>
  </p:xfrm>
  <a:graphic>
    <a:graphicData uri="${TABLE_URI}">
      ${withIndents(stringifyTable(node.table), 3)}
    </a:graphicData>
  </a:graphic>
</p:graphicFrame>`
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
