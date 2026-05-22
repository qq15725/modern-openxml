import type { DocxSource } from '../converters'
import type { Docx } from '../ooxml'
import { DocxToJson } from '../converters'

export async function docxToJson(source: DocxSource): Promise<Docx> {
  return await new DocxToJson().decode(source)
}
