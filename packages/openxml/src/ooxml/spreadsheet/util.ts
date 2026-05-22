export const SPREADSHEET_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
export const RELATIONSHIP_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

/**
 * 转义 XML 文本内容中的特殊字符。
 *
 * 注意:转义 `"` 为 `&quot;` 还能让 compressXml 折叠属性空格的正则失效,
 * 从而避免单元格文本中形如 `a="b"` 的内容被破坏。
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
