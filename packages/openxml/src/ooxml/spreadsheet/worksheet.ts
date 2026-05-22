import type { OoxmlNode } from '../core'
import type { SharedStrings } from './sharedStrings'
import type { Cell, Row, Worksheet } from './types'
import { RELATIONSHIP_NS } from '../namespaces'
import { escapeXml } from '../utils'
import { parseCellRef, toCellRef } from './cellRef'
import { SPREADSHEET_NS } from './util'

// xl/worksheets/sheetN.xml
//
// <sheetData> 下是稀疏的 <row r="1">,行内是 <c r="A1" t="s" s="0">。
// 单元格类型由 @t 决定:
//   s         共享字符串(<v> 为字符串池索引)
//   inlineStr 内联字符串(<is><t>)
//   str       公式的字符串结果(<v>)
//   b         布尔(<v> 为 1/0)
//   (缺省)/n 数值(<v>)
// 公式存放在 <f> 中,<v> 为缓存结果。

function parseCell(node: OoxmlNode, sharedStrings: string[]): Cell | undefined {
  const ref = node.attr('@r')
  if (!ref) {
    return undefined
  }
  const { row, col } = parseCellRef(ref)
  const t = node.attr('@t')
  const formula = node.attr('f', 'string')

  let value: Cell['value'] = null
  let type: Cell['type'] = 'number'

  if (t === 's') {
    const index = node.attr<number>('v', 'number')
    value = index === undefined ? '' : (sharedStrings[index] ?? '')
    type = 'string'
  }
  else if (t === 'inlineStr') {
    value = node.attr('is', 'string') ?? ''
    type = 'string'
  }
  else if (t === 'str') {
    value = node.attr('v', 'string') ?? ''
    type = 'string'
  }
  else if (t === 'b') {
    value = node.attr<boolean>('v', 'boolean') ?? false
    type = 'boolean'
  }
  else {
    // number(缺省或 t="n")
    const raw = node.attr('v', 'string')
    value = raw === undefined ? null : Number(raw)
    type = 'number'
  }

  // 既无值也无公式的空单元格直接跳过
  if (value === null && formula === undefined) {
    return undefined
  }

  const cell: Cell = { ref, row, col, value, type }
  if (formula !== undefined) {
    cell.formula = formula
  }
  return cell
}

export function parseWorksheet(node: OoxmlNode | undefined, name: string, sharedStrings: string[]): Worksheet {
  if (!node) {
    return { name, rows: [] }
  }
  const rows: Row[] = node.get('sheetData/row').map((rowNode, i) => {
    const index = rowNode.attr<number>('@r', 'number') ?? i + 1
    const cells = rowNode
      .get('c')
      .map(c => parseCell(c, sharedStrings))
      .filter((c): c is Cell => Boolean(c))
    return { index, cells }
  })
  return { name, rows }
}

function stringifyCell(cell: Cell, sharedStrings: SharedStrings): string {
  const ref = cell.ref || toCellRef(cell.row, cell.col)
  const parts: string[] = []
  let typeAttr = ''

  if (cell.formula !== undefined) {
    parts.push(`<f>${escapeXml(cell.formula)}</f>`)
    if (cell.value !== null && cell.value !== '') {
      if (typeof cell.value === 'string') {
        typeAttr = ' t="str"'
        parts.push(`<v>${escapeXml(cell.value)}</v>`)
      }
      else if (typeof cell.value === 'boolean') {
        typeAttr = ' t="b"'
        parts.push(`<v>${cell.value ? 1 : 0}</v>`)
      }
      else {
        parts.push(`<v>${cell.value}</v>`)
      }
    }
  }
  else if (cell.value === null || cell.value === '') {
    return ''
  }
  else if (typeof cell.value === 'string') {
    typeAttr = ' t="s"'
    parts.push(`<v>${sharedStrings.index(cell.value)}</v>`)
  }
  else if (typeof cell.value === 'boolean') {
    typeAttr = ' t="b"'
    parts.push(`<v>${cell.value ? 1 : 0}</v>`)
  }
  else {
    parts.push(`<v>${cell.value}</v>`)
  }

  return `<c r="${ref}"${typeAttr}>${parts.join('')}</c>`
}

export function stringifyWorksheet(sheet: Worksheet, sharedStrings: SharedStrings): string {
  const rows = sheet.rows
    .map((row) => {
      const cells = row.cells.map(c => stringifyCell(c, sharedStrings)).join('')
      return `<row r="${row.index}">${cells}</row>`
    })
    .join('')
  return `<worksheet xmlns="${SPREADSHEET_NS}" xmlns:r="${RELATIONSHIP_NS}"><sheetData>${rows}</sheetData></worksheet>`
}
