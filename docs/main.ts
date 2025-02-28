import { presetShapeDefinitions } from '../assets/presetShapeDefinitions'
import { decodePPTX, pptxToSVG } from '../src'

const input = document.createElement('input')
document.body.appendChild(input)
input.accept = '.pptx'
input.type = 'file'
input.onchange = async () => {
  const file = input.files?.[0]
  const pptx = await decodePPTX(new Uint8Array(await file!.arrayBuffer()), { presetShapeDefinitions })
  console.warn(pptx)
}

function xmlToDOM(xml: string): HTMLElement {
  const doc = new DOMParser().parseFromString(xml, 'application/xml') as XMLDocument
  const error = doc.querySelector('parsererror')
  if (error) {
    throw new Error(`${error.textContent ?? 'parser error'}\n${xml}`)
  }
  return doc.documentElement
}

async function testPPTX(): Promise<void> {
  for (const [key] of Object.entries(import.meta.glob('../test/fixtures/*.pptx', { query: '?raw' }))) {
    if (!key.endsWith('billFill.srcRect.pptx'))
      continue
    const filename = key.split('/').pop()
    const source = await fetch(filename!).then(rep => rep.arrayBuffer())
    const pptx = await decodePPTX(new Uint8Array(source), { presetShapeDefinitions })
    console.warn(filename)
    console.warn(pptx)
    document.body.append(
      xmlToDOM(pptxToSVG(pptx)),
    )
  }
}

testPPTX()
