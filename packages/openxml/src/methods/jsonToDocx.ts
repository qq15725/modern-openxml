import type { Docx } from '../ooxml'
import { JsonToDocx } from '../converters'

export async function jsonToDocx(docx: Docx): Promise<Uint8Array> {
  return await new JsonToDocx().encode(docx)
}
