import type { PPTXConvertOptions } from '../converters'
import type { PPTXSource } from '../ooxml'
import { pptxToSvgString } from './pptx-to-svg-string'
import { xmlToDom } from './xml-to-dom'

export async function pptxToSvg(
  source: PPTXSource,
  options: PPTXConvertOptions = {},
): Promise<SVGSVGElement> {
  return xmlToDom<SVGSVGElement>(
    await pptxToSvgString(source, options),
  )
}
