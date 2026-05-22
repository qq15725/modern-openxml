import type { XlsxSource } from '../converters'
import type { NormalizedXlsx } from '../ooxml'
import { workbookToDoc } from '../ooxml'
import { xlsxToJson } from './xlsxToJson'

/**
 * 解码 xlsx 为 idoc 文档(NormalizedXlsx)。原始 Workbook 模型保留在
 * meta.workbook,可用 docToXlsx 无损回写。
 */
export async function xlsxToDoc(source: XlsxSource): Promise<NormalizedXlsx> {
  return workbookToDoc(await xlsxToJson(source))
}
