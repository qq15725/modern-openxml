import type { PPTXConvertOptions } from '../converters'
import type { PPTXSource } from '../ooxml'
import { pptxToSVGString } from './pptx-to-svg-string'
import { xmlToDOM } from './xml-to-dom'

export async function pptxToSVG(
  source: PPTXSource,
  options: PPTXConvertOptions = {},
): Promise<SVGSVGElement> {
  return xmlToDOM<SVGSVGElement>(
    await pptxToSVGString(source, options),
  )
}
