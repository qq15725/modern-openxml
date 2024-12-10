import { OXML, PPTX, SVGRenderer } from '../../src'

console.log(
  OXML.tagToConstructor,
  OXML.protoToDefinition,
)

const input = document.createElement('input')
document.body.appendChild(input)
input.accept = '.pptx'
input.type = 'file'
input.onchange = async () => {
  const file = input.files?.[0]

  const pptx = PPTX.parse(new Uint8Array(await file?.arrayBuffer()))

  const svg = new SVGRenderer().render(pptx)
  document.body.appendChild(svg)

  console.log(pptx, pptx.toJSON())
}
