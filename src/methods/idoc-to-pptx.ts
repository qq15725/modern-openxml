import type { PPTX } from '../ooxml'
import { IDocToPPTXConverter } from '../converters'

export async function idocToPPTX(source: PPTX): Promise<Uint8Array> {
  return await new IDocToPPTXConverter().encode(source)
}
