import type { EncodeingPPTXSource } from '../codecs'
import { PPTXEncoder } from '../codecs'

export async function idocToPPTX(
  source: EncodeingPPTXSource,
): Promise<Uint8Array> {
  return await new PPTXEncoder().encode(source)
}
