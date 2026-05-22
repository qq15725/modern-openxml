import type { NormalizedDocx } from '../ooxml'
import { jsonToDocx } from './jsonToDocx'

/**
 * 把 idoc 文档(NormalizedDocx)编码回 docx。无损往返依赖 meta.docx
 * (由 docxToDoc 写入);若缺失则抛错。
 */
export async function docToDocx(doc: NormalizedDocx): Promise<Uint8Array> {
  const docx = doc.meta?.docx
  if (!docx) {
    throw new Error('docToDocx requires meta.docx (produced by docxToDoc) for lossless encoding')
  }
  return await jsonToDocx(docx)
}
