import type {
  NormalizedDocument,
  NormalizedElement,
  NormalizedFragment,
  NormalizedParagraph,
  NormalizedStyle,
  NormalizedTable,
  NormalizedTableCell,
} from 'modern-idoc'
import type { Docx, Paragraph, ParagraphAlign, Run, Table, TableBorder, TableCell, TableCellBorders, TableRow } from './types'

// fromDoc 是 toDoc(docxModelToDoc) 的逆向投影:把 idoc 文档重建为 Docx 数据模型,
// 供 docToDocx 在缺少 meta.docx 时降级导出(有损,但保留文本/表格结构与基础样式)。

// px(96dpi)-> twips(1/1440 inch):与 toDoc 的 twipsToPx(=round(twips/15)) 对称
const pxToTwips = (px: number): number => Math.round(px * 15)
// toDoc 给无显式行高的行填的默认值(px),逆向时视为"未设置"以免强制行高
const DEFAULT_LINE_HEIGHT = 24

function isBold(fontWeight?: NormalizedStyle['fontWeight']): boolean {
  return fontWeight === 'bold' || Number(fontWeight) >= 700
}

function fragmentToRun(fragment: NormalizedFragment): Run {
  const run: Run = { text: fragment.content ?? '' }
  if (isBold(fragment.fontWeight)) {
    run.bold = true
  }
  if (fragment.fontStyle === 'italic') {
    run.italic = true
  }
  if (typeof fragment.textDecoration === 'string' && fragment.textDecoration.includes('underline')) {
    run.underline = true
  }
  if (typeof fragment.fontSize === 'number') {
    run.fontSize = fragment.fontSize
  }
  if (typeof fragment.color === 'string') {
    run.color = fragment.color.replace(/^#/, '')
  }
  return run
}

function mapAlign(textAlign?: NormalizedStyle['textAlign']): ParagraphAlign | undefined {
  if (!textAlign) {
    return undefined
  }
  return textAlign === 'justify' ? 'both' : textAlign
}

function paragraphFromIdoc(paragraph: NormalizedParagraph): Paragraph {
  const result: Paragraph = {
    runs: (paragraph.fragments ?? []).map(fragmentToRun),
  }
  const align = mapAlign(paragraph.textAlign)
  if (align) {
    result.align = align
  }
  return result
}

/** 元素及其子树中所有文本块的段落(单元格里 toDoc 会把段落挂到一个文本子元素上) */
function elementParagraphs(el: NormalizedElement): Paragraph[] {
  const paragraphs: Paragraph[] = []
  if (el.text?.content) {
    paragraphs.push(...el.text.content.map(paragraphFromIdoc))
  }
  for (const child of el.children ?? []) {
    paragraphs.push(...elementParagraphs(child))
  }
  return paragraphs
}

// CSS 边框串(toDoc 的 borderToCss 产物 "Npx style #rrggbb")-> w:tcBorders 某边
function cssToBorder(css?: string): TableBorder | undefined {
  if (!css) {
    return undefined
  }
  const matched = /^(\d+)px\s+(\w+)\s+#?([0-9a-f]{3,8})$/i.exec(css.trim())
  if (!matched) {
    return undefined
  }
  const px = Number(matched[1])
  const lineStyle = matched[2].toLowerCase()
  const val = lineStyle === 'dashed'
    ? 'dashed'
    : lineStyle === 'dotted'
      ? 'dotted'
      : lineStyle === 'double'
        ? 'double'
        : 'single'
  return {
    val,
    size: Math.max(2, px * 6), // 八分之一磅,与 borderToCss 的 px=round(size/6) 对称
    color: matched[3].length >= 6 ? matched[3].slice(-6) : matched[3],
  }
}

const STYLE_TO_BORDER: Array<[keyof NormalizedStyle, keyof TableCellBorders]> = [
  ['borderTop', 'top'],
  ['borderLeft', 'left'],
  ['borderBottom', 'bottom'],
  ['borderRight', 'right'],
]

/** idoc cell.background / cell.style -> docx 单元格底纹、对齐、边框 */
function applyCellVisual(tc: TableCell, cell: NormalizedTableCell): void {
  const bgColor = cell.background?.color
  if (typeof bgColor === 'string') {
    tc.shading = bgColor.replace(/^#/, '')
  }
  const style = cell.style
  if (!style) {
    return
  }
  if (style.verticalAlign === 'middle') {
    tc.vAlign = 'center'
  }
  else if (style.verticalAlign === 'top' || style.verticalAlign === 'bottom') {
    tc.vAlign = style.verticalAlign
  }
  const borders: TableCellBorders = {}
  for (const [styleKey, side] of STYLE_TO_BORDER) {
    const border = cssToBorder(style[styleKey] as string | undefined)
    if (border) {
      borders[side] = border
    }
  }
  if (Object.keys(borders).length) {
    tc.borders = borders
  }
}

/** idoc 单元格内容(子树文本)-> docx 单元格段落,并附加底纹/对齐/边框 */
function cellFromIdoc(cell: NormalizedTableCell): TableCell {
  const tc: TableCell = { paragraphs: elementParagraphs({ children: cell.children } as NormalizedElement) }
  applyCellVisual(tc, cell)
  return tc
}

/** idoc element.table -> docx Table:把稀疏的 rowSpan/colSpan 还原为逐格的 gridSpan/vMerge 网格 */
function tableFromElement(table: NormalizedTable): Table {
  const colCount = table.columns.length
  const rowCount = table.rows.length

  // 覆盖图:每个被合并区占据的格子 (r,c) -> 其左上角锚点单元格
  const coverage = new Map<string, NormalizedTableCell>()
  for (const cell of table.cells) {
    const rowSpan = cell.rowSpan ?? 1
    const colSpan = cell.colSpan ?? 1
    for (let r = cell.row; r < cell.row + rowSpan; r++) {
      for (let c = cell.col; c < cell.col + colSpan; c++) {
        coverage.set(`${r},${c}`, cell)
      }
    }
  }

  const rows: TableRow[] = []
  for (let r = 0; r < rowCount; r++) {
    const cells: TableCell[] = []
    let c = 0
    while (c < colCount) {
      const anchor = coverage.get(`${r},${c}`)
      if (anchor) {
        const colSpan = anchor.colSpan ?? 1
        const rowSpan = anchor.rowSpan ?? 1
        const isAnchorRow = r === anchor.row
        const tc: TableCell = isAnchorRow ? cellFromIdoc(anchor) : { paragraphs: [] }
        if (colSpan > 1) {
          tc.colSpan = colSpan
        }
        if (rowSpan > 1) {
          tc.vMerge = isAnchorRow ? 'restart' : 'continue'
        }
        cells.push(tc)
        c += colSpan
      }
      else {
        // 没有对应 idoc 单元格的空位:输出一个空格子以保持网格完整
        cells.push({ paragraphs: [] })
        c += 1
      }
    }
    const row: TableRow = { cells }
    const height = table.rows[r]?.height
    if (typeof height === 'number' && height !== DEFAULT_LINE_HEIGHT) {
      row.height = pxToTwips(height)
    }
    rows.push(row)
  }

  return {
    columns: table.columns.map(col => pxToTwips(col.width ?? 0)),
    rows,
  }
}

/**
 * 把 idoc 文档逆向投影为 Docx 数据模型(toDoc/docxModelToDoc 的逆)。
 * 按 children 顺序:含 table 的元素 -> 表格块,其余含文本的元素 -> 段落块。
 * 用于 docToDocx 在缺少 meta.docx 时的有损降级导出。
 */
export function idocToDocxModel(doc: NormalizedDocument): Docx {
  const blocks: Docx['blocks'] = []
  for (const el of doc.children ?? []) {
    if (el.table) {
      blocks.push(tableFromElement(el.table))
    }
    else {
      const paragraphs = elementParagraphs(el)
      if (paragraphs.length) {
        blocks.push(...paragraphs)
      }
    }
  }
  // 文档至少需要一个段落,否则 Word 视为损坏
  if (!blocks.length) {
    blocks.push({ runs: [] })
  }
  return { blocks }
}
