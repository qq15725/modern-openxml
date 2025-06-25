import type { PPTX } from '../ooxml'
import { IDocToPPTXConverter } from '../converters'

export async function idocToPptx(source: PPTX): Promise<Uint8Array> {
  return await new IDocToPPTXConverter().encode(source)
}
