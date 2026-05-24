import type { NormalizedElement, NormalizedFragment, NormalizedParagraph, NormalizedTableCell, TextAlign } from 'modern-idoc'
import type { Docx, NormalizedDocx, Paragraph, ParagraphAlign, Run, Table } from './types'
import { idGenerator } from 'modern-idoc'
import { isTable } from './types'

// A4 在 96dpi 下约 794x1123 px,作为默认页面尺寸
const PAGE_WIDTH = 794
const LINE_HEIGHT = 24
// twips(1/1440 inch)-> px(96dpi):twips / 15
const twipsToPx = (twips: number): number => Math.round(twips / 15)

function mapAlign(align?: ParagraphAlign): TextAlign | undefined {
  if (!align) {
    return undefined
  }
  if (align === 'both') {
    return 'justify'
  }
  return align as TextAlign
}

function runToFragment(run: Run): NormalizedFragment {
  const fragment: NormalizedFragment = { content: run.text }
  if (run.bold) {
    fragment.fontWeight = 700
  }
  if (run.italic) {
    fragment.fontStyle = 'italic'
  }
  if (run.underline) {
    fragment.textDecoration = 'underline'
  }
  if (run.fontSize !== undefined) {
    fragment.fontSize = run.fontSize
  }
  if (run.color) {
    fragment.color = `#${run.color}`
  }
  return fragment
}

function paragraphToIdoc(paragraph: Paragraph): NormalizedParagraph {
  const normalized: NormalizedParagraph = {
    fragments: (paragraph.runs ?? []).map(runToFragment),
  }
  const textAlign = mapAlign(paragraph.align)
  if (textAlign) {
    normalized.textAlign = textAlign
  }
  return normalized
}

/** 一组段落 -> 一个文本元素 */
function paragraphsToElement(paragraphs: Paragraph[]): NormalizedElement {
  return {
    id: idGenerator(),
    style: { width: PAGE_WIDTH },
    text: { enabled: true, content: paragraphs.map(paragraphToIdoc) },
  }
}

/** docx 表格 -> idoc element.table:gridSpan->colSpan,vMerge->rowSpan(跳过 continue) */
function tableToElement(table: Table): NormalizedElement {
  // 为每个单元格计算其起始网格列(累计 colSpan)
  const grid = table.rows.map((row) => {
    let col = 0
    return row.cells.map((cell) => {
      const colSpan = cell.colSpan ?? 1
      const startCol = col
      col += colSpan
      return { cell, startCol, colSpan }
    })
  })

  const cells: NormalizedTableCell[] = []
  grid.forEach((rowCells, r) => {
    for (const { cell, startCol, colSpan } of rowCells) {
      if (cell.vMerge === 'continue') {
        continue // 被上方合并覆盖
      }
      // rowSpan:统计下方同列连续的 vMerge=continue
      let rowSpan = 1
      for (let rr = r + 1; rr < grid.length; rr++) {
        const below = grid[rr].find(c => c.startCol === startCol && c.cell.vMerge === 'continue')
        if (!below) {
          break
        }
        rowSpan++
      }
      const tableCell: NormalizedTableCell = {
        row: r,
        col: startCol,
        children: [
          {
            id: idGenerator(),
            text: { enabled: true, content: cell.paragraphs.map(paragraphToIdoc) },
          },
        ],
      }
      if (colSpan > 1) {
        tableCell.colSpan = colSpan
      }
      if (rowSpan > 1) {
        tableCell.rowSpan = rowSpan
      }
      cells.push(tableCell)
    }
  })

  return {
    id: idGenerator(),
    table: {
      enabled: true,
      columns: table.columns.map(w => ({ width: twipsToPx(w) })),
      rows: table.rows.map(row => ({ height: row.height !== undefined ? twipsToPx(row.height) : LINE_HEIGHT })),
      cells,
    },
  }
}

/**
 * 把 Docx 数据模型投影为 idoc 文档(用于统一渲染),并把原始 Docx 模型放进
 * meta.docx 以便 docToDocx 无损回写。
 *
 * 正文按块顺序投影:连续段落归到一个文本元素,表格走 idoc 的 NormalizedTable。
 */
export function docxModelToDoc(docx: Docx): NormalizedDocx {
  const children: NormalizedElement[] = []
  let pending: Paragraph[] = []
  const flush = (): void => {
    if (pending.length) {
      children.push(paragraphsToElement(pending))
      pending = []
    }
  }

  for (const block of docx.blocks ?? []) {
    if (isTable(block)) {
      flush()
      children.push(tableToElement(block))
    }
    else {
      pending.push(block)
    }
  }
  flush()

  return {
    id: idGenerator(),
    style: { width: PAGE_WIDTH },
    children,
    meta: { docx },
  }
}
