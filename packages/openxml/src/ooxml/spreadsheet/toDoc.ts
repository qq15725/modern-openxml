import type { NormalizedBackground, NormalizedElement, NormalizedFragment, NormalizedStyle, NormalizedTableCell, TextAlign, VerticalAlign } from 'modern-idoc'
import type { ResolvedCellStyle, Styles, XlsxBorder, XlsxBorderEdge, XlsxFont } from './styles'
import type { CellValue, NormalizedXlsx, Workbook, Worksheet } from './types'
import { idGenerator } from 'modern-idoc'
import { parseCellRef } from './cellRef'
import { resolveCellStyle } from './styles'

// 默认列宽/行高(无显式定义时)
const COL_WIDTH = 64 // px
const ROW_HEIGHT = 20 // px
const SHEET_GAP = 24

// OOXML 字符宽度 -> px(近似);磅 -> px(96/72)
const colWidthToPx = (width: number): number => Math.round(width * 7)
const rowHeightToPx = (height: number): number => Math.round((height * 96) / 72)

// Excel ARGB("FFRRGGBB")-> idoc "#RRGGBB"
function argbToHex(argb?: string): string | undefined {
  if (!argb) {
    return undefined
  }
  const rgb = argb.length === 8 ? argb.slice(2) : argb
  return `#${rgb}`
}

// Excel 日期序列号(1899-12-30 起)-> YYYY-MM-DD
function serialToDate(serial: number): string {
  const date = new Date(Date.UTC(1899, 11, 30) + serial * 86400000)
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 按 numFmt 做基础显示格式化(仅日期/百分比,其余原样)
function formatCellValue(value: CellValue, formatCode?: string): string {
  if (value === null || value === undefined) {
    return ''
  }
  if (formatCode && typeof value === 'number') {
    if (formatCode.includes('%')) {
      const decimals = formatCode.match(/\.(0+)%/)?.[1].length ?? 0
      return `${(value * 100).toFixed(decimals)}%`
    }
    // 含 y/d 视为日期(避免把 m 误判为分钟)
    if (/y|d/i.test(formatCode) && !formatCode.includes('"')) {
      return serialToDate(value)
    }
  }
  return String(value)
}

function applyFont(fragment: NormalizedFragment, font?: XlsxFont): void {
  if (!font) {
    return
  }
  if (font.bold) {
    fragment.fontWeight = 700
  }
  if (font.italic) {
    fragment.fontStyle = 'italic'
  }
  if (font.underline) {
    fragment.textDecoration = 'underline'
  }
  if (font.size !== undefined) {
    fragment.fontSize = font.size
  }
  const color = argbToHex(font.color)
  if (color) {
    fragment.color = color
  }
  if (font.name) {
    fragment.fontFamily = font.name
  }
}

const BORDER_WIDTH_PX: Record<string, number> = { hair: 1, thin: 1, medium: 2, thick: 3 }
function borderEdgeToCss(edge?: XlsxBorderEdge): string | undefined {
  if (!edge?.style) {
    return undefined
  }
  const px = BORDER_WIDTH_PX[edge.style] ?? 1
  const lineStyle = /dash/i.test(edge.style) ? 'dashed' : /dot/i.test(edge.style) ? 'dotted' : edge.style === 'double' ? 'double' : 'solid'
  return `${px}px ${lineStyle} ${argbToHex(edge.color) ?? '#000000'}`
}

function fillToBackground(fill?: ResolvedCellStyle['fill']): NormalizedBackground | undefined {
  if (fill?.patternType === 'solid' && fill.fgColor) {
    return { enabled: true, color: argbToHex(fill.fgColor)! }
  }
  return undefined
}

function cellStyleFrom(resolved?: ResolvedCellStyle): NormalizedStyle | undefined {
  if (!resolved) {
    return undefined
  }
  const style: NormalizedStyle = {}
  const al = resolved.alignment
  if (al?.horizontal && al.horizontal !== 'general') {
    style.textAlign = al.horizontal as TextAlign
  }
  if (al?.vertical) {
    style.verticalAlign = (al.vertical === 'center' ? 'middle' : al.vertical) as VerticalAlign
  }
  const border = resolved.border as XlsxBorder | undefined
  if (border) {
    const top = borderEdgeToCss(border.top)
    const left = borderEdgeToCss(border.left)
    const right = borderEdgeToCss(border.right)
    const bottom = borderEdgeToCss(border.bottom)
    if (top) {
      style.borderTop = top
    }
    if (left) {
      style.borderLeft = left
    }
    if (right) {
      style.borderRight = right
    }
    if (bottom) {
      style.borderBottom = bottom
    }
  }
  return Object.keys(style).length ? style : undefined
}

interface MergeInfo {
  /** key "row,col"(0-based)-> 左上角的跨度 */
  spans: Map<string, { rowSpan: number, colSpan: number }>
  /** 被合并覆盖(非左上角)的格子 key 集合 */
  covered: Set<string>
  maxRow: number
  maxCol: number
}

function resolveMerges(merges: string[] = []): MergeInfo {
  const spans = new Map<string, { rowSpan: number, colSpan: number }>()
  const covered = new Set<string>()
  let maxRow = 0
  let maxCol = 0
  for (const ref of merges) {
    const [a, b] = ref.split(':')
    if (!a || !b) {
      continue
    }
    const s = parseCellRef(a)
    const e = parseCellRef(b)
    const r0 = Math.min(s.row, e.row) - 1
    const c0 = Math.min(s.col, e.col)
    const r1 = Math.max(s.row, e.row) - 1
    const c1 = Math.max(s.col, e.col)
    spans.set(`${r0},${c0}`, { rowSpan: r1 - r0 + 1, colSpan: c1 - c0 + 1 })
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (!(r === r0 && c === c0)) {
          covered.add(`${r},${c}`)
        }
      }
    }
    maxRow = Math.max(maxRow, r1 + 1)
    maxCol = Math.max(maxCol, c1)
  }
  return { spans, covered, maxRow, maxCol }
}

