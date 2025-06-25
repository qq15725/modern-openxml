import type { PPTXConvertOptions } from '../converters'
import type { NormalizedPPTX, PPTXSource } from '../ooxml'
import { PPTXToIDocConverter } from '../converters'

export async function pptxToIdoc(
  source: PPTXSource,
  options: PPTXConvertOptions = {},
): Promise<NormalizedPPTX> {
  return await new PPTXToIDocConverter().convert(source, options)
}
