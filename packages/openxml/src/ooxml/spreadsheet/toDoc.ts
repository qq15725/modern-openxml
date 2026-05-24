import type { NormalizedElement, NormalizedTableCell } from 'modern-idoc'
import type { NormalizedXlsx, Workbook, Worksheet } from './types'
import { idGenerator } from 'modern-idoc'

// 默认列宽/行高(native 模型暂未解析真实列宽行高,后续补)
const COL_WIDTH = 64
const ROW_HEIGHT = 20
const SHEET_GAP = 24

function cellText(value: string | number | boolean | null): string {
  return value === null || value === undefined ? '' : String(value)
}

function sheetToElement(sheet: Worksheet, top: number): NormalizedElement {
  let maxCol = 0
  let maxRow = 0
  const cells: NormalizedTableCell[] = []

  for (const row of sheet.rows) {
    maxRow = Math.max(maxRow, row.index)
    for (const cell of row.cells) {
      maxCol = Math.max(maxCol, cell.col)
      cells.push({
        row: row.index - 1, // 1-based -> 0-based
        col: cell.col,
        children: [
          {
            id: idGenerator(),
            text: {
              enabled: true,
              content: [{ fragments: [{ content: cellText(cell.value) }] }],
            },
          },
        ],
      })
    }
  }

  const colCount = maxCol + 1
  const width = colCount * COL_WIDTH
  const height = maxRow * ROW_HEIGHT

  return {
    id: idGenerator(),
    style: { left: 0, top, width, height },
    table: {
      enabled: true,
      columns: Array.from({ length: colCount }, () => ({ width: COL_WIDTH })),
      rows: Array.from({ length: maxRow }, () => ({ height: ROW_HEIGHT })),
      cells,
    },
    meta: { name: sheet.name },
  }
}

/**
 * 把 Workbook 投影为 idoc 文档:每个工作表是一个带 table 的元素,单元格走
 * idoc 的 NormalizedTable 原语(列/行几何 + 单元格内容)。原始 Workbook 放进
 * meta.workbook 以便 docToXlsx 无损回写。
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
