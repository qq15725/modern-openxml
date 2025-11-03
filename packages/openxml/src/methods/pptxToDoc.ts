import type { PptxConvertOptions } from '../converters'
import type { NormalizedPptx, PptxSource } from '../ooxml'
import { PptxToDoc } from '../converters'

export async function pptxToDoc(
  source: PptxSource,
  options: PptxConvertOptions = {},
): Promise<NormalizedPptx> {
  return await new PptxToDoc().convert(source, options)
}
