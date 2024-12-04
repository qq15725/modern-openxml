import { OXML, Pptx } from '../../src'

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

  const pptx = Pptx.parse(new Uint8Array(await file?.arrayBuffer()))

  console.log(pptx.toJSON())
}
