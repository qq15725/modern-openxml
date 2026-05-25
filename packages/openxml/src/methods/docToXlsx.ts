import type { NormalizedDocument } from 'modern-idoc'
import { idocToWorkbookModel } from '../ooxml'
import { jsonToXlsx } from './jsonToXlsx'

/**
 * 把 idoc 文档编码回 xlsx。优先用 meta.workbook(由 xlsxToDoc 写入)无损回写;
 * 若缺失则像 docToPptx 那样从 idoc 模型重建网格导出(有损:丢失公式/数字格式/样式,
 * 但保留单元格值、网格几何与合并)。
 */
export async function docToXlsx(doc: NormalizedDocument): Promise<Uint8Array> {
  const workbook = (doc.meta as { workbook?: Parameters<typeof jsonToXlsx>[0] } | undefined)?.workbook
    ?? idocToWorkbookModel(doc)
  return await jsonToXlsx(workbook)
}
