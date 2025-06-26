import type { PptxConvertOptions } from '../converters'
import type { NormalizedPptx, PptxSource } from '../ooxml'
import { PptxToIdocConverter } from '../converters'

export async function pptxToIdoc(
  source: PptxSource,
  options: PptxConvertOptions = {},
): Promise<NormalizedPptx> {
  return await new PptxToIdocConverter().convert(source, options)
}
