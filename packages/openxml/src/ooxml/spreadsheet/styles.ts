import type { OoxmlNode } from '../core'
import { escapeXml } from '../utils'
import { SPREADSHEET_NS } from './util'

// xl/styles.xml
//
// 单元格通过 <c s="N"> 引用 cellXfs[N];cellXf 再引用 numFmt / font / fill /
// border。这里做结构化解析(只覆盖渲染需要的子集)+ 稳定回写。

const TOGGLE_OFF = new Set(['false', '0'])
function isOn(node?: OoxmlNode): boolean {
  if (!node) {
    return false
  }
  const val = node.attr('@val')
  return val === undefined || !TOGGLE_OFF.has(val)
}

export interface XlsxFont {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  /** 字号(磅) */
  size?: number
  /** ARGB,如 "FFFF0000" */
  color?: string
  name?: string
}

export interface XlsxFill {
  /** 'none' | 'gray125' | 'solid' | ... */
  patternType?: string
  /** 前景色 ARGB(solid 时即填充色) */
  fgColor?: string
  bgColor?: string
}

export interface XlsxBorderEdge {
  /** 'thin' | 'medium' | 'thick' | 'dashed' | ... */
  style?: string
  color?: string
}

export interface XlsxBorder {
  left?: XlsxBorderEdge
  right?: XlsxBorderEdge
  top?: XlsxBorderEdge
  bottom?: XlsxBorderEdge
}

export interface XlsxAlignment {
  horizontal?: string
  vertical?: string
  wrapText?: boolean
}

export interface CellXf {
  numFmtId?: number
  fontId?: number
  fillId?: number
  borderId?: number
  xfId?: number
  applyNumberFormat?: boolean
  applyFont?: boolean
  applyFill?: boolean
  applyBorder?: boolean
  applyAlignment?: boolean
  alignment?: XlsxAlignment
}

export interface Styles {
  numFmts: { id: number, formatCode: string }[]
  fonts: XlsxFont[]
  fills: XlsxFill[]
  borders: XlsxBorder[]
  cellXfs: CellXf[]
}

export interface ResolvedCellStyle {
  font?: XlsxFont
  fill?: XlsxFill
  border?: XlsxBorder
  alignment?: XlsxAlignment
  /** 数字格式代码(内置或自定义) */
  formatCode?: string
}

// 常用内置数字格式(节选)
const BUILTIN_NUM_FMTS: Record<number, string> = {
  9: '0%',
  10: '0.00%',
  14: 'mm-dd-yy',
  15: 'd-mmm-yy',
  16: 'd-mmm',
  17: 'mmm-yy',
  22: 'm/d/yy h:mm',
  45: 'mm:ss',
  46: '[h]:mm:ss',
  47: 'mmss.0',
}

function parseFont(node: OoxmlNode): XlsxFont {
  const font: XlsxFont = {}
  if (isOn(node.find('b'))) {
    font.bold = true
  }
  if (isOn(node.find('i'))) {
    font.italic = true
  }
  if (node.find('u')) {
    font.underline = true
  }
  const size = node.attr<number>('sz/@val', 'number')
  if (size !== undefined) {
    font.size = size
  }
  const color = node.attr('color/@rgb')
  if (color) {
    font.color = color
  }
  const name = node.attr('name/@val')
  if (name) {
    font.name = name
  }
  return font
}

function parseFill(node: OoxmlNode): XlsxFill {
  const pf = node.find('patternFill')
  const fill: XlsxFill = {}
  const patternType = pf?.attr('@patternType')
  if (patternType) {
    fill.patternType = patternType
  }
  const fgColor = pf?.attr('fgColor/@rgb')
  if (fgColor) {
    fill.fgColor = fgColor
  }
  const bgColor = pf?.attr('bgColor/@rgb')
  if (bgColor) {
    fill.bgColor = bgColor
  }
  return fill
}

