import type { IDOCPPTX } from '../ooxml'
import { IDOCToPPTXConverter } from './idoc-to-pptx-converter'

export async function idocToPPTX(source: IDOCPPTX): Promise<Uint8Array> {
  return await new IDOCToPPTXConverter().encode(source)
}
