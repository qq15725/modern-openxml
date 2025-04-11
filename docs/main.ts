import presetShapeDefinitions from '../assets/presetShapeDefinitions'
import { pptxToIDoc, pptxToSVG } from '../src'

const input = document.createElement('input')
document.body.appendChild(input)
input.accept = '.pptx'
input.type = 'file'
input.onchange = async () => {
  const file = input.files?.[0]
  parsePPTX(new Uint8Array(await file!.arrayBuffer()))
}

async function parsePPTX(source: Uint8Array): Promise<void> {
  console.warn(await pptxToIDoc(source, { presetShapeDefinitions }))
  const svg = await pptxToSVG(source, { presetShapeDefinitions })
  console.warn(svg)
  document.body.append(svg)
}

async function testPPTX(): Promise<void> {
  for (const [key] of Object.entries(import.meta.glob('../test/fixtures/*.pptx', { query: '?raw' }))) {
    if (!key.endsWith('complex2.pptx'))
      continue
    const filename = key.split('/').pop()
    const source = await fetch(filename!).then(rep => rep.arrayBuffer())
    parsePPTX(new Uint8Array(source))
    console.warn(filename)
  }
}

testPPTX()
