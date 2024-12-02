import { Pptx } from '../../src'

const input = document.createElement('input')
document.body.appendChild(input)
input.accept = '.pptx'
input.type = 'file'
input.onchange = async () => {
  const file = input.files?.[0]

  const pptx = Pptx.parse(new Uint8Array(await file?.arrayBuffer()))

  console.log(pptx.slides[0].elements)

  console.log(pptx)
}
