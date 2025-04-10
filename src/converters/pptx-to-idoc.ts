import type { PPTXDeclaration, PPTXSource } from '../ooxml'
import type { PPTXConvertOptions } from './pptx-to-idoc-converter'
import { pptxToIDocConverter } from './pptx-to-idoc-converter'

export async function pptxToIDoc(
  source: PPTXSource,
  options: PPTXConvertOptions = {},
): Promise<PPTXDeclaration> {
  return await new pptxToIDocConverter().convert(source, options)
}
