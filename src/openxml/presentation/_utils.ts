import type { OXML } from '../../core'
import { ConnectionShape } from './ConnectionShape'
import { GraphicFrame } from './GraphicFrame'
import { GroupShape } from './GroupShape'
import { Picture } from './Picture'
import { Shape } from './Shape'

export function getElements(children: HTMLCollection): OXML[] {
  const elements: OXML[] = []
  Array.from(children).forEach((element) => {
    switch (element.tagName) {
      case 'p:nvGrpSpPr':
      case 'p:grpSpPr':
        // skip
        break
      case 'p:sp':
      case 'dsp:sp':
        elements.push(new Shape().fromElement(element))
        break
      case 'p:pic':
        elements.push(new Picture().fromElement(element))
        break
      case 'p:grpSp':
        elements.push(new GroupShape().fromElement(element))
        break
      case 'p:cxnSp':
        elements.push(new ConnectionShape().fromElement(element))
        break
      case 'p:graphicFrame':
        elements.push(new GraphicFrame().fromElement(element))
        break
      default:
        console.warn(element)
        break
    }
  })
  return elements
}
