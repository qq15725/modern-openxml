import type { Pptx } from '../ooxml'
import { IdocToPptxConverter } from '../converters'

export async function idocToPptx(source: Pptx): Promise<Uint8Array> {
  return await new IdocToPptxConverter().encode(source)
}
