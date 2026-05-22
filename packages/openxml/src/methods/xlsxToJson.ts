import type { XlsxSource } from '../converters'
import type { Workbook } from '../ooxml'
import { XlsxToJson } from '../converters'

export async function xlsxToJson(source: XlsxSource): Promise<Workbook> {
  return await new XlsxToJson().decode(source)
}
