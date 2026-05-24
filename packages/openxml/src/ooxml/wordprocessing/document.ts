import type { OoxmlNode } from '../core'
import type { Block, Paragraph, Run, Table, TableBorder, TableCell, TableCellBorders, TableRow } from './types'
import { RELATIONSHIP_NS } from '../namespaces'
import { escapeXml } from '../utils'
import { isTable } from './types'
import { WORD_NS } from './util'

// word/document.xml
//
// <w:document><w:body> 下是 <w:p> 段落,段落里是 <w:r> run,run 里 <w:t> 文本。
// 注意:WordprocessingML 使用 w: 前缀命名空间(已在 namespaces.ts 注册),
// 故查询都带 w: 前缀(与默认命名空间被剥离的 SpreadsheetML 不同)。

const TOGGLE_OFF = new Set(['false', '0', 'off'])

/** 处理 <w:b/>、<w:i/> 这类开关属性:元素存在即开启,除非 w:val 显式为 false/0/off */
function isToggleOn(node?: OoxmlNode): boolean {
  if (!node) {
    return false
  }
  const val = node.attr('@w:val')
  return val === undefined || !TOGGLE_OFF.has(val)
}

function parseRun(node: OoxmlNode): Run {
  // run 的字符串值即其全部 <w:t> 文本(w:rPr 不含文本)
  const run: Run = { text: node.attr('.', 'string') ?? '' }

  const rPr = node.find('w:rPr')
  if (rPr) {
    if (isToggleOn(rPr.find('w:b'))) {
      run.bold = true
    }
    if (isToggleOn(rPr.find('w:i'))) {
      run.italic = true
    }
    const u = rPr.attr('w:u/@w:val')
    if (u && u !== 'none') {
      run.underline = true
    }
    const sz = rPr.attr<number>('w:sz/@w:val', 'number')
    if (sz !== undefined) {
      run.fontSize = sz / 2 // 半磅 -> 磅
    }
    const color = rPr.attr('w:color/@w:val')
    if (color && color !== 'auto') {
      run.color = color
    }
  }

  return run
}

function parseParagraph(node: OoxmlNode): Paragraph {
  const paragraph: Paragraph = {
    runs: node.get('w:r').map(parseRun),
  }
  const style = node.attr('w:pPr/w:pStyle/@w:val')
  if (style) {
    paragraph.style = style
  }
  const align = node.attr('w:pPr/w:jc/@w:val')
  if (align) {
    paragraph.align = align
  }
  return paragraph
}

const BORDER_SIDES = ['top', 'left', 'bottom', 'right'] as const

function parseTableCell(node: OoxmlNode): TableCell {
  const cell: TableCell = { paragraphs: node.get('w:p').map(parseParagraph) }
  const colSpan = node.attr<number>('w:tcPr/w:gridSpan/@w:val', 'number')
  if (colSpan && colSpan > 1) {
    cell.colSpan = colSpan
  }
  const vMerge = node.find('w:tcPr/w:vMerge')
  if (vMerge) {
    cell.vMerge = vMerge.attr('@w:val') === 'restart' ? 'restart' : 'continue'
  }
  const shading = node.attr('w:tcPr/w:shd/@w:fill')
  if (shading && shading !== 'auto') {
    cell.shading = shading
  }
  const vAlign = node.attr('w:tcPr/w:vAlign/@w:val')
  if (vAlign === 'top' || vAlign === 'center' || vAlign === 'bottom') {
    cell.vAlign = vAlign
  }
  const borders: TableCellBorders = {}
  for (const side of BORDER_SIDES) {
    const b = node.find(`w:tcPr/w:tcBorders/w:${side}`)
    if (b) {
      borders[side] = {
        val: b.attr('@w:val'),
        size: b.attr<number>('@w:sz', 'number'),
        color: b.attr('@w:color'),
      }
    }
  }
  if (Object.keys(borders).length) {
    cell.borders = borders
  }
  return cell
}

function parseTableRow(node: OoxmlNode): TableRow {
  const row: TableRow = { cells: node.get('w:tc').map(parseTableCell) }
  const height = node.attr<number>('w:trPr/w:trHeight/@w:val', 'number')
  if (height !== undefined) {
    row.height = height
  }
  return row
}

function parseTable(node: OoxmlNode): Table {
  return {
    columns: node.get('w:tblGrid/w:gridCol').map(g => g.attr<number>('@w:w', 'number') ?? 0),
    rows: node.get('w:tr').map(parseTableRow),
  }
}

