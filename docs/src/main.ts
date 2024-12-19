import { presetShapeDefinitions } from '../../assets/presetShapeDefinitions.js'
import { OOXML, PPTX, SVGRenderer } from '../../src'

console.log(
  OOXML.tagToConstructor,
  OOXML.protoToDefinition,
)

const input = document.createElement('input')
document.body.appendChild(input)
input.accept = '.pptx'
input.type = 'file'
input.onchange = async () => {
  const file = input.files?.[0]
  const pptx = new PPTX(await file?.arrayBuffer(), {
    presetShapeDefinitions,
  })
  const svg = new SVGRenderer().render(pptx)
  document.body.appendChild(svg)
  console.log(pptx, pptx.toJSON())
}
