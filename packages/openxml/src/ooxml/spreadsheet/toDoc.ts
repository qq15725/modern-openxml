import type { NormalizedElement, NormalizedTableCell } from 'modern-idoc'
import type { NormalizedXlsx, Workbook, Worksheet } from './types'
import { idGenerator } from 'modern-idoc'
import { parseCellRef } from './cellRef'

// 默认列宽/行高(无显式定义时)
const COL_WIDTH = 64 // px
const ROW_HEIGHT = 20 // px
const SHEET_GAP = 24

// OOXML 字符宽度 -> px(近似);磅 -> px(96/72)
const colWidthToPx = (width: number): number => Math.round(width * 7)
const rowHeightToPx = (height: number): number => Math.round((height * 96) / 72)

function cellText(value: string | number | boolean | null): string {
  return value === null || value === undefined ? '' : String(value)
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

function sheetToElement(sheet: Worksheet, top: number): NormalizedElement {
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
      const cell: NormalizedTableCell = {
        row: r0,
        col: c.col,
        children: [
          {
            id: idGenerator(),
            text: {
              enabled: true,
              content: [{ fragments: [{ content: cellText(c.value) }] }],
            },
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
    const element = sheetToElement(sheet, offsetY)
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
