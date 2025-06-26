import type { PptxConvertOptions } from '../converters'
import type { PptxSource } from '../ooxml'
import { IdocToSvgStringConverter } from '../converters'
import { pptxToIdoc } from './pptxToIdoc'

export async function pptxToSvgString(
  source: PptxSource,
  options: PptxConvertOptions = {},
): Promise<string> {
  return new IdocToSvgStringConverter().convert(
    await pptxToIdoc(source, options),
  )
}
