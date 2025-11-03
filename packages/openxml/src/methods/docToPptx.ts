import type { Pptx } from '../ooxml'
import { DocToPptx } from '../converters'

export async function docToPptx(source: Pptx): Promise<Uint8Array> {
  return await new DocToPptx().encode(source)
}