export function parseDocument(node?: OoxmlNode): Block[] {
  if (!node) {
    return []
  }
  // 按出现顺序遍历正文(段落与表格交错),跳过 w:sectPr 等
  const blocks: Block[] = []
  for (const child of node.get('w:body/*')) {
    if (child.name === 'w:p') {
      blocks.push(parseParagraph(child))
    }
    else if (child.name === 'w:tbl') {
      blocks.push(parseTable(child))
    }
  }
  return blocks
}

function stringifyRun(run: Run): string {
  const rPr: string[] = []
  if (run.bold) {
    rPr.push('<w:b/>')
  }
  if (run.italic) {
    rPr.push('<w:i/>')
  }
  if (run.underline) {
    rPr.push('<w:u w:val="single"/>')
  }
  if (run.fontSize !== undefined) {
    rPr.push(`<w:sz w:val="${Math.round(run.fontSize * 2)}"/>`)
  }
  if (run.color) {
    rPr.push(`<w:color w:val="${escapeXml(run.color)}"/>`)
  }
  const rPrXml = rPr.length ? `<w:rPr>${rPr.join('')}</w:rPr>` : ''
  return `<w:r>${rPrXml}<w:t xml:space="preserve">${escapeXml(run.text)}</w:t></w:r>`
}

function stringifyParagraph(paragraph: Paragraph): string {
  const pPr: string[] = []
  if (paragraph.style) {
    pPr.push(`<w:pStyle w:val="${escapeXml(paragraph.style)}"/>`)
  }
  if (paragraph.align) {
    pPr.push(`<w:jc w:val="${escapeXml(paragraph.align)}"/>`)
  }
  const pPrXml = pPr.length ? `<w:pPr>${pPr.join('')}</w:pPr>` : ''
  const runs = (paragraph.runs ?? []).map(stringifyRun).join('')
  return `<w:p>${pPrXml}${runs}</w:p>`
}

function stringifyBorder(side: string, border: TableBorder): string {
  const attrs = [`w:val="${escapeXml(border.val ?? 'single')}"`]
  if (border.size !== undefined) {
    attrs.push(`w:sz="${border.size}"`)
  }
  if (border.color !== undefined) {
    attrs.push(`w:color="${escapeXml(border.color)}"`)
  }
  return `<w:${side} ${attrs.join(' ')}/>`
}

function stringifyTableCell(cell: TableCell): string {
  const tcPr: string[] = []
  if (cell.colSpan && cell.colSpan > 1) {
    tcPr.push(`<w:gridSpan w:val="${cell.colSpan}"/>`)
  }
  if (cell.vMerge) {
    tcPr.push(cell.vMerge === 'restart' ? '<w:vMerge w:val="restart"/>' : '<w:vMerge/>')
  }
  if (cell.borders) {
    const sides = BORDER_SIDES
      .filter(side => cell.borders![side])
      .map(side => stringifyBorder(side, cell.borders![side]!))
      .join('')
    if (sides) {
      tcPr.push(`<w:tcBorders>${sides}</w:tcBorders>`)
    }
  }
  if (cell.shading) {
    tcPr.push(`<w:shd w:val="clear" w:color="auto" w:fill="${escapeXml(cell.shading)}"/>`)
  }
  if (cell.vAlign) {
    tcPr.push(`<w:vAlign w:val="${cell.vAlign}"/>`)
  }
  const tcPrXml = tcPr.length ? `<w:tcPr>${tcPr.join('')}</w:tcPr>` : ''
  // w:tc 至少要有一个 w:p
  const paragraphs = cell.paragraphs.length ? cell.paragraphs.map(stringifyParagraph).join('') : '<w:p/>'
  return `<w:tc>${tcPrXml}${paragraphs}</w:tc>`
}

function stringifyTableRow(row: TableRow): string {
  const trPr = row.height !== undefined ? `<w:trPr><w:trHeight w:val="${row.height}"/></w:trPr>` : ''
  return `<w:tr>${trPr}${row.cells.map(stringifyTableCell).join('')}</w:tr>`
}

function stringifyTable(table: Table): string {
  const grid = table.columns.map(w => `<w:gridCol w:w="${w}"/>`).join('')
  const rows = table.rows.map(stringifyTableRow).join('')
  return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rows}</w:tbl>`
}

function stringifyBlock(block: Block): string {
  return isTable(block) ? stringifyTable(block) : stringifyParagraph(block)
}

export function stringifyDocument(blocks: Block[]): string {
  const body = blocks.map(stringifyBlock).join('')
  return `<w:document xmlns:w="${WORD_NS}" xmlns:r="${RELATIONSHIP_NS}">`
    + `<w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr></w:body>`
    + `</w:document>`
}
