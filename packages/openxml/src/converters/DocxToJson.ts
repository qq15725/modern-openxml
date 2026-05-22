import type { Docx } from '../ooxml'
import type { OpcSource } from './OpcReader'
import { parseDocument, parseRelationships, parseTypes } from '../ooxml'
import { OpcReader } from './OpcReader'

export type DocxSource = OpcSource

/**
 * 解码 docx(OPC 包)为 Docx 数据模型。
 *
 * 流程对照 XlsxToJson.decode:
 *   [Content_Types].xml → _rels/.rels → 定位 word/document.xml → 解析段落。
 * MVP 只取正文段落与 run 文本/基础格式,不解析样式定义、表格、图片等。
 */
export class DocxToJson extends OpcReader {
  async decode(source: DocxSource): Promise<Docx> {
    await this._open(source)

    // [Content_Types].xml
    const contentTypes = parseTypes(this._readNode('[Content_Types].xml'))

    // _rels/.rels
    const relsPath = this._getRelsPath()
    const rels = parseRelationships(this._readNode(relsPath), relsPath, contentTypes)

    // word/document.xml
    const documentPath = rels.find(v => v.type === 'document')?.path
    const paragraphs = parseDocument(documentPath ? this._readNode(documentPath) : undefined)

    return { paragraphs }
  }
}
