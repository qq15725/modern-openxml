import type { IDOCPPTXDeclaration, IDOCPPTXSource } from '../ooxml'
import type { IDOCPPTXConvertOptions } from './pptx-to-idoc-converter'
import { PPTXToIDOCConverter } from './pptx-to-idoc-converter'

export async function pptxToIDOC(
  source: IDOCPPTXSource,
  options: IDOCPPTXConvertOptions = {},
): Promise<IDOCPPTXDeclaration> {
  return await new PPTXToIDOCConverter().convert(source, options)
}
