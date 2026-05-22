import type { DocxSource } from '../converters'
import type { NormalizedDocx } from '../ooxml'
import { docxModelToDoc } from '../ooxml'
import { docxToJson } from './docxToJson'

/**
 * 解码 docx 为 idoc 文档(NormalizedDocx)。原始 Docx 模型保留在 meta.docx,
 * 可用 docToDocx 无损回写。
 */
export async function docxToDoc(source: DocxSource): Promise<NormalizedDocx> {
  return docxModelToDoc(await docxToJson(source))
}
