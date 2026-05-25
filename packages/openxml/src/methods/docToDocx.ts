import type { NormalizedDocument } from 'modern-idoc'
import { idocToDocxModel } from '../ooxml'
import { jsonToDocx } from './jsonToDocx'

/**
 * 把 idoc 文档编码回 docx。优先用 meta.docx(由 docxToDoc 写入)无损回写;
 * 若缺失则像 docToPptx 那样从 idoc 模型重建导出(有损,但保留文本/表格结构)。
 */
export async function docToDocx(doc: NormalizedDocument): Promise<Uint8Array> {
  const docx = (doc.meta as { docx?: Parameters<typeof jsonToDocx>[0] } | undefined)?.docx
    ?? idocToDocxModel(doc)
  return await jsonToDocx(docx)
}
