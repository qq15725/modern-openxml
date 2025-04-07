import { presetShapeDefinitions } from '../assets/presetShapeDefinitions'
import { decodePPTX, pptxToSVG } from '../src'

const input = document.createElement('input')
document.body.appendChild(input)
input.accept = '.pptx'
input.type = 'file'
input.onchange = async () => {
  const file = input.files?.[0]
  parsePPTX(new Uint8Array(await file!.arrayBuffer()))
}

function xmlToDOM(xml: string): HTMLElement {
  const doc = new DOMParser().parseFromString(xml, 'application/xml') as XMLDocument
  const error = doc.querySelector('parsererror')
  if (error) {
    throw new Error(`${error.textContent ?? 'parser error'}\n${xml}`)
  }
  return doc.documentElement
}

async function parsePPTX(source: Uint8Array): Promise<void> {
  const pptx = await decodePPTX(source, { presetShapeDefinitions })
  console.warn(pptx)
  document.body.append(
    xmlToDOM(pptxToSVG(pptx)),
  )
}

async function testPPTX(): Promise<void> {
  for (const [key] of Object.entries(import.meta.glob('../test/fixtures/*.pptx', { query: '?raw' }))) {
    if (!key.endsWith('billFill.srcRect.pptx'))
      continue
    const filename = key.split('/').pop()
    const source = await fetch(filename!).then(rep => rep.arrayBuffer())
    parsePPTX(new Uint8Array(source))
    console.warn(filename)
  }
}

testPPTX()
