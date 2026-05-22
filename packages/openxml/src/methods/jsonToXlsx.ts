import type { Workbook } from '../ooxml'
import { JsonToXlsx } from '../converters'

export async function jsonToXlsx(workbook: Workbook): Promise<Uint8Array> {
  return await new JsonToXlsx().encode(workbook)
}
