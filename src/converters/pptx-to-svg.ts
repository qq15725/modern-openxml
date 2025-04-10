import type { PPTXSource } from '../ooxml'
import type { PPTXConvertOptions } from './pptx-to-idoc-converter'
import { pptxToSVGString } from './pptx-to-svg-string'

export async function pptxToSVG(
  source: PPTXSource,
  options: PPTXConvertOptions = {},
): Promise<SVGSVGElement> {
  return xmlToDOM(
    await pptxToSVGString(source, options),
  ) as SVGSVGElement
}

function xmlToDOM(xml: string): Element {
  const doc = new DOMParser().parseFromString(xml, 'application/xml') as XMLDocument
  const error = doc.querySelector('parsererror')
  if (error) {
    throw new Error(`${error.textContent ?? 'parser error'}\n${xml}`)
  }
  return doc.documentElement
}
