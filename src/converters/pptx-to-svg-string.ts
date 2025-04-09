import type { IDOCPPTXSource } from '../ooxml'
import type { IDOCPPTXConvertOptions } from './pptx-to-idoc-converter'
import { IDOCToSVGStringConverter } from './idoc-to-svg-string-converter'
import { pptxToIDOC } from './pptx-to-idoc'

export async function pptxToSVGString(
  source: IDOCPPTXSource,
  options: IDOCPPTXConvertOptions = {},
): Promise<string> {
  return new IDOCToSVGStringConverter().convert(
    await pptxToIDOC(source, options),
  )
}
