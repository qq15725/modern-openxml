import type { PPTX } from '../ooxml'
import { IDocToPPTXConverter } from './idoc-to-pptx-converter'

export async function idocToPPTX(source: PPTX): Promise<Uint8Array> {
  return await new IDocToPPTXConverter().encode(source)
}
