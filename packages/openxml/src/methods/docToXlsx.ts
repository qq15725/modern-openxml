import type { NormalizedXlsx } from '../ooxml'
import { jsonToXlsx } from './jsonToXlsx'

/**
 * 把 idoc 文档(NormalizedXlsx)编码回 xlsx。无损往返依赖 meta.workbook
 * (由 xlsxToDoc 写入);若缺失则抛错(idoc 的可视投影不足以无损重建网格)。
 */
export async function docToXlsx(doc: NormalizedXlsx): Promise<Uint8Array> {
  const workbook = doc.meta?.workbook
  if (!workbook) {
    throw new Error('docToXlsx requires meta.workbook (produced by xlsxToDoc) for lossless encoding')
  }
  return await jsonToXlsx(workbook)
}
