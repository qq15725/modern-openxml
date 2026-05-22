import type { OoxmlNode } from '../core'
import { escapeXml, RELATIONSHIP_NS, SPREADSHEET_NS } from './util'

// xl/workbook.xml
//
// 定义工作表清单:每个 <sheet> 有 name、sheetId 以及指向 worksheet 部件的 r:id。

export interface WorkbookSheetRef {
  name: string
  sheetId: number
  /** 指向 xl/_rels/workbook.xml.rels 中对应 worksheet 的关系 id */
  rId: string
}

export function parseWorkbook(node?: OoxmlNode): WorkbookSheetRef[] {
  if (!node) {
    return []
  }
  return node.get('sheets/sheet').map((sheet, i) => {
    return {
      name: sheet.attr('@name') ?? `Sheet${i + 1}`,
      sheetId: sheet.attr<number>('@sheetId', 'number') ?? i + 1,
      rId: sheet.attr('@r:id') ?? `rId${i + 1}`,
    }
  })
}

/**
 * 生成 workbook.xml。sheet 的 r:id 取 rId1..N,与 workbook.xml.rels 中
 * worksheet 关系按相同顺序排列一致。
 */
export function stringifyWorkbook(sheetNames: string[]): string {
  const sheets = sheetNames
    .map((name, i) => `<sheet name="${escapeXml(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`)
    .join('')
  return `<workbook xmlns="${SPREADSHEET_NS}" xmlns:r="${RELATIONSHIP_NS}"><sheets>${sheets}</sheets></workbook>`
}
