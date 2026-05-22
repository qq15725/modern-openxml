import type { OoxmlNode } from '../core'
import type { Paragraph, Run } from './types'
import { RELATIONSHIP_NS } from '../namespaces'
import { escapeXml } from '../utils'
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

export function parseDocument(node?: OoxmlNode): Paragraph[] {
  if (!node) {
    return []
  }
  return node.get('w:body/w:p').map(parseParagraph)
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

export function stringifyDocument(paragraphs: Paragraph[]): string {
  const body = paragraphs.map(stringifyParagraph).join('')
  return `<w:document xmlns:w="${WORD_NS}" xmlns:r="${RELATIONSHIP_NS}">`
    + `<w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr></w:body>`
    + `</w:document>`
}
