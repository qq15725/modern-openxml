import type { PPTXDeclaration, PPTXSource } from '../ooxml'
import type { PPTXConvertOptions } from './pptx-to-idoc-converter'
import { PPTXToIDocConverter } from './pptx-to-idoc-converter'

export async function pptxToIDoc(
  source: PPTXSource,
  options: PPTXConvertOptions = {},
): Promise<PPTXDeclaration> {
  return await new PPTXToIDocConverter().convert(source, options)
}
