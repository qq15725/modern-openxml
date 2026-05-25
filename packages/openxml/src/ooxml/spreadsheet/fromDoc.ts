import type {
  NormalizedDocument,
  NormalizedElement,
  NormalizedTable,
  NormalizedTableCell,
} from 'modern-idoc'
import type { Cell, CellType, CellValue, Column, Row, Workbook, Worksheet } from './types'
import { toCellRef } from './cellRef'

// fromDoc 是 toDoc(workbookToDoc) 的逆向投影:把 idoc 文档重建为 Workbook 数据模型,
// 供 docToXlsx 在缺少 meta.workbook 时降级导出(有损:丢失公式/数字格式/样式表,保留
// 单元格值、网格几何与合并)。

// toDoc 的默认列宽/行高(px),逆向时视为"未设置"以免强制几何
const COL_WIDTH = 64
const ROW_HEIGHT = 20
// px(96dpi)-> Excel 字符宽度 / 磅,与 toDoc 的 colWidthToPx/rowHeightToPx 对称
const pxToColWidth = (px: number): number => px / 7
const pxToRowHeight = (px: number): number => (px * 72) / 96

const NUMERIC_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i

/** 拼接单元格子树里的全部文本(toDoc 把单元格值写成一个文本子元素) */
function cellText(cell: NormalizedTableCell): string {
  let text = ''
  const walk = (el: NormalizedElement): void => {
    for (const paragraph of el.text?.content ?? []) {
      for (const fragment of paragraph.fragments ?? []) {
        text += fragment.content ?? ''
      }
    }
    for (const child of el.children ?? []) {
      walk(child)
    }
  }
  for (const child of cell.children ?? []) {
    walk(child)
  }
  return text
}

/** 文本值推断为数值/字符串(日期、百分比等格式化结果只能按字符串回写) */
function inferValue(text: string): { value: CellValue, type: CellType } {
  if (text === '') {
    return { value: null, type: 'number' }
  }
  const trimmed = text.trim()
  if (trimmed !== '' && NUMERIC_RE.test(trimmed) && Number.isFinite(Number(trimmed))) {
    return { value: Number(trimmed), type: 'number' }
  }
  return { value: text, type: 'string' }
}

function mergeRef(cell: NormalizedTableCell): string | undefined {
  const rowSpan = cell.rowSpan ?? 1
  const colSpan = cell.colSpan ?? 1
  if (rowSpan <= 1 && colSpan <= 1) {
    return undefined
  }
  const start = toCellRef(cell.row + 1, cell.col)
  const end = toCellRef(cell.row + rowSpan, cell.col + colSpan - 1)
  return `${start}:${end}`
}

function sheetFromElement(table: NormalizedTable, name: string): Worksheet {
  // 按 1-based 行号聚合单元格
  const rowMap = new Map<number, Cell[]>()
  const merges: string[] = []

  for (const cell of table.cells) {
    const merge = mergeRef(cell)
    if (merge) {
      merges.push(merge)
    }
    const { value, type } = inferValue(cellText(cell))
    if (value === null) {
      continue // 空单元格不写入(与 toDoc 的稀疏网格一致)
    }
    const rowIndex = cell.row + 1 // 0-based -> 1-based
    const list = rowMap.get(rowIndex) ?? []
    list.push({
      ref: toCellRef(rowIndex, cell.col),
      row: rowIndex,
      col: cell.col,
      value,
      type,
    })
    rowMap.set(rowIndex, list)
  }

  const rows: Row[] = [...rowMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([index, cells]) => {
      const row: Row = { index, cells: cells.sort((a, b) => a.col - b.col) }
      const heightPx = table.rows[index - 1]?.height
      if (typeof heightPx === 'number' && heightPx !== ROW_HEIGHT) {
        row.height = pxToRowHeight(heightPx)
      }
      return row
    })

  const columns: Column[] = []
  table.columns.forEach((col, i) => {
    const widthPx = col.width
    if (typeof widthPx === 'number' && widthPx !== COL_WIDTH) {
      columns.push({ min: i + 1, max: i + 1, width: pxToColWidth(widthPx) })
    }
  })

  const worksheet: Worksheet = { name, rows }
  if (columns.length) {
    worksheet.columns = columns
  }
  if (merges.length) {
    worksheet.merges = merges
  }
  return worksheet
}

/**
 * 把 idoc 文档逆向投影为 Workbook 数据模型(toDoc/workbookToDoc 的逆)。
 * 每个含 table 的元素还原为一个工作表;元素 meta.name 作为表名。
 * 用于 docToXlsx 在缺少 meta.workbook 时的有损降级导出。
 */
export function idocToWorkbookModel(doc: NormalizedDocument): Workbook {
  const sheets: Worksheet[] = []
  for (const el of doc.children ?? []) {
    if (!el.table) {
      continue
    }
    const name = (el.meta as { name?: string } | undefined)?.name ?? `Sheet${sheets.length + 1}`
    sheets.push(sheetFromElement(el.table, name))
  }
  // 工作簿至少要有一个工作表
  if (!sheets.length) {
    sheets.push({ name: 'Sheet1', rows: [] })
  }
  return { sheets }
}