function parseBorderEdge(node?: OoxmlNode): XlsxBorderEdge | undefined {
  const style = node?.attr('@style')
  if (!node || !style) {
    return undefined
  }
  const edge: XlsxBorderEdge = { style }
  const color = node.attr('color/@rgb')
  if (color) {
    edge.color = color
  }
  return edge
}

function parseBorder(node: OoxmlNode): XlsxBorder {
  const border: XlsxBorder = {}
  const left = parseBorderEdge(node.find('left'))
  const right = parseBorderEdge(node.find('right'))
  const top = parseBorderEdge(node.find('top'))
  const bottom = parseBorderEdge(node.find('bottom'))
  if (left) {
    border.left = left
  }
  if (right) {
    border.right = right
  }
  if (top) {
    border.top = top
  }
  if (bottom) {
    border.bottom = bottom
  }
  return border
}

function parseXf(node: OoxmlNode): CellXf {
  const xf: CellXf = {}
  const ids = ['numFmtId', 'fontId', 'fillId', 'borderId', 'xfId'] as const
  for (const key of ids) {
    const v = node.attr<number>(`@${key}`, 'number')
    if (v !== undefined) {
      xf[key] = v
    }
  }
  const applies = ['applyNumberFormat', 'applyFont', 'applyFill', 'applyBorder', 'applyAlignment'] as const
  for (const key of applies) {
    if (node.attr<boolean>(`@${key}`, 'boolean')) {
      xf[key] = true
    }
  }
  const al = node.find('alignment')
  if (al) {
    const alignment: XlsxAlignment = {}
    const h = al.attr('@horizontal')
    const v = al.attr('@vertical')
    if (h) {
      alignment.horizontal = h
    }
    if (v) {
      alignment.vertical = v
    }
    if (al.attr<boolean>('@wrapText', 'boolean')) {
      alignment.wrapText = true
    }
    if (Object.keys(alignment).length) {
      xf.alignment = alignment
    }
  }
  return xf
}

export function parseStyles(node?: OoxmlNode): Styles | undefined {
  if (!node || !node.name) {
    return undefined
  }
  return {
    numFmts: node.get('numFmts/numFmt').map(n => ({
      id: n.attr<number>('@numFmtId', 'number') ?? 0,
      formatCode: n.attr('@formatCode') ?? '',
    })),
    fonts: node.get('fonts/font').map(parseFont),
    fills: node.get('fills/fill').map(parseFill),
    borders: node.get('borders/border').map(parseBorder),
    cellXfs: node.get('cellXfs/xf').map(parseXf),
  }
}

/** 按单元格 styleId 解析出有效样式 */
export function resolveCellStyle(styles: Styles | undefined, styleId?: number): ResolvedCellStyle | undefined {
  if (!styles || styleId === undefined) {
    return undefined
  }
  const xf = styles.cellXfs[styleId]
  if (!xf) {
    return undefined
  }
  const resolved: ResolvedCellStyle = {}
  if (xf.fontId !== undefined) {
    resolved.font = styles.fonts[xf.fontId]
  }
  if (xf.fillId !== undefined) {
    resolved.fill = styles.fills[xf.fillId]
  }
  if (xf.borderId !== undefined) {
    resolved.border = styles.borders[xf.borderId]
  }
  if (xf.alignment) {
    resolved.alignment = xf.alignment
  }
  if (xf.numFmtId !== undefined && xf.numFmtId !== 0) {
    resolved.formatCode = styles.numFmts.find(f => f.id === xf.numFmtId)?.formatCode
      ?? BUILTIN_NUM_FMTS[xf.numFmtId]
  }
  return resolved
}

// ───────────── stringify ─────────────

function stringifyFont(font: XlsxFont): string {
  const parts: string[] = []
  if (font.bold) {
    parts.push('<b/>')
  }
  if (font.italic) {
    parts.push('<i/>')
  }
  if (font.underline) {
    parts.push('<u/>')
  }
  if (font.size !== undefined) {
    parts.push(`<sz val="${font.size}"/>`)
  }
  if (font.color) {
    parts.push(`<color rgb="${escapeXml(font.color)}"/>`)
  }
  if (font.name) {
    parts.push(`<name val="${escapeXml(font.name)}"/>`)
  }
  return `<font>${parts.join('')}</font>`
}

