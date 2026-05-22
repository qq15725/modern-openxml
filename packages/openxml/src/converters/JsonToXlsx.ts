import type { Unzipped } from 'fflate'
import type { Workbook } from '../ooxml'
import { zipSync } from 'fflate'
import {
  compressXml,
  SharedStrings,
  SPREADSHEET_NS,
  stringifyCoreProperties,
  stringifyRelationships,
  stringifySharedStrings,
  stringifyTypes,
  stringifyWorkbook,
  stringifyWorksheet,
  withXmlHeader,
} from '../ooxml'

// 最小可用的 styles.xml 骨架(MVP 不做样式,但 Excel 要求该部件存在且合法)。
// fills 至少 2 项(none + gray125)以符合 Excel 预期。
const MINIMAL_STYLES = `<styleSheet xmlns="${SPREADSHEET_NS}">`
  + `<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>`
  + `<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>`
  + `<borders count="1"><border/></borders>`
  + `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>`
  + `<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>`
  + `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>`
  + `</styleSheet>`

const APP_PROPERTIES = `<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">`
  + `<Application>modern-openxml</Application>`
  + `</Properties>`

/**
 * 把 Workbook 数据模型编码为 xlsx(OPC 包)字节。
 *
 * 流程对照 DocToPptx.encode:逐个 add() 各部件,先序列化 worksheet 以收集
 * 共享字符串,再写 sharedStrings.xml,最后写关系与 [Content_Types].xml 并打包。
 */
export class JsonToXlsx {
  async encode(workbook: Workbook): Promise<Uint8Array> {
    const unzipped: Unzipped = {}
    const add = (path: string, content: string): void => {
      unzipped[path] = new TextEncoder().encode(withXmlHeader(compressXml(content)))
    }

    const sheets = workbook.sheets ?? []
    const sharedStrings = new SharedStrings()

    // xl/worksheets/sheetN.xml(先序列化以填充共享字符串池)
    const worksheetTargets: string[] = []
    sheets.forEach((sheet, i) => {
      const num = i + 1
      add(`xl/worksheets/sheet${num}.xml`, stringifyWorksheet(sheet, sharedStrings))
      worksheetTargets.push(`worksheets/sheet${num}.xml`)
    })

    // xl/sharedStrings.xml
    add('xl/sharedStrings.xml', stringifySharedStrings(sharedStrings.list))

    // xl/styles.xml
    add('xl/styles.xml', MINIMAL_STYLES)

    // xl/workbook.xml + 关系
    add('xl/workbook.xml', stringifyWorkbook(sheets.map(s => s.name)))
    add('xl/_rels/workbook.xml.rels', stringifyRelationships([
      ...worksheetTargets,
      'sharedStrings.xml',
      'styles.xml',
    ]))

    // docProps
    add('docProps/core.xml', stringifyCoreProperties({}))
    add('docProps/app.xml', APP_PROPERTIES)

    // 根关系
    add('_rels/.rels', stringifyRelationships([
      'xl/workbook.xml',
      'docProps/core.xml',
      'docProps/app.xml',
    ]))

    // [Content_Types].xml
    add('[Content_Types].xml', stringifyTypes(Object.keys(unzipped)))

    return zipSync(unzipped)
  }
}
