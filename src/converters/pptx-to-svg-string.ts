import type { DecodeingPPTXSource, DecodePPTXOptions } from '../codecs'
import { PPTXSVGRenderer } from '../renderers'
import { pptxToIDOC } from './pptx-to-idoc'

export async function pptxToSVGString(
  source: DecodeingPPTXSource,
  options: DecodePPTXOptions = {},
): Promise<string> {
  return new PPTXSVGRenderer().render(
    await pptxToIDOC(source, options),
  )
}
