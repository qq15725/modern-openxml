import presetShapeDefinitions from '../assets/presetShapeDefinitions'
import { idocToPPTX, parsePresetShapeDefinitions, pptxToIDoc, pptxToSVG } from '../src'

console.warn(parsePresetShapeDefinitions(presetShapeDefinitions))

function openFileDialog(): Promise<Uint8Array> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pptx'
    input.onchange = async () => {
      const file = input.files?.[0]
      resolve(new Uint8Array(await file!.arrayBuffer()))
    }
    input.click()
  })
}

const btn1 = document.querySelector('#decode') as HTMLButtonElement
btn1.onclick = async () => {
  testPPTXToSVG(await openFileDialog())
}

const btn2 = document.querySelector('#reEncode') as HTMLButtonElement
btn2.onclick = async () => {
  testPPTXReEncode(await openFileDialog())
}

async function testPPTXToSVG(source: Uint8Array): Promise<void> {
  console.warn(await pptxToIDoc(source, { presetShapeDefinitions }))
  const svg = await pptxToSVG(source, { presetShapeDefinitions })
  console.warn(svg)
  document.body.append(svg)
}

async function testPPTXReEncode(source: Uint8Array): Promise<void> {
  const doc = await pptxToIDoc(source, { presetShapeDefinitions })
  const blob = new Blob([await idocToPPTX(doc)], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
  downloadBlob(blob, 'output.pptx')
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
