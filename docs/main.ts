import presetShapeDefinitions from '../assets/presetShapeDefinitions'
import presetTextWarpDefinitions from '../assets/presetTextWarpDefinitions'
import { idocToPptx, parsePresetShapeDefinitions, parsePresetTextWarpDefinitions, pptxToIdoc, pptxToSvg, xmlToDom } from '../src'

document.querySelector<HTMLButtonElement>('#Decode')!.onclick = async () => {
  testPPTXToSVG(await openFileDialog())
}

document.querySelector<HTMLButtonElement>('#ReEncode')!.onclick = async () => {
  testPPTXReEncode(await openFileDialog())
}

document.querySelector<HTMLButtonElement>('#GeneratePresetShapes')!.onclick = async () => {
  const definitions = parsePresetShapeDefinitions(presetShapeDefinitions)
  console.warn(definitions)
  const width = 100
  const height = 100
  definitions.forEach((shape) => {
    const svg = xmlToDom<SVGSVGElement>(shape.generateSVGString({ width, height, strokeWidth: 2 }))
    svg.style.fill = '#c6dee8'
    svg.style.stroke = '#4874cb'
    document.body.append(svg)
  })
}

document.querySelector<HTMLButtonElement>('#GeneratePresetTextWarps')!.onclick = async () => {
  const definitions = parsePresetTextWarpDefinitions(presetTextWarpDefinitions)
  console.warn(definitions)
  const width = 100
  const height = 100
  definitions.forEach((shape) => {
    const svg = xmlToDom<SVGSVGElement>(shape.generateSVGString({ width, height, strokeWidth: 2 }))
    svg.style.fill = '#c6dee8'
    svg.style.stroke = '#4874cb'
    document.body.append(svg)
  })
}

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

async function testPPTXToSVG(source: Uint8Array): Promise<void> {
  console.warn(await pptxToIdoc(source, { presetShapeDefinitions }))
  const svg = await pptxToSvg(source, { presetShapeDefinitions })
  console.warn(svg)
  document.body.append(svg)
}

async function testPPTXReEncode(source: Uint8Array): Promise<void> {
  const doc = await pptxToIdoc(source, { presetShapeDefinitions })
  const blob = new Blob([await idocToPptx(doc)], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
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
