import type { CommonSlideData } from './CommonSlideData'
import type { ExtensionList } from './ExtensionList'
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
  @defineProperty('_elements') declare elements: OXML[]

  get _elements(): OXML[] {
    return Array.from(this.cSld.spTree.element.children).map(element => OXML.make(element))
  }
}