/** 0-based 列号 -> px 宽度,优先用 <col> 定义 */
function columnWidthPx(sheet: Worksheet, col: number): number {
  const def = (sheet.columns ?? []).find(c => col >= c.min - 1 && col <= c.max - 1)
  return def && def.width ? colWidthToPx(def.width) : COL_WIDTH
}

function sheetToElement(sheet: Worksheet, top: number, styles?: Styles): NormalizedElement {
  const merge = resolveMerges(sheet.merges)
  let maxCol = merge.maxCol
  let maxRow = merge.maxRow
  const cells: NormalizedTableCell[] = []

  for (const row of sheet.rows) {
    maxRow = Math.max(maxRow, row.index)
    for (const c of row.cells) {
      maxCol = Math.max(maxCol, c.col)
      const r0 = row.index - 1 // 1-based -> 0-based
      if (merge.covered.has(`${r0},${c.col}`)) {
        continue // 被合并覆盖的格子不输出
      }
      const resolved = resolveCellStyle(styles, c.styleId)
      const fragment: NormalizedFragment = { content: formatCellValue(c.value, resolved?.formatCode) }
      applyFont(fragment, resolved?.font)
      const cell: NormalizedTableCell = {
        row: r0,
        col: c.col,
        children: [
          {
            id: idGenerator(),
            text: { enabled: true, content: [{ fragments: [fragment] }] },
          },
        ],
      }
      const span = merge.spans.get(`${r0},${c.col}`)
      if (span) {
        if (span.rowSpan > 1) {
          cell.rowSpan = span.rowSpan
        }
        if (span.colSpan > 1) {
          cell.colSpan = span.colSpan
        }
      }
      const background = fillToBackground(resolved?.fill)
      if (background) {
        cell.background = background
      }
      const cellStyle = cellStyleFrom(resolved)
      if (cellStyle) {
        cell.style = cellStyle
      }
      cells.push(cell)
    }
  }

  const colCount = maxCol + 1
  const columns = Array.from({ length: colCount }, (_, c) => ({ width: columnWidthPx(sheet, c) }))
  const rowHeights = new Map(sheet.rows.map(r => [r.index, r.height]))
  const rows = Array.from({ length: maxRow }, (_, i) => {
    const h = rowHeights.get(i + 1)
    return { height: h !== undefined ? rowHeightToPx(h) : ROW_HEIGHT }
  })

  const width = columns.reduce((sum, c) => sum + (c.width ?? 0), 0)
  const height = rows.reduce((sum, r) => sum + (r.height ?? 0), 0)

  return {
    id: idGenerator(),
    style: { left: 0, top, width, height },
    table: { enabled: true, columns, rows, cells },
    meta: { name: sheet.name },
  }
}

/**
 * 把 Workbook 投影为 idoc 文档:每个工作表是一个带 table 的元素(idoc 的
 * NormalizedTable 原语:真实列宽/行高几何 + 单元格内容,合并用 rowSpan/colSpan)。
 * 原始 Workbook 放进 meta.workbook 以便 docToXlsx 无损回写。
 */
export function workbookToDoc(workbook: Workbook): NormalizedXlsx {
  const sheets = workbook.sheets ?? []
  let offsetY = 0
  let maxWidth = 0

  const children = sheets.map((sheet) => {
    const element = sheetToElement(sheet, offsetY, workbook.styles)
    const width = Number(element.style?.width ?? 0)
    const height = Number(element.style?.height ?? 0)
    maxWidth = Math.max(maxWidth, width)
    offsetY += height + SHEET_GAP
    return element
  })

  return {
    id: idGenerator(),
    style: {
      width: maxWidth,
      height: Math.max(offsetY - SHEET_GAP, 0),
    },
    children,
    meta: { workbook },
  }
}
