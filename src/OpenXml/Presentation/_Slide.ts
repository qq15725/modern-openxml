import type { CommonSlideData } from './CommonSlideData'
import type { ConnectionShape } from './ConnectionShape'
import type { ExtensionList } from './ExtensionList'
import type { GraphicFrame } from './GraphicFrame'
import type { GroupShape } from './GroupShape'
import type { Picture } from './Picture'
import type { Shape } from './Shape'
import type { Timing } from './Timing'
import { defineChild, defineProperty, OXML } from '../../core'

export class _Slide extends OXML {
  @defineChild('p:cSld') declare cSld: CommonSlideData
  @defineChild('p:extLst') declare extLst: ExtensionList
  @defineChild('p:timing') declare timing: Timing
  @defineChild('p:transition') declare transition: OXML
  @defineChild('mc:AlternateContent') declare AlternateContent: OXML

  @defineProperty('cSld.spTree.nvGrpSpPr.cNvPr.id') declare id: string
  @defineProperty('cSld.spTree.nvGrpSpPr.cNvPr.name') declare name: string
  @defineProperty('_elements') declare elements: (Shape | GroupShape | Picture | ConnectionShape | GraphicFrame)[]

  get _elements(): (Shape | GroupShape | Picture | ConnectionShape | GraphicFrame)[] {
    return Array.from(this.cSld.spTree.element.children)
      .map((element) => {
        switch (element.tagName) {
          case 'p:nvGrpSpPr':
          case 'p:grpSpPr':
            return undefined
          case 'p:sp':
          case 'p:grpSp':
          case 'p:cxnSp':
          case 'p:pic':
          case 'p:graphicFrame':
          default:
            return OXML.make(element)
        }
      })
      .filter(Boolean) as any[]
  }
}
