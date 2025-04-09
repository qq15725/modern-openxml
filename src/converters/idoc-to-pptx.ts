import type { IDOCPPTX } from '../ooxml'
import { PPTXEncoder } from '../codecs'

export async function idocToPPTX(
  source: IDOCPPTX,
): Promise<Uint8Array> {
  return await new PPTXEncoder().encode(source)
}
