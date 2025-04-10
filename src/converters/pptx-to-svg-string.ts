import type { PPTXSource } from '../ooxml'
import type { PPTXConvertOptions } from './pptx-to-idoc-converter'
import { IDocToSVGStringConverter } from './idoc-to-svg-string-converter'
import { pptxToIDoc } from './pptx-to-idoc'

export async function pptxToSVGString(
  source: PPTXSource,
  options: PPTXConvertOptions = {},
): Promise<string> {
  return new IDocToSVGStringConverter().convert(
    await pptxToIDoc(source, options),
  )
}