function stringifyFill(fill: XlsxFill): string {
  const attrs = fill.patternType ? ` patternType="${escapeXml(fill.patternType)}"` : ''
  const inner = [
    fill.fgColor ? `<fgColor rgb="${escapeXml(fill.fgColor)}"/>` : '',
    fill.bgColor ? `<bgColor rgb="${escapeXml(fill.bgColor)}"/>` : '',
  ].join('')
  return `<fill><patternFill${attrs}>${inner}</patternFill></fill>`
}

function stringifyBorderEdge(name: string, edge?: XlsxBorderEdge): string {
  if (!edge) {
    return `<${name}/>`
  }
  const styleAttr = edge.style ? ` style="${escapeXml(edge.style)}"` : ''
  const color = edge.color ? `<color rgb="${escapeXml(edge.color)}"/>` : ''
  return `<${name}${styleAttr}>${color}</${name}>`
}

function stringifyBorder(border: XlsxBorder): string {
  return `<border>${stringifyBorderEdge('left', border.left)}${stringifyBorderEdge('right', border.right)}`
    + `${stringifyBorderEdge('top', border.top)}${stringifyBorderEdge('bottom', border.bottom)}<diagonal/></border>`
}

function stringifyXf(xf: CellXf, withXfId: boolean): string {
  const attrs = [
    `numFmtId="${xf.numFmtId ?? 0}"`,
    `fontId="${xf.fontId ?? 0}"`,
    `fillId="${xf.fillId ?? 0}"`,
    `borderId="${xf.borderId ?? 0}"`,
  ]
  if (withXfId) {
    attrs.push(`xfId="${xf.xfId ?? 0}"`)
  }
  for (const key of ['applyNumberFormat', 'applyFont', 'applyFill', 'applyBorder', 'applyAlignment'] as const) {
    if (xf[key]) {
      attrs.push(`${key}="1"`)
    }
  }
  if (xf.alignment) {
    const al = xf.alignment
    const alAttrs = [
      al.horizontal ? `horizontal="${escapeXml(al.horizontal)}"` : '',
      al.vertical ? `vertical="${escapeXml(al.vertical)}"` : '',
      al.wrapText ? `wrapText="1"` : '',
    ].filter(Boolean).join(' ')
    return `<xf ${attrs.join(' ')}><alignment ${alAttrs}/></xf>`
  }
  return `<xf ${attrs.join(' ')}/>`
}

export function stringifyStyles(styles: Styles): string {
  const numFmts = styles.numFmts.length
    ? `<numFmts count="${styles.numFmts.length}">${styles.numFmts
      .map(f => `<numFmt numFmtId="${f.id}" formatCode="${escapeXml(f.formatCode)}"/>`)
      .join('')}</numFmts>`
    : ''
  const fonts = styles.fonts.length ? styles.fonts : [{}]
  const fills = styles.fills.length ? styles.fills : [{ patternType: 'none' }, { patternType: 'gray125' }]
  const borders = styles.borders.length ? styles.borders : [{}]
  const cellXfs = styles.cellXfs.length ? styles.cellXfs : [{}]

  return `<styleSheet xmlns="${SPREADSHEET_NS}">${
    numFmts
  }<fonts count="${fonts.length}">${fonts.map(stringifyFont).join('')}</fonts>`
  + `<fills count="${fills.length}">${fills.map(stringifyFill).join('')}</fills>`
  + `<borders count="${borders.length}">${borders.map(stringifyBorder).join('')}</borders>`
  + `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>`
  + `<cellXfs count="${cellXfs.length}">${cellXfs.map(xf => stringifyXf(xf, true)).join('')}</cellXfs>`
  + `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>`
  + `</styleSheet>`
}
