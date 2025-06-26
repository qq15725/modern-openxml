import type { PptxConvertOptions } from '../converters'
import type { PptxSource } from '../ooxml'
import { pptxToSvgString } from './pptxToSvgString'
import { xmlToDom } from './xmlToDom'

export async function pptxToSvg(
  source: PptxSource,
  options: PptxConvertOptions = {},
): Promise<SVGSVGElement> {
  return xmlToDom<SVGSVGElement>(
    await pptxToSvgString(source, options),
  )
}
