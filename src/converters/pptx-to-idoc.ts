import type { DecodedPPTX, DecodeingPPTXSource, DecodePPTXOptions } from '../codecs'
import { PPTXDecoder } from '../codecs'

export async function pptxToIDOC(
  source: DecodeingPPTXSource,
  options: DecodePPTXOptions = {},
): Promise<DecodedPPTX> {
  return await new PPTXDecoder().decode(source, options)
}
