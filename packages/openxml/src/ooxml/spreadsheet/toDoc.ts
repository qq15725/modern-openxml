import type { NormalizedElement } from 'modern-idoc'
import type { NormalizedXlsx, Workbook, Worksheet } from './types'
import { idGenerator } from 'modern-idoc'

// idoc 无网格/单元格模型,这里把表格"渲染"成定位盒子:
// 用默认列宽/行高合成几何,每个单元格是一个带文本的绝对定位元素。
const COL_WIDTH = 64
const ROW_HEIGHT = 20
const SHEET_GAP = 24

function cellText(value: string | number | boolean | null): string {
  return value === null || value === undefined ? '' : String(value)
}

function sheetToElement(sheet: Worksheet, top: number): NormalizedElement {
  let maxCol = 0
  let maxRow = 0
  const cells: NormalizedElement[] = []

  for (const row of sheet.rows) {
    maxRow = Math.max(maxRow, row.index)
    for (const cell of row.cells) {
      maxCol = Math.max(maxCol, cell.col)
      cells.push({
        id: idGenerator(),
        style: {
          left: cell.col * COL_WIDTH,
          top: (row.index - 1) * ROW_HEIGHT,
          width: COL_WIDTH,
          height: ROW_HEIGHT,
        },
        text: {
          enabled: true,
          content: [{ fragments: [{ content: cellText(cell.value) }] }],
        },
      })
    }
  }

  return {
    id: idGenerator(),
    style: {
      left: 0,
      top,
      width: (maxCol + 1) * COL_WIDTH,
      height: maxRow * ROW_HEIGHT,
    },
    children: cells,
    meta: { name: sheet.name },
  }
}

/**
 * 把 Workbook 投影为 idoc 文档(把每个工作表渲染成定位单元格的页面),
 * 并把原始 Workbook 放进 meta.workbook 以便 docToXlsx 无损回写。
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
