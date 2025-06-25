import type { PPTXConvertOptions } from '../converters'
import type { PPTXSource } from '../ooxml'
import { IDocToSVGStringConverter } from '../converters'
import { pptxToIdoc } from './pptx-to-idoc'

export async function pptxToSvgString(
  source: PPTXSource,
  options: PPTXConvertOptions = {},
): Promise<string> {
  return new IDocToSVGStringConverter().convert(
    await pptxToIdoc(source, options),
  )
}
