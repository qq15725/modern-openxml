import type { PPTXConvertOptions } from '../converters'
import type { PPTXSource } from '../ooxml'
import { IDocToSVGStringConverter } from '../converters'
import { pptxToIDoc } from './pptx-to-idoc'

export async function pptxToSVGString(
  source: PPTXSource,
  options: PPTXConvertOptions = {},
): Promise<string> {
  return new IDocToSVGStringConverter().convert(
    await pptxToIDoc(source, options),
  )
}
