import type { DecodeingPPTXSource, DecodePPTXOptions } from '../codecs'
import type { IDOCPPTXDeclaration } from '../ooxml'
import { PPTXDecoder } from '../codecs'

export async function pptxToIDOC(
  source: DecodeingPPTXSource,
  options: DecodePPTXOptions = {},
): Promise<IDOCPPTXDeclaration> {
  return await new PPTXDecoder().decode(source, options)
}
