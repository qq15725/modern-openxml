import type { OoxmlNode } from '../core'
import { escapeXml } from '../utils'
import { SPREADSHEET_NS } from './util'

// xl/sharedStrings.xml
//
// 共享字符串池。每个 <si> 可以是简单文本 <t>,也可以是富文本(多个 <r><t>)。
// MVP 不保留富文本样式,按文本拼接读取。

export function parseSharedStrings(node?: OoxmlNode): string[] {
  if (!node) {
    return []
  }
  // 默认命名空间已被 OoxmlNode.fromXML 去除,故无需前缀。
  // 用 string(.) 取整个 <si> 的文本(自动拼接 <r><t> 富文本)。
  return node.get('//si').map(si => si.attr('.', 'string') ?? '')
}

/**
 * 编码时收集字符串并去重,返回索引。
 */
export class SharedStrings {
  private readonly indexes = new Map<string, number>()
  readonly list: string[] = []

  index(value: string): number {
    let i = this.indexes.get(value)
    if (i === undefined) {
      i = this.list.length
      this.indexes.set(value, i)
      this.list.push(value)
    }
    return i
  }

  get count(): number {
    return this.list.length
  }
}

export function stringifySharedStrings(strings: string[]): string {
  const items = strings
    .map(s => `<si><t xml:space="preserve">${escapeXml(s)}</t></si>`)
    .join('')
  return `<sst xmlns="${SPREADSHEET_NS}" count="${strings.length}" uniqueCount="${strings.length}">${items}</sst>`
}
