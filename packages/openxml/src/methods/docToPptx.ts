import type { DocToPptxOptions } from '../converters'
import type { Pptx } from '../ooxml'
import { DocToPptx } from '../converters'

export async function docToPptx(source: Pptx, options?: DocToPptxOptions): Promise<Uint8Array> {
  return await new DocToPptx(options).encode(source)
}
