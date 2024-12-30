import { presetShapeDefinitions } from '../../assets/presetShapeDefinitions.js'
import { OOXML, PPTX, PPTXToSVGRenderer } from '../../src'

console.warn(
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

  console.warn(pptx, pptx.toIDOC())

  document.body.appendChild(
    new PPTXToSVGRenderer(pptx).toSVG(),
  )
}
