import type { Unzipped } from 'fflate'
import type { Docx } from '../ooxml'
import { zipSync } from 'fflate'
import {
  compressXml,
  stringifyCoreProperties,
  stringifyDocument,
  stringifyRelationships,
  stringifyTypes,
  withXmlHeader,
  WORD_NS,
} from '../ooxml'

// 最小可用的 styles.xml 骨架(MVP 不做样式定义,但 Word 期望该部件存在)。
const MINIMAL_STYLES = `<w:styles xmlns:w="${WORD_NS}">`
  + `<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault></w:docDefaults>`
  + `<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>`
  + `</w:styles>`

const APP_PROPERTIES = `<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">`
  + `<Application>modern-openxml</Application>`
  + `</Properties>`

/**
 * 把 Docx 数据模型编码为 docx(OPC 包)字节。流程对照 JsonToXlsx.encode。
 */
export class JsonToDocx {
  async encode(docx: Docx): Promise<Uint8Array> {
    const unzipped: Unzipped = {}
    const add = (path: string, content: string): void => {
      unzipped[path] = new TextEncoder().encode(withXmlHeader(compressXml(content)))
    }

    // word/document.xml + 关系
    add('word/document.xml', stringifyDocument(docx.blocks ?? []))
    add('word/_rels/document.xml.rels', stringifyRelationships(['styles.xml']))
    add('word/styles.xml', MINIMAL_STYLES)

    // docProps
    add('docProps/core.xml', stringifyCoreProperties({}))
    add('docProps/app.xml', APP_PROPERTIES)

    // 根关系
    add('_rels/.rels', stringifyRelationships([
      'word/document.xml',
      'docProps/core.xml',
      'docProps/app.xml',
    ]))

    // [Content_Types].xml
    add('[Content_Types].xml', stringifyTypes(Object.keys(unzipped)))

    return zipSync(unzipped)
  }
}
