import type { ColorMapOverride } from './ColorMapOverride'
import type { CommonSlideData } from './CommonSlideData'
import type { ExtensionList } from './ExtensionList'
import type { Timing } from './Timing'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'
import { getElements } from './_utils'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slide
 */
@defineElement('p:sld')
export class Slide extends OXML {
  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  }

  @defineChild('p:clrMapOvr') declare clrMapOvr: ColorMapOverride
  @defineChild('p:cSld') declare cSld: CommonSlideData
  @defineChild('p:extLst') declare extLst: ExtensionList
  @defineChild('p:timing') declare timing: Timing
  @defineChild('p:transition') declare transition: OXML
  @defineChild('mc:AlternateContent') declare AlternateContent: OXML

  @defineProperty('cSld.spTree.nvGrpSpPr.cNvPr.id') declare id: string
  @defineProperty('cSld.spTree.nvGrpSpPr.cNvPr.name') declare name: string
  @defineProperty(['getElements']) declare elements: OXML[]

  getElements(): OXML[] {
    return getElements(this.cSld.spTree.element.children)
  }
}
