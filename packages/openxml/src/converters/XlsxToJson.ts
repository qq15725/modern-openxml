import type { Workbook } from '../ooxml'
import type { OpcSource } from './OpcReader'
import {
  parseRelationships,
  parseSharedStrings,
  parseTypes,
  parseWorkbook,
  parseWorksheet,
} from '../ooxml'
import { OpcReader } from './OpcReader'

export type XlsxSource = OpcSource

/**
 * 解码 xlsx(OPC 包)为 Workbook 数据模型。
 *
 * 流程对照 PptxToDoc.decode:
 *   [Content_Types].xml → _rels/.rels → 定位 workbook →
 *   解析 workbook.xml 拿到 sheet 清单 → 读 workbook.xml.rels 把 rId 映射到部件 →
 *   解析 sharedStrings → 逐个 worksheet 解析。
 */
export class XlsxToJson extends OpcReader {
  async decode(source: XlsxSource): Promise<Workbook> {
    await this._open(source)

    // [Content_Types].xml
    const contentTypes = parseTypes(this._readNode('[Content_Types].xml'))

    // _rels/.rels
    const relsPath = this._getRelsPath()
    const rels = parseRelationships(this._readNode(relsPath), relsPath, contentTypes)

    // xl/workbook.xml
    const workbookPath = rels.find(v => v.type === 'workbook')?.path
    const workbookNode = this._readNode(workbookPath)
    const sheetRefs = parseWorkbook(workbookNode)

    // xl/_rels/workbook.xml.rels
    const workbookRelsPath = this._getRelsPath(workbookPath)
    const workbookRels = parseRelationships(this._readNode(workbookRelsPath), workbookRelsPath, contentTypes)

    // xl/sharedStrings.xml
    const sharedStringsPath = workbookRels.find(v => v.type === 'sharedStrings')?.path
    const sharedStrings = sharedStringsPath
      ? parseSharedStrings(this._readNode(sharedStringsPath))
      : []

    // xl/worksheets/sheetN.xml
    const sheets = sheetRefs.map((ref) => {
      const path = workbookRels.find(v => v.id === ref.rId)?.path
      return parseWorksheet(path ? this._readNode(path) : undefined, ref.name, sharedStrings)
    })

    return { sheets }
  }
}
